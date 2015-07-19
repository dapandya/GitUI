# Git UI Experimental App

This App works as a single page app without using any 3rd party MVC frameworks
- I have created my own router / model / view
- When you navigate to new view, the old view gets deinitiazed (and all its subsequent dependencies) to prevent any memory / dangling event handlers issues
- So essentially you can run this app for a long time without having any slowdown due to memory leaks

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
- Once tests are finished, the app navigates to main view.
- Technically the test templates and production template should be same, so any issues with change in template gets caught.
However, here I have to keep it separate since I would need serverside setup (which may become a bit larger project) to include common template file in to both test and actual app.
