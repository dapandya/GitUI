# Git UI Experimental App

This App works as a single page app without using any 3rd party MVC frameworks

External Lib used:
- Bootstrap css
- jQuery
- handlebar.js for clientSide templating

# How to run the app
go to: http://dapandya.github.io/GitUI

# How to run the test
go to: http://dapandya.github.io/GitUI/testRunner.html

Note:
- Here I have demonstrated integration test cases where I have recorded the mock data so it does not need to make server request
- When running test do not refresh the page.
- Once tests are finished, change the url and go back to
- Technically the test templates and production template should be same, so any issues with change in template gets caught.
However, here I have to keep it separate since I would need serverside (which may become larger a larger project) to include common template file in to both test and actual app.
