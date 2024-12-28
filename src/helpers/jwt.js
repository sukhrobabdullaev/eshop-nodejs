const {expressjwt}  = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api_url = process.env.API_URL;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: async (req, token) => {
      // Check if the token payload indicates the user is not an admin
      if (!token.payload.isAdmin) {
          return true; // Revoke the token
      }
      return false; // Allow the token
  },
  }).unless({
    path: [
      { url: /\/api\/v1\/products\/(.*)/, methods: ["GET","OPTIONS"] },
      { url: /\/api\/v1\/categories\/(.*)/, methods: ["GET","OPTIONS"] },
      { url: `${api_url}/users/login`, methods: ["POST"] },
      { url: `${api_url}/users/register`, methods: ["POST"] },
    ],
  });
}

async function isRevoked(req, payload, done) {
  console.log(payload);
  if (!payload.isAdmin) {
    done(null, true);
  } 
  done(null, false);
}


module.exports = authJwt;
