const { log } = require("console");
const crypto = require("crypto");

// log(crypto)

//  mykey = crypto.Cipher('aes-128-cbc', 'mypassword');
// var mystr = mykey.update('abc', 'utf8', 'hex')
// mystr += mykey.final('hex');

// console.log(mystr); //34feb914c099df25794bf9ccb85bea72

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// var mykey = crypto.Cipher('aes-128-cbc', 'mypassword');
// var mystr = mykey.update('34feb914c099df25794bf9ccb85bea72', 'hex', 'utf8')
// mystr += mykey.final('utf8');

// console.log(mystr); //abc

// crypto.randomBytes(12, (err, buffer) => {
//   // generate a Token
//   if (err) {
//     console.log(err);
//   }
//   const token = buffer.toString("hex");
//   log(token)
// });

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// let test = crypto.randomBytes(8, (err, buf) => {
//   if (err) throw err;
//   // log(`${buf.length} bytes of random data: ${buf.toString("hex")}`);
//   log("buf = ", buf);
//   log(buf.toString("hex"));
//   return buf.toString("hex");
// });

// log("test = ", test);


//================================

// log("Date.now() = ", Date.now())
log(Date.now().getTime())