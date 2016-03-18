sldb-frontend
===============
With [node.js](http://nodejs.org) installed, run:

    npm install

The following environment variables are used by webpack to generate content:

* `API_ENDPOINT`: Full URL to the backend API
* `BASE_URL`: The base URL at which the content is served
* `SITE_TITLE` (optional): A custom site title can be specified otherwise it will default to "SimLab Database"
* `NODE_ENV` (optional): If set to 'production', builds the package in
  production mode, reducing debug information and placing a version label on the
  website.

It is assumed that `API_ENDPOINT` and `BASE_URL` are set for the remainder of
this README.

Development Server
------------------
To serve content for development purposes only, run:

    npm run serve

Running in Docker
-----------------
Docker can be used to serve the SLDB frontend.  This should not be used in
production, however.

    docker build -t sldb-frontend .
    docker run -p 8080:8080 -e "BASE_URL=http://localhost:8080" -e \
        "API_ENDPOINT=http://localhost:5000" sldb-frontend

This will serve the web app from `http://localhost:8080` and assumes
`sldb_rest` is running on localhost port 5000.

Production Build
----------------
To build static files which can be served via a web server:

    NODE_ENV=production npm run build
    cp -r dist /path/to/serve/from

For NGINX, add the following to your configuration:

    location /path/to/frontend {
        alias /path/to/serve/from;
        index index.html;
        try_files $uri $uri/ /path/to/frontend/index.html;
    }
