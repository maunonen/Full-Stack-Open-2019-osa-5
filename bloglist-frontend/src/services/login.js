import axios from 'axios'
const baseurl = '/api/login'

const login = async credentials => {
    //console.log('Credential', credentials)
    const responce = await axios.post(baseurl, credentials)  
    //console.log('RESPONCE DATA', responce)
    return responce.data
}

export default { login }