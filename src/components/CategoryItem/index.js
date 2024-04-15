import {Link} from 'react-router-dom'

import './index.css'

const CategoryItem = props => {
  const {categoryDetails} = props

  const {id, name, url} = categoryDetails
  return (
    <Link to={`/category/${id}/playlists`} className="href-link">
      <li className="list-item">
        <img src={url} alt="category" className="home-image" />
        <p className="home-name">{name}</p>
      </li>
    </Link>
  )
}

export default CategoryItem
