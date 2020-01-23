const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

userRouter.get('/', async ( req, res, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title : 1, author : 1, likes : 1 })
    res.json( users.map( user => user.toJSON()))
  } catch (err) {
    next(err)
  }
})

userRouter.post('/', async ( req, res, next) => {
  try {
    const body  = req.body
    const userObject = {}
    if (body.password === undefined && body.username === undefined){
      return res.status(400).send({ error : 'Missed password or username'})
    } 
    if ( body.password.length < 4 ){
      return res.status(400).send({ error : 'Password should be at least 3 symbol'})
    }
    if (body.name){
      userObject['name'] = body.name
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    userObject['password'] = body.password
    userObject['username'] = body.username
    const user = new User({ ...userObject, passwordHash})
    const savedUser = await user.save()
    return res.json( savedUser.toJSON())
  } catch ( err){
    next(err)
  }
})

module.exports = userRouter