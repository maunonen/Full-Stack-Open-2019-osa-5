import axios from 'axios'
const baseurl = '/api/login'

const login = async credentials => {
  const responce = await axios.post(baseurl, credentials)
  return responce.data
}

export default { login }