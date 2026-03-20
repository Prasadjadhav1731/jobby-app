import {useState} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const onSubmit = async event => {
    event.preventDefault()
    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    })
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      setError(data.error_msg || 'Login failed')
    }
  }

  const token = Cookies.get('jwt_token')
  if (token !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={onSubmit}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="login-logo"
        />

        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          className="input"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />

        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        {error && <p className="error">*{error}</p>}
      </form>
    </div>
  )
}

export default Login