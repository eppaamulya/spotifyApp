import {Link} from 'react-router-dom'

import './index.css'

const NewReleaseItem = props => {
  const {newReleaseDetails} = props

  const {id, name, url} = newReleaseDetails
  return (
    <Link to={`/album/${id}`} className="href-link">
      <li className="list-item">
        <img src={url} alt="new release album" className="home-image" />
        <p className="home-name">{name}</p>
      </li>
    </Link>
  )
}

export default NewReleaseItem
