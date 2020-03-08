const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

//@route    Post /updateInfo
//@desc     allow users to update their information
//@access   Private
router.post('/updateInfo', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  let name = req.body.name
  let userCompanyName = req.body.companyName

  try {
    await admin.auth().updateUser(uid, { displayName: name })   //updates user profile
    const usersRef = await ref.child('Users/' + uid)
    const snapshot = await usersRef.once('value')
    const databaseCompanyName = await snapshot.val().companyName
    if (databaseCompanyName === userCompanyName) {        //Not changing company? just update
      await usersRef.update({
        name: req.body.name,
        companyName: req.body.companyName,
        jobPosition: req.body.jobPosition
      })
    } else {                                                // Changing company? reset the user object with the new company name
      await usersRef.set({
        name: req.body.name,
        companyName: req.body.companyName,
        jobPosition: req.body.jobPosition
      })
    }
    res.status(200).json({ "success": "Update Success" })
  } catch (error) {
    res.status(500)
  }
})

module.exports = router;