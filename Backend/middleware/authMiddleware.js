const jwt = require("jsonwebtoken");
const jwksClient = require('jwks-rsa');
const User = require("../models/User");

// Middleware to protect routes (Auth0)
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log('Received Authorization token:', token);

    // If Auth0 config is present, use RS256/JWKS verification
    const auth0Domain = process.env.AUTH0_DOMAIN;
    if (auth0Domain) {
      try {
        const client = jwksClient({
          jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
        });
        function getKey(header, callback) {
          client.getSigningKey(header.kid, function (err, key) {
            if (!key) {
              return callback(new Error('No signing key found'));
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
          });
        }
        jwt.verify(
          token,
          getKey,
          {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${auth0Domain}/`,
            algorithms: ['RS256']
          },
          async (err, decoded) => {
            if (err) {
              console.error("Auth0 token verification failed:", err);
              return res.status(401).json({ message: "Not authorized, token failed" });
            }
            // Debug: log decoded JWT fields
            console.log('Decoded Auth0 JWT:', decoded);

            // Fetch user profile securely from Auth0 /userinfo endpoint
            const axios = require('axios');
            try {
              const userinfoUrl = `https://${auth0Domain}/userinfo`;
              const userinfoRes = await axios.get(userinfoUrl, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const userProfile = userinfoRes.data;
              // Find or create user in MongoDB using Auth0 sub
              let user = await User.findOne({ auth0Id: decoded.sub });
              if (!user) {
                const userName = userProfile.name || userProfile.nickname || userProfile.email || decoded.sub;
                const userEmail = userProfile.email;
                if (!userEmail) {
                  console.error('Auth0 userinfo missing email field');
                  return res.status(400).json({ message: 'Auth0 user profile missing email' });
                }
                user = await User.create({
                  auth0Id: decoded.sub,
                  name: userName,
                  email: userEmail,
                  role: 'customer'
                });
                console.log('Created new user:', user);
              }
              req.user = user;
              next();
            } catch (profileErr) {
              console.error('Error fetching user profile from Auth0:', profileErr);
              return res.status(500).json({ message: 'Failed to fetch user profile from Auth0' });
            }
          }
        );
      } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    } else {
      // Fallback: HS256 local JWT verification
      try {
        const secret = process.env.JWT_SECRET || "your_default_secret";
        const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
        // Find user by decoded id
        let user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
      } catch (err) {
        console.error("HS256 token verification failed:", err);
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// //middleware to check if the user is an admin
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as admin" });
//   }
// };

module.exports = { protect };
