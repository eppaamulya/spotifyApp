import moment from 'moment'

import './index.css'

const AlbumItem = props => {
  const {songData, playSong, index, isActive, displayInfo} = props
  const {id, name, durationMs} = songData

  const activeSongClass = isActive && 'active-class'

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
        <img src={displayInfo.url} alt="album" className="album-thumbnail" />
        <div className="columns-row-1">
          <p className="span-name-lg">{name}</p>
          <p className="span-name-duration">{getDurationTime(durationMs)}</p>
          <p className="span-artist-lg">
            {displayInfo.artists ? displayInfo.artists[0].name : 'Artist'}
          </p>
          <p className="span-date-lg">{displayInfo.popularity}</p>
        </div>
      </li>
    </>
  )
}

export default AlbumItem
