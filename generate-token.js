const { config } = require('dotenv');
const jwt = require('jsonwebtoken');

//read the .env file from envs folder
config({
  path: __dirname + '/envs/.env',
});

//create a token
const token = jwt.sign(
  {
    realm_access: {
      roles: ['admin-catalog'],
    },
  },
  process.env.JWT_PRIVATE_KEY,
  { expiresIn: '24h', algorithm: 'RS256' },
);

console.log(token);
