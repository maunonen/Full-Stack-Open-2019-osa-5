import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = (props) => {

  const [ username, setUsername ]= useState('')
  const [ password, setPassword ]= useState('')
  const [ user, setUser] = useState( null )
  const [ notificationMessage, setNotificationMessage ] = useState( null )
  const [ blogs, setBlogs] = useState( null) 
  const [ author, setAuthor] = useState()
  const [ url, setUrl] = useState('')
  const [ title, setTitle] = useState('')
  
  useEffect( () => {
    getBlogs()
  }, [  ])
  
  useEffect( ()=> {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if ( loggedUserJson){
      const user = JSON.parse(loggedUserJson)
      setUser(user) 
      setAuthor( user.username)
      blogService.setToken( user.token)
      //getBlogs()
    }
  }, [])

  const showMessage = ( messageType, message, showTime) => {
    if ( !(typeof messageType === 'string' || messageType instanceof String)){ 
      return -1
    } else if (!( typeof showTime === 'number' && showTime > 0 )){
      return -1
    } else if ( !(['error', 'successful' ].includes( messageType))){
      return -1
    }
    setNotificationMessage({ 
          type : messageType, 
          message : message
        })
    setTimeout( () => {
      setNotificationMessage( null )
    }, showTime)
  } 

  const getBlogs = async  () => {
      try {
        const blogs = await blogService.getAll()
        if (blogs) {
          setBlogs( blogs)
        }
      } catch ( err ) {
        setNotificationMessage({ 
          type : 'error', 
          message : '404 not found`'
        })
        setTimeout( () => {
          setNotificationMessage( null )
        }, 5000)
      }
    }

  const handleLogin = async ( event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken( user.token)
      setUser( user )
      setUsername('') 
      setPassword('')
      showMessage('successful', 'You have been successfuly loged in', 5000 )  
    } catch ( err ){
      showMessage('error', 'Wrong credentials', 5000 )      
    }
  }

  const handleLogOut = ( event) => {
    event.preventDefault()
    window.localStorage.clear()
    blogService.setToken( null )
    setUser( null )
    setUsername('') 
    setPassword('')
    showMessage('successful', 'You have been successfuly loged out', 5000 )
  }

  const handleAddBlog = async ( event ) => {
    event.preventDefault()
    try {
      const blog = await blogService.createBlog( { 
        title, url, author
      })
      setUrl('')
      setTitle('')
      getBlogs()
      showMessage('successful', 'New blog added', 5000 )
      
    } catch ( error ){
      console.log('Error', error)
      showMessage('error', 'Can not create blog', 5000 )
    }
  }

  

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      { blogs === null
          ? <p>404 nothing found</p>
          : blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
  

  const loginForm = () => (
    <form onSubmit = { handleLogin }>
      <h1>log in application</h1>
      <div>
        username 
        <input 
          type="text"
          value={ username }
          name="Username"
          onChange={({ target}) => setUsername( target.value )}
        />
      </div>
      <div>
        password
        <input 
          type="text"
          value={ password }
          name="Password"
          onChange={({ target}) => setPassword( target.value )}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      
      <Notification notification = { notificationMessage}/>
      { 
        user === null 
          ? loginForm() 
          : <div>
              <h1>BLOGS</h1>
              <p>{ user.name } is logged in</p>
              
              <button onClick ={ handleLogOut }>Log out</button>
              <BlogForm 
                handleAddBlog = { handleAddBlog } 
                title = { title }
                author = { author } 
                url= { url } 
                setAuthor = { setAuthor } 
                setTitle = { setTitle } 
                setUrl = { setUrl }
              /> 
              { blogList()}
            </div>
      }
    </div>
  );
}

export default App;
