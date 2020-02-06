import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const addLike = async ( blog ) => {
  const request = await axios.put(`${ baseUrl}/${ blog.id}`, blog)
  return request.data
}

const createBlog = async ( blog) => {
  console.log('Create blog object', blog)
  const config = {
    headers: { Authorization: token }
  }
  const request  = await axios.post( baseUrl, blog , config )
  return request.data
}

const removeBlog = async (id) => {
    console.log( 'Service ID BLOG', id )
    const config = {
      headers: { Authorization: token }
    }
    const request = await axios.delete(`${ baseUrl}/${ id}`, config )
    console.log('status', request.status)
    return request.status

}

const setToken = ( newToken ) => {
  token = `bearer ${newToken}`
}



export default { getAll , setToken, createBlog, addLike, removeBlog}