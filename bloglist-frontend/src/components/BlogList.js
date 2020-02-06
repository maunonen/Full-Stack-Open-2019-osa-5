import React from 'react'
import Blog from '../components/Blog'

const BlogList = ({ blogs, handleAddLike, handleRemoveBlog }) => {
  
  return (
    <div>
      <h2>blogs</h2>
      { blogs === null
          ? <p>404 nothing found</p>
          : blogs.map(blog =>
              <Blog 
                key={blog.id} 
                blog={blog}
                handleAddLike = { handleAddLike }
                handleRemoveBlog = { handleRemoveBlog }
              />
      )}
    </div>
  )
}
  
    
  

export default BlogList