const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

const privateKeyInline = privateKey.replace(/\n/g, '\\n');
console.log(privateKeyInline);

const publicKeyInline = publicKey.replace(/\n/g, '\\n');
console.log(publicKeyInline);
