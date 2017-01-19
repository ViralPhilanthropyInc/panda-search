# panda-search
This free demo tool was built to quickly verify which charities can be donated to using the PandaPay.io Donations API.

# Overview

panda-search is a static web app which utilizes PandaPay's Algolia search index for charity information and the PandaPay API to process donations.  
The contents of `js/` are the entirety of the webapp, which are transformed into a single js file for the frontend using *browserify*.
It is currently deployed to an s3 bucket http://panda-search.s3-website-us-east-1.amazonaws.com/.
It's two data sources are

* **Algolia** - Uses Algolia's [instantsearch.js](https://www.algolia.com/doc/guides/search/instant-search/)
* **PandaPay Donations API** - Uses the [PandaPay Donations API](https://www.pandapay.io/docs#settingupapi)

# static-server.js

A static nodejs webserver for local development, or deployment to a non-S3 web app host.  The server can be run locally with:

```
  # server runs at http://localhost:$PORT, where $PORT defaults to 8000
  > node static-server.js
```

# index.html

The static web app

# js/app.js

Browserify entrypoint.  This just `require`s and initializes everything else

# js/donation-form.js

Handles all javascript events for the donation form, and the event handler for the **Donate** buttons.  Used by **js/panda.js**

# js/globals.js

Sets up jQuery and Bootstrap.  Ideally, jQuery wouldn't be global, but as of the time of this writing, is was required to be for bootstrap.js to work right

# js/panda.js

Renders donation forms (using **js/donation-form.js**) and handles all AJAX calls to the PandaPay Donations API

# js/search.js

Handles search box and rendering of search results using PandaPay's Algolia Charity Search Index
