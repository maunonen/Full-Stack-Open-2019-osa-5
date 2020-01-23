/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
let token
beforeEach( async () => {
  await Blog.deleteMany({})
  const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogsObject.map( blog => blog.save())
  
  await Promise.all( promiseArray)
})

describe('Test USER Routes', ()=> {

  test('Create new user with name which already exist in DB', async () => {
    const newUser = {
      'username' : 'alex11777', 
      'password' : 'alex11777', 
      'name' : 'alex11777' 
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('Create new user with invalid password and name. STATUS 400', async () => {
    const newUser = {
      'username' : 'Ja', 
      'password' : 'ja', 
      'name' : 'Jari' 
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('Create new user successfully with correct data', async () => {
    const newUser = {
      'username' : 'alex1111', 
      'password' : 'alex1111', 
      'name' : 'alex1111' 
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
  })
})

describe('Test API for blog list app', () => {
  beforeAll( async () => {
    token = await helper.setupDBLoginUser()
  }) 
  afterAll( async ()=> {
    await User.deleteMany({})
  })

  test('Add new blog with valid blog object', async () => {
    const brokenToken = 'vsdvsdvs'
    const newBlog = {
      url  : "some title", 
      title  : "some title"
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + brokenToken)
      .send( newBlog)
      .expect(401)
  })

  test('blogs returned in JSON format', async ()=> {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned 3 blog items', async ()=> {
    const res = await api.get('/api/blogs')
    expect(res.body.length).toBe(helper.initialBlogs.length)
  })

  test('unique identifier name is id', async ()=> {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()

  })

  test('User try to create blogs with valid data but invalid token GET 401', async ()=> {

    const newBlog = {
      url  : "some title", 
      title  : "some title"
    }
    const invalidToken = 'yyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkphcmkxMTEiLCJpZCI6IjVlMjgxYjgxM2QwODhlM2Y2ZGUxZjYzNiIsImlhdCI6MTU3OTY4Njc5N30.FDej0uboK7LA4tYheVz1qDdG8iJB17MCwYeCFkfi2I0'
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + invalidToken)
      .send(newBlog)
      .expect(401)
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ')
      .send(newBlog)
      .expect(401)
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + '893797')
      .send(newBlog)
      .expect(401)      
  })

  test('HTTP POST request creates a new blog post', async ()=> {
    const newBlog = {
      url  : "some title", 
      title  : "some title"
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    /* const blogList = await api.get('/api/blogs')
    expect( blogList.body.length).toBe( helper.initialBlogs.length + 1)
    const blogTitles = blogList.body.map( blog => blog.title)
    expect(blogTitles).toContain('some title 2') */
  })

  test('Likes property equal to 0 if it not exist in request' , async () => {
    
    const newBlog = {
      title : 'some title 2',
      author : 'some author 3',
      url : 'some url'  
    }

    const savedBlogs = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect( savedBlogs.body.likes).toBe( 0 )
  })
  
  test('If title or url properrtie are missing send status code 400', async () => {
    
    const userToken = await api
      .post('/api/login')
      .send({ 
        username : 'alex11', 
        password : 'alex11'
      })
      .set('Authorization', 'bearer ' + token)
    
    const blogTitleMiss = {
      url : 'some url'  
    }
    const blogUrlMiss = {
      title : 'some url'  
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blogTitleMiss)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blogUrlMiss)
      .expect(400)
  })

  test('User try to delete blog with invalid token get status 401', async () => {
    const blogToDeleteID = helper.initialBlogs[0].id    
    await api
      .delete(`/api/blogs/${ blogToDeleteID }`)
      .set('Authorization', 'bearer ' + token + '6768')
      .expect(401)
  })
  test('User try to delete blog with invalid blog ID, with valid token get status 404 or 400', async () => {
    const blogToDeleteID = helper.initialBlogs[0].id    
    
    await api
      .delete(`/api/blogs/${ blogToDeleteID  } 7978`)
      .set('Authorization', 'bearer ' + token )
      .expect(400)
    
  })
  
  test('User try to delete blog with valid token with out permission', async () => {
    const blogToDeleteID = helper.blogObjectID2   
    const allBlogs = await Blog.find({})
    console.log('ALL BLOG', allBlogs )
    await api
      .delete(`/api/blogs/${ blogToDeleteID }`)
      .set('Authorization', 'bearer ' + token )
      .expect(403)
  })


  test('Blog will be delete successfully ', async () => {
    const blogToDeleteID = helper.blogObjectID1
    await api
      .delete(`/api/blogs/${ blogToDeleteID }`)
      .set('Authorization', 'bearer ' + token)
      .expect(200)
  })

  test('Blog will be update successfully ', async () => {
    const blogToUpdateId = helper.blogObjectID1
    const blogToUpdateContent = {
      likes : 2, 
      url : 'some url 2222'
    }
    await api
      .put(`/api/blogs/${ blogToUpdateId }`)
      .send( blogToUpdateContent )
      .expect(200)
  })
})

afterAll(() => {
  mongoose.connection.close()
})