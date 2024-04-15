import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'
import {IoClose} from 'react-icons/io5'
import {GiHamburgerMenu} from 'react-icons/gi'
import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {isOpen: false}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  toggleNavbar = () => {
    const {isOpen} = this.state
    this.setState({isOpen: !isOpen})
  }

  render() {
    const {isOpen} = this.state
    return (
      <>
        <nav className="nav-bg-container">
          <Link to="/" className="href-link-1">
            <img
              src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711020939/yditscjxxxdhodec78wx.png"
              alt="website logo"
              className="nav-website-logo"
            />
          </Link>

          <div className="nav-container-1">
            <button
              type="button"
              onClick={this.onClickLogout}
              className="logout-button logout-name"
            >
              <img
                src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711085442/z3arbxzxpmjhukq8ewud.png"
                alt="logout"
                className="logout-logo"
              />
              Logout
            </button>
          </div>
          <div className="nav-container-2">
            <button
              type="button"
              className="logout-button"
              onClick={this.toggleNavbar}
            >
              {isOpen ? (
                <IoClose className="logout-logo" />
              ) : (
                <GiHamburgerMenu className="logout-logo" />
              )}
            </button>
          </div>
        </nav>
        {isOpen ? (
          <div className="open-menu">
            <Link to="/" className="href-link-2">
              Home
            </Link>
            <button
              type="button"
              onClick={this.onClickLogout}
              className="logout-button logout-name"
            >
              Logout
            </button>
          </div>
        ) : (
          ''
        )}
      </>
    )
  }
}

export default withRouter(Header)
