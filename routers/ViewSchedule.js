//File name: ViewSchedule.js
//Contains all endpoints for the view schedule functionalities
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

router.post('/getSchedule', isAuthenticated, (req,res) =>{
    var uid = res.locals.userID
    var timeStamp = []
    usersRef = ref.child('Users/' + uid + '/Schedule')
    usersRef.once('value', snapshot => {                //retrieve the user object from the database
      if(snapshot.val() === null){
        res.send({                                      //if there is no timestamp for this user, send a empty array back
          "noData"   : true,
          "timeStamp": timeStamp
        })
      }else{
        timeStamp = Object.values(snapshot.val())     //An object is retrieve from database, convert it to array 
        res.send({
          "noData"    : false,
          "timeStamp" : timeStamp
        })
      }
    })
  })

  module.exports = router;