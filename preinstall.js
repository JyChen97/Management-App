//This file is for heroku to setup environment variables to connect to firebase

const fs = require('fs');

fs.writeFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GOOGLE_CONFIG, (err)=>{});