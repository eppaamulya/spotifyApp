import {Link} from 'react-router-dom'

import Header from '../Header'
import Back from '../Back'

import './index.css'

const NotFound = () => (
  <div className="not-found-bg-container">
    <div className="not-found-header">
      <Header />
    </div>
    <div className="not-found-container">
      <Back />
    </div>
    <div className="not-found-container-1">
      <img
        src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711284573/xwpb4swj9yb51hl7qafo.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <Link to="/" className="href-link-1">
        <button type="button" className="not-found-button">
          Home Page
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
