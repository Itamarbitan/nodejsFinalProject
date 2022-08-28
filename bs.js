const crypto = require('crypto')

function createResetToken() {
    return crypto.randomBytes(20).toString("hex");
}

module.exports = createResetToken;