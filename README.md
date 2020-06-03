# Strava activities bulk exporter for Garmin Connect

## What is this?

This tool exports all your Strava activities into gpx files, which can then be uploaded into your Garmin Connect account.

## Why?

Importing your training activities from Garmin to Strava is easy, but not the other way around. According to [Garmin's support site](https://support.garmin.com/en-AU/?faq=Ht3ZP52Kju075uKvqTqu99),

> For a GPX file to successfully upload to Garmin Connect, the file must include time information. If you are exporting activities from Strava with the intent of importing them to Garmin Connect, you will need to export the activities as single activities rather than a bulk export.

I had hundreds of training activities in Strava, and didn't want to export them one by one. So I wrote this tool to export all my Strava activities into gpx files that's compatible with Garmin Connect.

## How does it work ?

This tool first lancuhes a pupputeer.js chromium instance, which it uses to allow you to interactivtely authenticate with the real Strava website. Once logged in, it'll save your cookies into a separate file (`cookie.txt`) in order to authenticate further API requests.

It then runs a second command against the Strava API to get the ids of all your training activties, which will then be used to export the gpx files for each activities.

## Usage

```bash
# 1. Clone the repo
git clone git@github.com:ZeanQin/strava-activities-bulk-exporter-for-garmin-connect.git

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Login
npm run login

# 5. Get ids for all activities
npm run get-activity-ids

# 6. Download gpx files for all activities
npm run export-activities
```

## Is this against Strava's Terms of Service?

I don't know, and I don't think so.

## Detection evasion

I feel like most companies have some kind of detection for web scrapping. Therefore all requests sent by this tool applies a random delay between 1 - 5 seconds before sending each request.

## Known issues

I put together this tool really quickly, and most of the code is pulled from a different project I'm building. Therefore it includes some unneccessary files. Let me know if you have any questions at `dev@zean.be`.
