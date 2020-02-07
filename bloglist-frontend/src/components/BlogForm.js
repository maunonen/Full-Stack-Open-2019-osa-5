import React from 'react'

const BlogForm = ( {
  handleAddBlog, title, setTitle, author,
  url , setUrl } ) => (
  <div>
    <h1>create new</h1>
    <form onSubmit={ handleAddBlog }>
      <div>
      title:
        <input
          type="text"
          value={ title }
          name="Title"
          onChange={({ target }) => setTitle( target.value )}
        />
      </div>
      <div>
      author:
        <input
          type="text"
          value={ author }
          name="Author"
          readOnly
          //onChange={({ target}) => setAuthor( target.value )}
        />
      </div>
      <div>
      url:
        <input
          type="text"
          value={ url }
          name="Url"
          onChange={({ target }) => setUrl( target.value )}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
)

export default BlogForm