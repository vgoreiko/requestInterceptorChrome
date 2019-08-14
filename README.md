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
