const admin = require('firebase-admin')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://cisc4900-b8e82.firebaseio.com'
})

module.exports = firebaseAdmin;