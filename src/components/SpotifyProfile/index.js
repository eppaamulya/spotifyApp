import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class SpotifyProfile extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    console.log(history)
    Cookies.set('jwt_token', jwtToken, {expires: 90})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-bg-login-container">
        <div className="app-login-container">
          <form className="login-form-container" onSubmit={this.onSubmitLogin}>
            <div className="login-form-top-container">
              <img
                src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711020939/yditscjxxxdhodec78wx.png"
                alt="login website logo"
                className="login-website-logo"
              />
              <h1 className="login-form-heading">Spotify Remix</h1>
            </div>
            <div className="login-form-bottom-container">
              <label className="label-username" htmlFor="userId">
                USERNAME
              </label>
              <input
                type="text"
                id="userId"
                value={username}
                onChange={this.onChangeUsername}
                className="input-username"
              />
              <label className="label-username" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={this.onChangePassword}
                className="input-username"
              />
              <button type="submit" className="login-button">
                LOGIN
              </button>
              {showSubmitError && <p className="login-error">*{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default SpotifyProfile
