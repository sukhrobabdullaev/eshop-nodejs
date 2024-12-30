const { expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api=process.env.API_URL

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: async (req, token) => {
          // Check if the user is trying to access the orders endpoint
          const isOrdersEndpoint = req.originalUrl.startsWith(`${api}/orders`);

          if (!token.payload.isAdmin && !isOrdersEndpoint) {
            return true; // Revoke the token for non-admin users accessing non-orders endpoints
          }
      return false; // Allow the token
    },
  }).unless({
    path: [
      // Make all GET requestts to /public/uploads/(.*) public
      { url: /\/public\/uploads\/(.*)/, methods: ["GET", "OPTIONS"] },
      // Make all GET requests to products/(.*) public
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      // Make all GET requests to categories/(.*) public
      { url: /\/api\/v1\/categories\/(.*)/, methods: ["GET", "OPTIONS"] },
      // Allow login and register endpoints
      { url: `${api}/users/login` },
      { url: `${api}/users/register`},
    ],
  });
}

// async function isRevoked(req, payload, done) {
//   if (!payload.isAdmin) {
//     done(null, true);
//   } else {
//     done(null, false);
//   }
// }

module.exports = authJwt;
