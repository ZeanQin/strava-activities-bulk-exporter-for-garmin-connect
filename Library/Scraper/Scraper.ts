import { IScraper } from './IScraper'
import { launch, LoadEvent } from 'puppeteer'
import { Link } from '../Models/Link'
import { ISHA1 } from '../SHA1/ISHA1'
import { SHA1 } from '../SHA1/SHA1'

export class Scraper implements IScraper {
  private _SHA1: ISHA1 = new SHA1()

  async extract(
    url: string,
    query: () => { name: string; url: string }[]
  ): Promise<Link[]> {
    let links: Link[] = []

    try {
      const browser = await launch({
        // executablePath: 'chrome.exe',
        headless: true,
        timeout: 0,
        defaultViewport: null,
      })
      const page = await browser.newPage()
      await page.goto(url, {
        timeout: 0,
        waitUntil: ['domcontentloaded'],
      })

      const items = await page.evaluate(query)

      for (const item of items) {
        links.push(new Link(this._SHA1.hash(item.url), item.name, item.url))
      }

      browser.close()
    } catch (error) {
      console.log(error)
    }

    return links
  }

  async getCookie(loginUrl: string, redirectUrl: string): Promise<string> {
    let cookieData = ''
    try {
      const browser = await launch({
        headless: false,
        timeout: 0,
        defaultViewport: null,
      })

      const page = await browser.newPage()
      await page.goto(loginUrl, {
        timeout: 0,
        waitUntil: ['domcontentloaded'],
      })

      while (page.url() != redirectUrl) {
        await page.waitForNavigation({ timeout: 0 })
      }

      const cookies = await page.cookies()
      // console.log(cookies)

      cookieData = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ')

      browser.close()
    } catch (error) {
      console.log(error)
    }

    return cookieData
  }
}
