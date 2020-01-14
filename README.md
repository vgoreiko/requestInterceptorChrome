### This is chrome extension for modifying responseBody, statusCode

### Technologies stack
1. Chrome browser api
2. React + Typescript (*.tsx)

### How to install
1. Fetch current repository
2. `npm ci`
3. `npm run build`

### How to use
1. Finish "How to install"
2. Open chrome with url [chrome://extensions/](chrome://extensions/)
3. Enable developer mode (right, top toggler)
4. Click "Load unpacked"
5. Select place, 'build' folder (inner)
6. Open needed tab and click on extension icon
7. Whoa, use it:)

### Development
1.  Just to develop front side - use
`npm run start`
(chrome api not available, no events will fire)

2. Development with chrome api 
`npm run watch`
(rebuilding project and copying files to **build** folder.
Minification if switched off)

3. Development with chrome api (manual rebuild)
`npm run build`
Minification if switched on)

Helpfull links:
1) https://chromedevtools.github.io/devtools-protocol/tot/Fetch
2) Possible start: https://github.com/jhen0409/react-chrome-extension-boilerplate
3) https://levelup.gitconnected.com/how-to-use-react-js-to-create-chrome-extension-in-5-minutes-2ddb11899815
4) https://chromedevtools.github.io/devtools-protocol/tot/Network
5) https://github.com/huchenme/hacker-tab-extension
6) chrome://extensions/
7 https://facebook.github.io/create-react-app/docs/adding-typescript
