import React , { useState } from 'react'

const Blog = ({ blog, handleAddLike  }) => {

  const [ visible, setVisible ]= useState( false )

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const handleClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    handleAddLike( blog)    
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
      </div>
    </div>
  )
}
export default Blog