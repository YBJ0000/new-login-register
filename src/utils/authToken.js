import jwt, { decode } from 'jsonwebtoken';
import "dotenv/config";

function authToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("no auth header, probably first time login")
      return next()
    }

    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid token")
        return res.status(403).json({
          message: 'Invalid token',
          code: "2"
        });
      }
      req.body.username = decoded.username
      req.body.password = decoded.password
    })
  } catch (error) {
    console.error("failed to verify token", error)
    return res.status(500).json({
      message: 'Token verification failed',
      code: "3"
    })
  }
}

export { authToken }