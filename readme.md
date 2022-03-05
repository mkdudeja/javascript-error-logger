# Javascript/ React error logger (with typescript)

This repo contains the files for error logger utiltity for javascript/ react.

It has two transporter by default as below:
- Console - `console.transporter.ts`
- HTTP - `http.transporter.ts`

New transporters can be created on need basis which extends from the base transporter and can be initialized in the `logger.service.ts`.


## Following is the default configuration:

`[DEV]`
- Console Transporter

`[PROD]`
- HTTP Transporter

`[APP_URL?debug=1]`
- Console Transporter

## `logLevel` 
level can be configured to filter and log messages below the configured level only. log level `error` will log messages of type `error` only. Helpful in prod env where one don't to capture `logs`, `debug` and `info`, but these make sense for dev env. 

## Dependencies
 - rxjs - To buffer the messages in HTTP transporter to minimize the HTTP calls on server and send one chunk of messages (usage debouncing)

 ### Feel to provide your feedack @ <manishdudeja@outlook.com>
 