const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

//@route    /getAnnouncement
//@desc     fetch announcements for user
//@access   Private
router.post('/getAnnouncement', isAuthenticated, async (req,res) =>{
  let uid = res.locals.userID
  let Announcements
  try{
    const usersRef = await ref.child('Users/' + uid)
    const snapshot = await usersRef.once('value')                     
    const companyName = await snapshot.val().companyName
    const announcementRef = await ref.child('Announcements/' + companyName)
    const announcement = await  announcementRef.once('value')                  
    if(announcement.val() === null){
      res.json({                                      
      "noData"       : true,
      "Announcements": Announcements
      })
    } else {
      Announcements = Object.values(announcement.val())
      res.json({ "Announcements": Announcements })
    }
  } catch(error) {
    res.status(500)
  }
})


//@route    /createAnnouncement
//@desc     allow manager to create announcement 
//@access   Private
router.post('/createAnnouncement', isAuthenticated, async (req, res) =>{
  let uid = res.locals.userID
  let dateAndTime = req.body.date + " " + req.body.time
  try{
    const usersRef = await ref.child('Users/' + uid)
    const snapshot = await usersRef.once('value')
    const companyName = await snapshot.val().companyName
    const announcementRef = await ref.child('Announcements/' + companyName + '/' + dateAndTime)    
    await announcementRef.set({
        postTitle   : req.body.titlePost,
        postContent : req.body.newPost
    })
    res.status(200).json({ "newPost" : "Created new post" })
  } catch (error) {
    res.status(500)
  }
})

  module.exports = router;