import User from '../models/userModel.js'
import bcrypt from "bcryptjs";
import setCookie from '../utils/helpers/setCookie.js';

const signUp = async (req, res) => {
  try {
    const { name, email, username, password } = req.body

    const user = await User.findOne({ $or: [{email}, {username}] })
    if (user) {
      return res.status(400).json({ message: "User already exists." })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword
    })
    await newUser.save()

    if (newUser) {
      setCookie(newUser._id, res)

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username
      })
    } else {
      res.status(400).json({ message: "Invalid user data." })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const isCorrectPassword = await bcrypt.compare(password, user?.password || "")

    if (!user || !isCorrectPassword) {
      return res.status(400).json({ message: "Invalid username or password." })
    }

    setCookie(user._id, res)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 })

    res.status(200).json({ message: "User logged out successfully." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const follow = async (req, res) => {
  try {
    const { id } = req.params
    const otherUser = await User.findById(id)
    const user = await User.findById(req.user._id)

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow/unfollow yourself." })
    }

    if (!otherUser || !user) {
      return res.status(400).json({ message: "User not found." })
    }

    const isFollowing = user.following.includes(id)

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
      res.status(200).json({
        message: "User unfollowed successfully."
      })
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
      res.status(200).json({
        message: "User followed successfully."
      })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { name, email, username, password, profilePicture, bio } = req.body
    const uid  = req.user._id

    let user = await User.findById(uid)
    if (!user) {
      return res.status(400).json({ message: "User not found." })
    }

    if (req.params.id !== uid.toString()) {
      return res.status(400).json({ message: "You cannot update the profile of other users." })
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user.password = hashedPassword
    }

    user.name = name || user.name
    user.email = email || user.email
    user.username = username || user.username
    user.profilePicture = profilePicture || user.profilePicture
    user.bio = bio || user.bio

    user = await user.save()
    res.status(200).json({
      message: "Profile updated successfully.",
      user
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getProfile = async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({username}).select("-password").select("-updatedAt")
    if (!user) {
      return res.status(400).json({ message: "User not found." })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export { signUp, login, logOut, follow, update, getProfile }