const jwt = require('jsonwebtoken');
const _ = require('lodash');
const certificateObject = require('./creditials');

function generateIdToken(overrides) {

  const options = _.assign({
    audience: certificateObject.project_id,
    expiresIn: 60*60,
    issuer: 'https://securetoken.google.com/' + certificateObject.project_id,
    subject: certificateObject.client_id,
    algorithm: 'RS256',
    header: {
      kid: certificateObject.private_key_id,
    },
  }, overrides);

  return jwt.sign({ foo: 'bar' }, certificateObject.private_key, options);
}

module.exports = generateIdToken;