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
  }, [ ])
  
  useEffect( ()=> {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if ( loggedUserJson){
      const user = JSON.parse(loggedUserJson)
      setUser(user) 
      setAuthor( user.username)
      blogService.setToken( user.token)
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
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // Object not found checck status code 
          if ( err.response.status && err.response.status === 404){
            showMessage('error', 'Can not get blogs from server', 5000 )
          } 
          else {
            console.log('Error', err)
            showMessage('error', 'Something went wrong', 5000 )
          }
        } else if (err.request) {
          showMessage('error', 'Connection to server lost', 5000 )
        } else {
          // Something happened in setting up the request that triggered an Error
          showMessage('error', 'Wrong request setting', 5000)
        }
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
      // handle Login error 
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // Object not found chech status code 
      if ( err.response.status){
          if (err.response.status === 400){
            showMessage( 'error', `${ err.response.data.error}`, 5000 )
          } else if ( err.response.status === 401) {
            showMessage( 'error', `${ err.response.data.error}`, 5000 )
          } 
          else {
            showMessage('error', `Something went wrong ${ err.response.status}`, 5000 )
          }
        }
      } else if (err.request) {
        showMessage('error', 'Connection to server lost', 5000)
      } else {
        // Something happened in setting up the request that triggered an Error
        showMessage('error', 'Wrong request setting', 5000 )
      }
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
      
    } catch ( err ){
      // handle add blog error 
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // Object not found chech status code 
      if ( err.response.status){
          if (err.response.status === 400){
            showMessage( 'error', `${ err.response.data.error}`, 5000 )
          } else if ( err.response.status === 401) {
            showMessage( 'error', `${ err.response.data.error}`, 5000 )
          } 
          else {
            console.log('Error', err)
            showMessage('error', `Something went wrong ${ err.response.status}`, 5000 )
          }
        }
      } else if (err.request) {
        showMessage('error', 'Connection to server lost', 5000)
      } else {
        // Something happened in setting up the request that triggered an Error
        showMessage('error', 'Wrong request setting', 5000 )
      }
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
