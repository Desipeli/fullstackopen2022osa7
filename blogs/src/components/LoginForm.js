import PropTypes from 'prop-types'
import React from 'react'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  setPassword,
  password
}) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        type="text"
        value={username}
        name="Username"
        id="username-input"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        type="password"
        value={password}
        name="Password"
        autoComplete="off"
        id="password-input"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id="login-button" type="submit">
      login
    </button>
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

LoginForm.displayName = 'LoginForm'

export default LoginForm
