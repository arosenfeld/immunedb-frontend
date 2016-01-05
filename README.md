simlab-database
===============
With [node.js](http://nodejs.org) installed, run:

    npm install

The following environment variables are used by webpack to generate content:

* `API_ENDPOINT`: Full URL to the backend API
* `BASE_URL`: The base URL at which the content is served
* `SITE_TITLE` (optional): A custom site title can be specified otherwise it will default to "SimLab Database"

Development Server
------------------
To serve content for development purposes only, run:

    npm run serve

Production Build
----------------
To build static files which can be served via a web server:

    npm run build
    cp -r dist /path/to/serve/from

For NGINX, add the following to your configuration:

    location /path/to/frontend {
        alias /path/to/serve/from;
        index index.html;
        try_files $uri $uri/ /path/to/frontend/index.html;
    }
