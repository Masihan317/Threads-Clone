import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      res.status(401).json({ message: "Unauthorized." })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.uid).select("-password")
    req.user = user

    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default protectRoute