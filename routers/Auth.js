//Firebase only allow creating user account on client side. In order to add user into database, their login token is required.
const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')
const firebaseAdmin = require('../Config/firebaseAdmin')

//@route    Get /getJobPosition
//@desc     return user job position
//@access   Private
router.get('/getJobPosition', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  try{
    const usersRef = await ref.child('Users/' + uid)
    const snapshot = await usersRef.once("value")
    const userPosition = await snapshot.val().jobPosition
    res.json({userPosition})                                
  } catch (error) {
    res.status(500)
  }
})

//@route    Post /createusers
//@desc     create user in database
//@access   Private
router.post('/createusers', async (req, res) => {
  let { ID, name, companyName, jobPosition } = req.body
  try {
    let user
    if(ID){
      user = await (await firebaseAdmin.auth().verifyIdToken(ID)).uid;
    } else {
      res.status(401).send('Unauthorized')
    }
    const usersRef = await ref.child('Users/' + user)
    await admin.auth().updateUser(user, {                            
      displayName: name
    })
    await usersRef.set({                                    
      name       : name,
      companyName: companyName,
      jobPosition: jobPosition
    })
    res.status(200).json({ "res": "Update Success" })
  }catch (error) {
    res.status(500)
  }
})

module.exports = router;