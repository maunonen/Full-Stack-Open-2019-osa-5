import React from 'react'

const LoginForm = ({
  password, username, handleLogin, setUsername, setPassword
}) => (
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
export default LoginForm