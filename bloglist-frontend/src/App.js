import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import FilterBlog from './components/FilterBlog'

const App = (props) => {

  const [ username, setUsername ]= useState('')
  const [ password, setPassword ]= useState('')
  const [ user, setUser] = useState( null )
  const [ notificationMessage, setNotificationMessage ] = useState( null )
  const [ blogs, setBlogs] = useState( null) 
  const [ author, setAuthor] = useState()
  const [ url, setUrl] = useState('')
  const [ title, setTitle] = useState('')
  const [ sortByLike, setSortByLike ] = useState(false)
  const blogFormRef = React.createRef()
  
  useEffect( () => {
    getBlogs()
  }, [ ])
  
  useEffect( ()=> {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if ( loggedUserJson){
      const user = JSON.parse(loggedUserJson)
      setUser(user) 
      console.log('User', user)
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

  const getSortedBlogs = () => {
    return blogs.sort((a , b ) => { 
      if (sortByLike){
        return a.likes < b.likes ? 1 : -1
      } else {
        return a.likes > b.likes ? 1 : -1
      }
    } )
  }

  const handleRemoveBlog = async (id) => {

    try {
      const removedBlogStatus = await blogService.removeBlog(id)
      if ( removedBlogStatus  === 200){
        showMessage('successful', 'You have been successfuly deleted blog', 5000 )       
      }
      getBlogs()
    } catch ( err) {
      console.log(err)
      if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // Object not found checck status code 
        if ( err.response.status && err.response.status === 404){
          showMessage( 'error', 'Blog not found', 5000 )
        } else if ( err.response.status && err.response.status === 400){
          showMessage( 'error', 'Please provide blog ID', 5000 )
        }  else if (err.response.status && err.response.status === 403){
          showMessage( 'error', `You don't have permission to delete this blogs`, 5000 )
        } else if (err.response.status && err.response.status === 401){
          showMessage( 'error', `${ err.response.data.error}`, 5000 )
        } 
      } 
      else if (err.request) {
        showMessage('error', 'Connection to server lost', 5000 )
      } else {
        // Something happened in setting up the request that triggered an Error
        showMessage('error', 'Wrong request setting', 5000)
      }
    }
  }

  const getBlogs = async  () => {
      try {
        const blogs = await blogService.getAll()
        if (blogs) {
          setBlogs( blogs )
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
    const handleAddLike = async ( blog) => {
    try {
      const blogAddLike = {
        ...blog, likes : blog.likes + 1 || 1
      }
      await blogService.addLike( blogAddLike, blog.id) 
      getBlogs()
    }catch ( err ){
      if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // Object not found checck status code 
          if ( err.response.status && err.response.status === 404){
            showMessage('error', 'Can not updaet blog', 5000 )
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
    blogFormRef.current.toggleVisibility()
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

  return (
    <div>
      <Notification notification = { notificationMessage}/>
      { 
        user === null 
          ? <LoginForm
              password={password}
              username={username}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={ handleLogin}
            />
          : <div>
            
              <h1>BLOGS</h1>
              <p>{ user.name } is logged in</p>
              <button onClick = { handleLogOut }>Log out</button>
              <FilterBlog 
                sortByLike = { sortByLike }
                setSortByLike={ setSortByLike }
                getSortedBlogs={ getSortedBlogs }
              />
              
              <Togglable buttonLabel={'new note'} ref={blogFormRef}>
                <BlogForm 
                  handleAddBlog = { handleAddBlog } 
                  title = { title }
                  author = { author } 
                  url= { url } 
                  setTitle = { setTitle } 
                  setUrl = { setUrl }
                /> 
              </Togglable>
              <BlogList
                  blogs={ blogs}
                  handleAddLike={ handleAddLike }
                  handleRemoveBlog={ handleRemoveBlog}
                  user={user}
              />
          </div>
      }
    </div>
  );
}

export default App;
