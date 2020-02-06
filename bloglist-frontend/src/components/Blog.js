import React , { useState } from 'react'

const Blog = ({ blog, handleAddLike, handleRemoveBlog, user  }) => {

  const [ visible, setVisible ]= useState( false )

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const handleClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    handleAddLike( blog)    
  }
  const removeBlog = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const aproveRemove = window.confirm(`Remove blog ${ blog.title} by ${ blog.author}`)
    if (aproveRemove) {
      handleRemoveBlog( event.target.value)
    }
  }
  
  const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
  }
  return (
    <div style={ blogStyle }>
      <div onClick={ toggleVisibility }>
        <p>{blog.title}</p>
        <a style={ { display: visible ? 'block' : 'none' }} href={ blog.url}>{ blog.url}</a>
        <p style={ { display: visible ? 'block' : 'none'}}>{ blog.likes}
          <button onClick={ handleClick }
            >Like</button>        
        </p>
        <p style={ { display: visible ? 'block' : 'none' }}>added by { blog.author}</p>
        <button 
          style={ { display: visible && user.username === blog.author ? 'block' : 'none' }}
          value = { blog.id } 
          onClick = { removeBlog }>Remove
        </button>
      </div>
    </div>
  )
}
export default Blog