//File name: Auth.js
//Express middleware that checks for user creditials for every request made
//Accepts an id Token use it to retrieve userID from Firebase
const firebaseAdmin = require('../Config/firebaseAdmin')

module.exports = (req, res, next) => {
  var idToken = req.body.id;
  firebaseAdmin.auth().verifyIdToken(idToken)
  .then(user =>{
    res.locals.userID = user.uid
    next();
  })
  .catch(error => {
    throw error
  })
}

    