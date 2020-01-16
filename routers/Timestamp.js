//File name: Timestamp.js
//Contains all the endpoints for timestamp functionalities
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

//This function checks if the user has already sign in, it would send a response back to the client
//This would switch between sign in and sign out
router.post('/getClockStatus', isAuthenticated, (req, res) =>{
    var uid = res.locals.userID
    var date = req.body.date
    usersRef = ref.child('Users/' + uid + '/Schedule/')
    usersRef.once("value", snapshot => {                  //get the user object from the database
      if(snapshot.hasChild(date)){                        //if there's a date, it means the user is already sign in
        res.send({"clockIn": true})
      }else{
        res.send({"clockIn": false})
      }
    });
  })

  //Clock in the user
  router.post('/clockIn', isAuthenticated, (req, res) =>{
    var uid = res.locals.userID
    var date = req.body.date
    usersRef = ref.child('Users/' + uid + '/Schedule/' + date)
    usersRef.set({                                      // set the date and the time in the database when user clock in
      Date      : date,
      clockIn   : req.body.time,
      clockOut  : 0                                 //cannot set null, must be a value
    }, error =>{
      if(error){
        console.log(error)
      }else{
        console.log("SUCCESSFULLY CLOCK IN!!")
      }
    })
    res.send({"res": "Successfully Clock In"})
  })

  //Clock out the user
  router.post('/clockOut', isAuthenticated, (req, res) =>{
    var uid = res.locals.userID
    var date = req.body.date
    usersRef = ref.child('Users/' + uid + '/Schedule/' + date)
    usersRef.update({                                       //When user clock out, update the value 0 for clockOut to current time
      clockOut: req.body.time,
    }, error =>{
      if(error){
        console.log(error)
      }else{
        console.log("SUCCESSFULLY CLOCK OUT!!")
      }
    })
    res.send({"res": "Successfully Clock Out"})
  }
  )

  module.exports = router;