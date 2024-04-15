import {Link} from 'react-router-dom'

import './index.css'

const PlaylistItem = props => {
  const {playlistDetails} = props

  const {id, name, url, tracks} = playlistDetails

  return (
    <Link to={`/playlist/${id}`} className="href-link">
      <li className="list-item">
        <img src={url} alt="featured playlist" className="home-image" />
        <p className="home-name">{name}</p>
        <p className="home-name">{tracks.total} Tracks</p>
      </li>
    </Link>
  )
}

export default PlaylistItem
