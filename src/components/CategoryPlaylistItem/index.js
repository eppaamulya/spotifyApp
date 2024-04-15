import {Link} from 'react-router-dom'

import './index.css'

const CategoryPlaylistItem = props => {
  const {categoryPlaylistDetails} = props
  const {id, name, url, tracks} = categoryPlaylistDetails

  return (
    <>
      <Link to={`/playlist/${id}`} className="href-link">
        <li className="list-item">
          <img src={url} alt="featured playlist" className="home-image" />
          <h1 className="category-heading">{name}</h1>
          <p className="category-name">{tracks.total} Tracks</p>
        </li>
      </Link>
    </>
  )
}

export default CategoryPlaylistItem
