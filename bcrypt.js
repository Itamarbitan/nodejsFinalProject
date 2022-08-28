var bcrypt = require('bcryptjs');
const e = require('express');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("itamar", salt);


function hashApassword(password){
    let hashedPassword = bcrypt.hashSync(password , salt);
    console.log(hashedPassword);
    return hashedPassword
}

module.exports = {
        hashApassword : hashApassword,
}