const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

//@route    /getSchedule
//@desc     fetch user's timestamp 
//@access   Private
router.post('/getSchedule', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  try{
    const usersRef = await ref.child('Users/' + uid + '/Schedule')
    const snapshot = await  usersRef.once('value')
    const timeStamp = await snapshot.val()
    const didClockIn = timeStamp === null 
    if(didClockIn){
      res.status(200).json({                                      //if there is no timestamp for this user, send a empty array back
        "noData": true,
        "timeStamp": {}
      })
    } else {
      //timeStamp = Object.values(timeStamp)     //An object is retrieve from database, convert it to array 
      res.status(200).json({
        "noData": false,
        "timeStamp": timeStamp
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

module.exports = router;