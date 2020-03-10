const request = require('supertest');
const app = require('../app');
const generateCustomIdToken = require('./fixture/generateCustomIdToken');

let customIdToken = null;

beforeAll(async () => {
  customIdToken = await generateCustomIdToken();
})

test('Should not be able to create user with mock idToken', async (done) => {
  request(app).post('/createUser').send({
    "ID": customIdToken,
    "companyName": "C-W",
    "name": "John Doe",
    "jobPosition": "Manager"
  }).then((res)=> {
    expect(res.status).toBe(500)
    done()
  })
})

test('Should not be able to retrieve announcements', async (done) => {
  request(app)
  .post('/getAnnouncement')
  .set('x-auth-token', customIdToken)
  .then((res) => {
    expect(res.status).toBe(500)
    done()
  })
})

test('should get passed middleware', (done) => {
  request(app)
  .post('/getClockStatus')
  .set('x-auth-token', customIdToken)
  .send({ "date": new Date().toLocaleDateString().replace('/', '-').replace('/', '-') })
  .then((res)=> {
    expect(res.status).toBe(500)
    done()
  })
})