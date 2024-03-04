import Post from "../models/postModel.js"
import User from "../models/userModel.js"

const create = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body
    if (!postedBy || !text) {
      res.status(400).json({ message: "Please fill in all of the fields." })
    }

    const user = await User.findById(postedBy)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized." })
    }

    const maxLength = 500
    if (text.length > maxLength) {
      return res.status(400).json({
        message: `Text must be less than ${maxLength} characters.`
      })
    }

    const newPost = await Post.create({
      postedBy,
      text,
      img
    })

    await newPost.save()
    res.status(201).json({
      message: "Post created successfully.",
      newPost
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPost = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found." })
    }

    res.status(200).json({ post })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found." })
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized." })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Post deleted successfully." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const like = async (req, res) => {
  try {
    const { id: pid } = req.params
    const uid = req.user._id

    const post = await Post.findById(pid)

    if (!post) {
      return res.status(404).json({ message: "Post not found." })
    }

    const isLiked = post.likes.includes(uid)
    if (isLiked) {
      await Post.updateOne({ _id: pid }, { $pull: { likes: uid } })
      res.status(200).json({
        message: "Post unliked successfully."
      })
    } else {
      post.likes.push(uid)
      await post.save()
      res.status(200).json({
        message: "Post liked successfully."
      })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const reply = async (req, res) => {
  try {
    const { text } = req.body
    const { id: pid } = req.params
    const uid = req.user._id
    const profilePicture = req.user.profilePicture
    const username = req.user.username

    if (!text) {
      res.status(400).json({ message: "Post body is required." })
    }

    const post = await Post.findById(pid)

    if (!post) {
      return res.status(404).json({ message: "Post not found." })
    }

    const reply = {
      uid,
      text,
      profilePicture,
      username
    }
    post.replies.push(reply)
    await post.save()

    res.status(200).json({ message: "Reply added successfully.", reply })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getFeedPosts = async (req, res) => {
  try {
    const uid = req.user._id
    const user = await User.findById(uid)

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const following = user.following
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })

    res.status(200).json({ feedPosts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export { create, getPost, deletePost, like, reply, getFeedPosts }