import mongoose from "mongoose";

const postCollection = mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    maxLength: 500
  },
  img: {
    type: String,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  replies: [
    {
      uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true
      },
      profilePicture: {
        type: String
      },
      username: {
        type: String
      }
    }
  ]
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postCollection)

export default Post