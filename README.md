## Management App Project

Jiaying Chen

### Requirement: <br>
Node@12.10.0 
NPM@6.7 or later <br>
Firebase private key file in JSON format downloaded from your firebase project. <br>
 
In your firebase project: <br>
go to `project settings` -> `Service accounts` -> `Generate new private key`<br>
Then in your current shell session run:<br>
for linux or macOS: <br>
`export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"`<br>
for windows:<br>
`$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\username\Downloads\service-account-file.json"`<br>
**Note: if you open a new session, set the variable again.**<br>
For firebase config on the client side: <br>
got to `project settings` -> `Service accounts` <br>
all the way at the bottom of the page copy your Firebase SDK snippet <br>
Once you have copied your configuration:<br>
1. change directory into the client folder<br>
2. in the .env file, replace your configuration values with the file's values<br>

### To install all dependencies: <br>
In the CISC4900 directory: <br>
`npm install` for all express server dependencies <br>
In the client directory: <br>
`npm install` again for all client side dependencies

### To start server
**Note: this will run on localhost:5000** <br>
In the CISC4900 directory: `node Server.js` 

### To start client side
**Note: this will run on localhost:3000**<br>
In the client directory: `npm start` 
