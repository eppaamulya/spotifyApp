import moment from 'moment'

import './index.css'

const PlayItem = props => {
  const {songData, playSong, index, isActive, displayInfos} = props
  const {id, name, durationMs, album, artists, albumUrl, track} = songData

  const activeSongClass = isActive && 'active-class'

  const getFormaDistance = added => {
    const addedAgo = moment(added, 'YYYYMMDD').fromNow()
    return addedAgo
  }

  const getDurationTime = inMilliSecs => {
    const inSecs = moment.duration(inMilliSecs).seconds()
    const inMins = moment.duration(inMilliSecs).minutes()

    if (inSecs < 10) {
      return `${inMins}:0${inSecs}`
    }
    return `${inMins}:${inSecs}`
  }

  const onClickSelectSong = () => {
    playSong(index)
  }

  return (
    <>
      <li
        className={`playlist-list-item-lg ${activeSongClass}`}
        onClick={onClickSelectSong}
      >
        <img src={albumUrl} alt="album" className="album-thumbnail" />
        <div className="columns-row-1">
          <p className="span-name-lg">{track.name}</p>
          <p className="span-album-name-lg">{album.name}</p>
          <p className="span-duration-lg">{getDurationTime(durationMs)}</p>
          <p className="span-artist-lg">{track.artists[0].name}</p>
          <p className="span-date-lg">
            {album
              ? getFormaDistance(album.release_date)
              : getFormaDistance(displayInfos.releaseDate)}
          </p>
        </div>
      </li>
      <li
        className={`playlist-list-item-md ${activeSongClass}`}
        onClick={onClickSelectSong}
      >
        <img src={albumUrl} alt="album" className="album-thumbnail" />
        <div className="columns-row-1">
          <div className="container-md-1">
            <p className="span-name-md">{name}</p>
            <p className="span-artist-md">{track.artists[0].name}</p>
          </div>
          <div className="container-md-2">
            <p className="span-duration-md">{getDurationTime(durationMs)}</p>
          </div>
        </div>
      </li>
    </>
  )
}

export default PlayItem
