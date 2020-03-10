const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const timeStampRouter = require('./routers/Timestamp')
const announcementRouter = require('./routers/AnnouncementBoard')
const updateInfoRouter = require('./routers/updateInfo')
const timeScheduleRouter = require('./routers/ViewSchedule')
const authRouter = require('./routers/Auth')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Each request would need to go through isAuthenticated middleware to check for correct user creditials
app.use(timeScheduleRouter)
app.use(updateInfoRouter)
app.use(timeStampRouter)
app.use(announcementRouter)
app.use(authRouter)

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

module.exports = app