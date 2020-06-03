import './env'
import './Library/String.extension'
import yargs from 'yargs'
import path from 'path'
import { IStorage } from './Library/Storage/IStorage'
import { LocalhostFileStorage } from './Library/Storage/LocalhostFileStorage'
import _ from 'lodash'
import fs, { watchFile } from 'fs'
import { waitRandomly } from './Library/Wait'
import fetch from 'node-fetch'
import papaparse from 'papaparse'
import { IScraper } from './Library/Scraper/IScraper'
import { Scraper } from './Library/Scraper/Scraper'

// parse csv file to JSON
function toJson(filepath: string): Promise<any> {
  const file = fs.createReadStream(filepath)
  return new Promise((resolve, reject) => {
    papaparse.parse(file, {
      header: true,
      complete(results, file) {
        resolve(results.data)
      },
      error(err, file) {
        reject(err)
      },
    })
  })
}

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: any[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function run() {
  // set up dependencies
  const dataPath = path.join(__dirname, '../data'),
    filesPath = path.join(dataPath, 'files'),
    cookieFileName = 'cookie.txt',
    idsFileName = 'ids.txt'

  const scrapper: IScraper = new Scraper()
  const dataStorage: IStorage = new LocalhostFileStorage(dataPath)
  const filesStorage: IStorage = new LocalhostFileStorage(filesPath)

  // handle commands
  yargs
    .showHelpOnFail(true)
    .command(
      'login',
      'Login to your strava account.',
      yargs => yargs,
      async argv => {
        let cookie = await scrapper.getCookie(
          'https://www.strava.com/login',
          'https://www.strava.com/dashboard'
        )
        dataStorage.save(cookieFileName, cookie)
      }
    )
    .command(
      'get-activity-ids',
      'Get the ids for all activities.',
      yargs => yargs,
      async argv => {
        // get cookie
        let cookie = dataStorage.read(cookieFileName)

        // get ids
        let ids: string[] = [],
          page = 1,
          total = -1

        do {
          console.log(
            `Deplaying request for ${await waitRandomly(
              1000,
              5000
            )} milliseconds ...`
          )

          let url = `https://www.strava.com/athlete/training_activities?keywords=&activity_type=&workout_type=&commute=&private_activities=&trainer=&gear=&new_activity_only=false&page=${page++}&per_page=20`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              cookie,
              'x-requested-with': 'XMLHttpRequest',
            },
          })

          const jsonStr = await streamToString(response.body)
          const jsonObj = JSON.parse(jsonStr)
          for (const id of jsonObj.models.map((m: any) => m.id.toString())) {
            ids.push(id)
          }
          total = jsonObj.total
        } while (ids.length < total)

        ids = _.uniq(ids)

        // store ids
        dataStorage.save(idsFileName, JSON.stringify(ids))
      }
    )
    .command(
      'export-activities',
      'Export all activities in gpx format.',
      yargs => yargs,
      async argv => {
        // get activity ids
        let activityIds = JSON.parse(dataStorage.read(idsFileName))
        console.log(activityIds)

        // get cookie
        let cookie = dataStorage.read(cookieFileName)

        // download files
        let n_url = 1,
          max_url = 1 // activityIds.length
        for (const activityId of activityIds) {
          console.log(
            `\n=> ${n_url} of ${activityIds.length}. Fetching audio files for ${activityId}`
          )

          // skip if file already exists
          let fetched = false
          try {
            let downloadedIds = fs
              .readdirSync(filesPath, { withFileTypes: true })
              .filter(d => d.isFile())
              .map(f => f.name.substr(0, f.name.length - 4))

            fetched = _.chain(downloadedIds)
              .some(id => id === activityId)
              .value()
          } catch (error) {
            console.log(`    The path ${filesPath} doesn't exist.`)
          }

          if (fetched) {
            console.log(`    Skipping fetching activity ${activityId}.`)
          } else {
            // download gpx file
            let exportUrl = `https://www.strava.com/activities/${activityId}/export_gpx`
            console.log(`    Fetching ${exportUrl}.`)
            let wait = await waitRandomly(1000, 5000)
            console.log(`    Waited for ${wait}.`)
            const response = await fetch(exportUrl, {
              method: 'GET',
              headers: {
                cookie,
              },
            })
            filesStorage.save(`${activityId}.gpx`, response.body)
          }

          if (n_url++ >= max_url) break
        }
      }
    )
    .demandCommand().argv
}

run()
