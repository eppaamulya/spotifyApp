import './index.css'

const PlaylistDisplayInfo = props => {
  const {displayInfos, section} = props
  const {name, url, artists, description} = displayInfos

  return (
    <>
      <div className="playlists-top-container-lg">
        <img src={url} alt="display" className="playlist-image" />
        <div className="playlists-top-container-1">
          <p className="playlist-para">{section}</p>
          <h1 className="playlist-heading">{name}</h1>
          <p className="playlist-para">{description}</p>
        </div>
      </div>
    </>
  )
}

export default PlaylistDisplayInfo
