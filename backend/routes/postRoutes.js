import express from 'express'
import { create, getPost, deletePost, like, reply, getFeedPosts } from '../controllers/postController.js'
import protectRoute from '../middlewares/protectRoute.js'

const router = express.Router()

router.get("/feed", protectRoute, getFeedPosts)
router.get("/:id", getPost)
router.post("/create", protectRoute, create)
router.delete("/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, like)
router.post("/reply/:id", protectRoute, reply)

export default router