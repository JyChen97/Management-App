//File name: updateInfo.js
//Contains all endpoints for the update info functionalities
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

router.post('/updateInfo', isAuthenticated, (req, res) => {
    var uid = res.locals.userID
    usersRef = ref.child('Users/' + uid)
    var userCompanyName = req.body.companyName
      admin.auth().updateUser(uid, {                    //this updates the user profile  
        displayName: req.body.name,
      })
      .then(userRecord => {
        console.log("UPDATE TO PROFILE SUCCESS!!")
      })
      .catch( error => {
        console.log('Error fetching user data:', error);
        throw error
      })
      usersRef.once('value', snapshot => {                   //get user object to update the database
        var databaseCompanyName = snapshot.val().companyName
        if( databaseCompanyName === userCompanyName){        //Not changing company? just update
          usersRef.update({                                 
            name       : req.body.name,
            companyName: req.body.companyName,
            jobPosition: req.body.jobPosition
            },error => {
                if(error){
                  console.log(error)
                  throw error
                }else{
                  console.log("UPDATE TO DATABASE SUCCESSFULLY!!")
                  res.send({
                    "success"    : "Update Success",
                  })
                }
              }
          )    
        }else{                                                // Changing company? reset the user object with the new company name
          usersRef.set({
            name       : req.body.name,
            companyName: req.body.companyName,
            jobPosition: req.body.jobPosition
            },error => {
                if(error){
                  console.log(error)
                  throw error
                }else{
                  console.log("UPDATE TO DATABASE SUCCESSFULLY!!")
                  res.send({
                    "success"    : "Update Success",
                  })
                }
              }
          )
        }
      })
  })

  module.exports = router;