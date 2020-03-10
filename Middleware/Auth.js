const firebaseAdmin = require('../Config/firebaseAdmin')

module.exports = async (req, res, next) => {
  const idToken = req.header('x-auth-token');
  if(!idToken){
    res.status(401).send('Unauthorized');
  }
  try{
    let user = await firebaseAdmin.auth().verifyIdToken(idToken)
    res.locals.userID = user.uid
    next();
  } catch (error) {
    res.sendStatus(500)
  }
}

    