//File name: Server.js
//This file is my server, run "node Server.js" to start up the server on the command line
//Contains all the routes for my functionalities
const express = require('express')
const bodyParser = require('body-parser')
const timeStampRouter = require('./routers/Timestamp')
const announcementRouter = require('./routers/AnnouncementBoard')
const updateInfoRouter = require('./routers/updateInfo')
const timeScheduleRouter = require('./routers/ViewSchedule')
const authRouter = require('./routers/Auth')
const port = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Each request would need to go through isAuthenticated middleware to check for correct user creditials
app.use(timeScheduleRouter)
app.use(updateInfoRouter)
app.use(timeStampRouter)
app.use(announcementRouter)
app.use(authRouter)

app.listen(port, () => {
  console.log('server listening on port:' + port )
 })