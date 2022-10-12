// Imports


require('dotenv').config()

const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = "k7Ba6rJUxVDzdQRYXnXkTsWYSPBmG8Yj";

// Exports

module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET, {
         
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if (token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch(err) {}
        }
        return userId;
    }
}
