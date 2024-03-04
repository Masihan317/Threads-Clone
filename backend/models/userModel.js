import mongoose from "mongoose";

const userCollection = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 6,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  followers: {
    type: [String],
    default: []
  },
  following: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userCollection)

export default User