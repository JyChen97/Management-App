//File name: AnnouncementBoard.js
//Contains all the endpoints for Annoucement board functionalities
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

router.post('/getAnnouncement', isAuthenticated, (req,res) =>{
    var uid = res.locals.userID
    var Announcements = []
    usersRef = ref.child('Users/' + uid)
    usersRef.once('value', snapshot => {                              //retrieve the company name that the user belong to
      var companyName = snapshot.val().companyName
      announcementRef = ref.child('Announcements/' + companyName)
      announcementRef.once('value', snapshot => {                     //retrieve user object from firebase
        if(snapshot.val() === null){                                  
          res.send({                                       //if there's no announcement
            "noData"       : true,
            "Announcements": Announcements
          })
        }else{
          Announcements = Object.values(snapshot.val())
          res.send({                                      //if there's announcements
            "noData"       : false,
            "Announcements": Announcements
          })
        }
      })
    })
  })


  //Identical to getAnnouncement above
  router.post('/createAnnouncement', isAuthenticated, (req,res) =>{
    var uid = res.locals.userID
    var dateAndTime = req.body.date + " " + req.body.time
    usersRef = ref.child('Users/' + uid)
    usersRef.once('value', snapshot => {
      var companyName = snapshot.val().companyName
      announcementRef = ref.child('Announcements/' + companyName + '/' + dateAndTime)       //Announcements are stored under the date that they are posted
      announcementRef.set({
        postTitle   : req.body.titlePost,
        postContent : req.body.newPost
      }, error =>{
        if(error){
          console.log(error)
        }else{
          res.send({
            "newPost" : "Created new post"                             
          })
        }
      })
    })
  })

  module.exports = router;