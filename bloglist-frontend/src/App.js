import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'

const App = (props) => {

  const [ username, setUsername ]= useState('')
  const [ password, setPassword ]= useState('')
  const [ user, setUser] = useState( null )
  const [ errorMessage, setErrorMessage ] = useState( null )
  const [ blogs, setBlogs] = useState( null) 
  
  useEffect( () => {
    async function getBlogs () {
      try {
        const blogs = await blogService.getAll()
        if (blogs) {
          setBlogs( blogs)
        }
      } catch ( err ) {
        setErrorMessage(`404 not found`)
        setTimeout( () => {
          setErrorMessage( null )
        }, 5000)
      }
    }
    getBlogs()
  }, [])
  useEffect( ()=> {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if ( loggedUserJson){
      const user = JSON.parse(loggedUserJson)
      setUser(user) 
      blogService.setToken( user.token)
    }
  })

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
      
    } catch ( err ){
      
      setErrorMessage(`Wrong credentials`)
      setTimeout( () => {
        setErrorMessage( null )
      }, 5000)
    }
  }

  const handleLogOut = ( event) => {
    event.preventDefault()
    window.localStorage.clear()
    blogService.setToken( null )
    setUser( null )
    setUsername('') 
    setPassword('')
    //setBlogs(null)
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
      <h1>{ errorMessage}</h1>
      { 
        user === null 
          ? loginForm() 
          : <div>
              <h1>BLOGS</h1>
              <p>{ user.name } is logged in</p>
              <button onClick={ handleLogOut }>Log out</button>
              { blogList()}
            </div>
      }
    </div>
  );
}

export default App;
