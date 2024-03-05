import express from 'express'
import { signUp, login, logOut, follow, update, getProfile } from '../controllers/userController.js'
import protectRoute from '../middlewares/protectRoute.js'

const router = express.Router()

router.get("/profile/:username", getProfile)
router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logOut)
router.post("/follow/:id", protectRoute, follow)
router.put("/update/:id", protectRoute, update)

export default router