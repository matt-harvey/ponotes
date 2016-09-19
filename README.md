* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X (or download installer from site). Requires a fairly recent version of Node.
    * [Brunch](http://brunch.io): `npm install -g brunch` (optional)
    * Brunch plugins and dependencies: `npm install`
* Run:
    * `npm start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `npm run build:prod` — builds minified project for production
* Directory structure:
    * `public/` dir is fully auto-generated and served by HTTP server. Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.

This project was created with the help of the ["ng-brunch" Brunch skeleton](http://github.com/colinbate/ng2-brunch).
