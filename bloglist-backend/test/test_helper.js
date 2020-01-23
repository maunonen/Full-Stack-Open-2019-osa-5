/* eslint-disable quotes */
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const loginUserId = new mongoose.Types.ObjectId()
const blogObjectID1 = new mongoose.Types.ObjectId()
const blogObjectID2 = new mongoose.Types.ObjectId()
const blogObjectID3 = new mongoose.Types.ObjectId()

const setupDBLoginUser = async () => {
  try {
    const saltRounds = 10 
    const loginUserObject = {
      _id : loginUserId,
      username : 'alex11', 
      passwordHash : await bcrypt.hash('alex11', saltRounds), 
      name : 'alex11',
      token : jwt.sign({ id : loginUserId, username : this.username }, process.env.SECRET)
    }
    const newuser = new User(loginUserObject)
    await newuser.save()
    return loginUserObject.token
  } catch (err) {
    console.log( err)
  }
} 

const initialBlogs = [
  {
    "_id": blogObjectID1,
    "title": "some title",
    "author": "alex11",
    "url": "https://yle.fi/",
    "likes": 67
  },
  {
    "_id": blogObjectID2,
    "title": "some title 1",
    "author": "some author 1",
    "url": "https://yle.fi/",
    "likes": 1
  }, 
  {
    "_id": blogObjectID3, 
    "title": "some title 2",
    "author": "alex11",
    "url": "https://yle.fi/",
    "likes": 3
  }
]

const blogsDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map( blog => blog.toJSON())
}
  
module.exports = {
  initialBlogs, blogsDB, 
  setupDBLoginUser, 
  blogObjectID1, blogObjectID2, blogObjectID3
}
  
