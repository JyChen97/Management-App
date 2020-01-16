//File name: Auth.js
//Contains all the endpoints for user registration and sign in 
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

router.post('/login', isAuthenticated, (req, res) => {
    var uid = res.locals.userID
    usersRef = ref.child('Users/' + uid)
    usersRef.once("value", snapshot => {
        var userPosition = snapshot.val().jobPosition         //retrieve the job position the user sign up with
        res.send(userPosition)                                //sends the position back to view, so employee/employer page can be render
    });
})

  //First required to update user profile
  //Then update the database containing user info
router.post('/createusers', isAuthenticated, (req, res) => {
    var uid = res.locals.userID
    usersRef = ref.child('Users/' + uid)
    admin.auth().updateUser(uid, {                            //updates user profile
      displayName: req.body.name
    }).then(userRecord => {
      console.log("UPDATE TO PROFILE SUCCESS!!")
    })
    .catch( error => {
      console.log(error)
    })
    usersRef.set({                                      //updates the database
      name       : req.body.name,
      companyName: req.body.companyName,
      jobPosition: req.body.jobPosition
    }, error => {
        if(error){
          console.log(error)
        }else{
          console.log("UPDATE TO DATABASE SUCCESS!!")
        }
      }
    );
    res.send({"res": "Update Success"})
})

module.exports = router;