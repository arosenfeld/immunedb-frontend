immunedb-frontend
===============
# Introduction
This repository contains the web interface to
[ImmuneDB](http://github.com/arosenfeld/immunedb).  If you plan on using
Docker, you can ignore this repository and refer to the [ImmuneDB
documentation](http://immunedb.com).

This readme is meant for users who prefer to run ImmuneDB on bare-metal.

# Building
With [node.js](http://nodejs.org) installed, run:

    npm install


# Running
Before running, the variable `API_ENDPOINT` must be set to the full URL of the
backend API (served by `immunedb_rest`).  In addition, the following optional
variables may be set:

* `BASENAME`: Prefix after hostname to the app (e.g. for http://site.com/mydb
  the value should be set to `mydb`)
* `SITE_TITLE`: A custom site title can be specified otherwise it will default
  to "ImmuneDB"
* `NODE_ENV`: If set to 'production', builds the package in production mode,
  reducing debug information and placing a version label on the website.

Then, to run the development server:

    npm run

Or to build static assets in the `build` directory:

    npm build


For example, to generate static files to serve from `myurl.com/mydb` where the
REST service is running on port 5000 (the default):

    BASENAME=mydb API_ENDPOINT=http://myurl.com:5000 npm run build

You can then serve the files in `dist` under the `mydb` path for `myurl.com`.
The detils of serving files differs based on the web server you plan to use.
