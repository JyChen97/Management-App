const admin = require('../Config/firebaseAdmin')
const database = admin.database()
const ref = database.ref()
const express = require('express')
const router = new express.Router()
const isAuthenticated = require('../Middleware/Auth')

//@route    Post /getClockStatus
//@desc     check if the user has already clock in or not, switch the sign between clock in and clock out
//@access   Private
router.post('/getClockStatus', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  let date = req.body.date
  try {
    const usersRef = await ref.child('Users/' + uid + '/Schedule/')
    const snapshot = await usersRef.once("value")
    const status = await snapshot.hasChild(date)
    res.json({ "clockIn": (status ? true : false) })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

//@route    Post /clockIn
//@desc     clock in user's timestamp
//@access   Private
router.post('/clockIn', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  let date = req.body.date
  try {
    const usersRef = await ref.child('Users/' + uid + '/Schedule/' + date)
    await usersRef.set({
      Date: date,                                     
      clockIn: req.body.time,
      clockOut: 0
    })
    res.status(200).json({ "res": "Successfully Clock In" })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

//@route    Post /clockOut
//@desc     clock out user's timestamp
//@access   Private
router.post('/clockOut', isAuthenticated, async (req, res) => {
  let uid = res.locals.userID
  let date = req.body.date
  try {
    const usersRef = await ref.child('Users/' + uid + '/Schedule/' + date)
    await usersRef.update({
      clockOut: req.body.time,
    })
    res.status(200).json({ "res": "Successfully Clock Out" })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

module.exports = router;