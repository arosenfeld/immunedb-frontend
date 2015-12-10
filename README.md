simlab-database
===============
With [node.js](http://nodejs.org) installed, run:

    npm install

The following environment variables are used by webpack to generate content:

* `API_ENDPOINT`: Full URL to the backend API
* `BASE_URL`: The base URL at which the content is served
* `SITE_TITLE` (optional): A custom site title can be specified otherwise it will default to "SimLab Database"

To serve content for development purposes only, run:

    npm run serve
