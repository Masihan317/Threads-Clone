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
    type: Number,
    default: 0
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
      }
    }
  ]
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postCollection)

export default Post