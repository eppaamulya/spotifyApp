import React, {Component} from 'react'
import {
  MdSkipPrevious,
  MdPauseCircle,
  MdPlayCircle,
  MdSkipNext,
} from 'react-icons/md'
import {BiVolumeFull} from 'react-icons/bi'

import Cookies from 'js-cookie'
import moment from 'moment'

import Header from '../Header'
import Back from '../Back'
import AlbumDisplayInfo from '../AlbumDisplayInfo'
import Loading from '../Loading'
import AlbumItem from '../AlbumItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AlbumDetails extends Component {
  state = {
    musicList: [],
    displayInfo: {},
    index: 0,
    pause: true,
    activeSongClass: 0,
    currTime: '0:00',
    seek: 0,
    volume: 5,
    screenSize: window.innerWidth,
    currentSong: null,
    apiStatus: apiStatusConstants.initial,
  }

  audioRef = React.createRef()

  componentDidMount() {
    this.getAlbumLists()
  }

  getAlbumLists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const apiUrl = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const formattedAlbumInfo = {
        albumType: data.album_type,
        artists: data.artists,
        availableMarkets: data.available_markets,
        copyrights: data.copyrights,
        externalIds: data.external_ids,
        externalUrls: data.external_urls,
        genres: data.genres,
        href: data.href,
        id: data.id,
        images: data.images,
        url: data.images.length > 0 ? data.images[0].url : null,
        label: data.label,
        name: data.name,
        popularity: data.popularity,
        releaseDate: data.release_date,
        releaseDatePrecision: data.release_date_precision,
        totalTracks: data.total_tracks,
        tracks: data.tracks,
        items: data.tracks.items,
        type: data.type,
        uri: data.uri,
      }

      const formattedAlbumData = data.tracks.items.map(ite => ({
        id: ite.id,
        name: ite.name,
        artists: ite.artists,
        durationMs: ite.duration_ms,
        explicit: ite.explicit,
        externalUrls: ite.external_urls,
        href: ite.href,
        isLocal: ite.is_local,
        previewUrl: ite.preview_url,
        trackNumber: ite.track_number,
        type: ite.type,
        uri: ite.uri,
      }))

      this.setState({
        displayInfo: formattedAlbumInfo,
        musicList: formattedAlbumData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getFormaDistance = added => {
    const addedAgo = moment(added, 'YYYYMMDD').fromNow()
    return addedAgo
  }

  getDurationTime = inMilliSecs => {
    const inSecs = moment.duration(inMilliSecs).seconds()
    const inMins = moment.duration(inMilliSecs).minutes()

    if (inSecs < 10) {
      return `${inMins}:0${inSecs}`
    }
    return `${inMins}:${inSecs}`
  }

  onClickSelectSong = indx => {
    this.setState(
      {
        index: indx,
        pause: true,
      },
      this.updatePlayer,
    )
  }

  playSong = index => {
    const {musicLists} = this.state
    const selectedSong = musicLists[index]

    this.setState({index, currentSong: selectedSong, pause: false}, () => {
      if (selectedSong && selectedSong.track.preview_url) {
        this.audioRef.current.src = selectedSong.track.preview_url
        this.audioRef.current.play()
      }
    })
  }

  togglePlayPause = () => {
    const {pause} = this.state
    const audio = this.audioRef.current
    if (pause) {
      audio.play()
    } else {
      audio.pause()
    }
    this.setState(prevState => ({pause: !prevState.pause}))
  }

  playOrPause = () => {
    const {currentSong, pause} = this.state
    if (currentSong) {
      if (pause) {
        this.audioRef.current.play()
      } else {
        this.audioRef.current.pause()
      }
      this.setState({pause: !pause})
    }
  }

  nextSong = () => {
    const {index, musicList} = this.state
    if (index < musicList.length - 1) {
      this.setState(
        prevState => ({index: prevState.index + 1}),
        this.updatePlayer,
      )
    }
  }

  prevSong = () => {
    const {index} = this.state
    if (index > 0) {
      this.setState(
        prevState => ({index: prevState.index - 1}),
        this.updatePlayer,
      )
    }
  }

  updatePlayer = () => {
    const {musicList, index} = this.state
    const currentSong = musicList[index]
    this.setState({currentSong, pause: false}, () => {
      this.audioRef.current.load()
      this.audioRef.current.play()
    })
  }

  timeUpdate = () => {
    const {currentTime} = this.audioRef.current
    const mins = Math.floor(currentTime / 60)
    const secs = Math.floor(currentTime % 60)
    const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`
    this.setState({
      currTime: formattedTime,
      seek: (currentTime / this.audioRef.current.duration) * 100,
    })
  }

  changeSeekSlider = event => {
    const seek = parseInt(event.target.value, 10)
    this.audioRef.current.currentTime =
      (seek * this.audioRef.current.duration) / 100
    this.setState({seek})
  }

  adjustVolume = event => {
    const volume = parseInt(event.target.value, 10)
    this.audioRef.current.volume = volume / 10
    this.setState({volume})
  }

  renderMusicControlsMobileView = () => {
    const {musicList, index, pause, displayInfo} = this.state
    const {images} = displayInfo
    const currentSong = musicList[index]

    return (
      <div className="audio-container">
        <div className="container-1">
          <img
            src={currentSong ? images[2].url : ''}
            alt="song url"
            className="bottom-image"
          />
          <div className="container-2">
            <p className="bottom-para-1">
              {currentSong ? currentSong.name : ''}
            </p>
            <p className="bottom-para-2">
              {currentSong ? currentSong.artist[0].name : ''}
            </p>
          </div>
        </div>

        <div className="audio-inside-container">
          <audio
            ref={this.audioRef}
            onTimeUpdate={this.timeUpdate}
            onEnded={this.nextSong}
          >
            <track kind="captions" src="captions.vtt" label="English" />
            <source
              src={currentSong ? currentSong.previewUrl : ''}
              type="audio/mp3"
            />
          </audio>
          <button
            type="button"
            onClick={this.prevSong}
            className="prev-button"
            aria-label="Previous Song"
          >
            <MdSkipPrevious className="prev-icon" />
          </button>
          <button
            type="button"
            onClick={this.togglePlayPause}
            className="play-pause-button"
            aria-label={pause ? 'Play' : 'Pause'}
          >
            {pause ? (
              <MdPlayCircle className="play-icon" />
            ) : (
              <MdPauseCircle className="pause-icon" />
            )}
          </button>
          <button
            type="button"
            onClick={this.nextSong}
            className="next-button"
            aria-label="Next Song"
          >
            <MdSkipNext className="next-icon" />
          </button>
        </div>
      </div>
    )
  }

  renderMusicControlsDesktopView = () => {
    const {
      musicList,
      index,
      pause,
      currTime,
      seek,
      volume,
      displayInfo,
    } = this.state
    const {images} = displayInfo
    const currentSong = musicList[index]

    return (
      <div className="audio-container">
        <div className="container-1">
          <img
            src={currentSong ? images[2].url : ''}
            alt="song url"
            className="bottom-image"
          />
          <div className="container-2">
            <p className="bottom-para-1">
              {currentSong ? currentSong.name : ''}
            </p>
            <p className="bottom-para-2">
              {currentSong ? currentSong.artists[0].name : ''}
            </p>
          </div>
        </div>

        <div className="audio-inside-container">
          <audio
            ref={this.audioRef}
            onTimeUpdate={this.timeUpdate}
            onEnded={this.nextSong}
          >
            <track kind="captions" src="captions.vtt" label="English" />
            <source
              src={currentSong ? currentSong.previewUrl : ''}
              type="audio/mp3"
            />
          </audio>
          <button
            type="button"
            onClick={this.prevSong}
            className="prev-button"
            aria-label="Previous Song"
          >
            <MdSkipPrevious className="prev-icon" />
          </button>
          <button
            type="button"
            onClick={this.togglePlayPause}
            className="play-pause-button"
            aria-label={pause ? 'Play' : 'Pause'}
          >
            {pause ? (
              <MdPlayCircle className="play-icon" />
            ) : (
              <MdPauseCircle className="pause-icon" />
            )}
          </button>
          <button
            type="button"
            onClick={this.nextSong}
            className="next-button"
            aria-label="Next Song"
          >
            <MdSkipNext className="next-icon" />
          </button>
          <span className="bottom-time">{currTime}</span>
          <input
            type="range"
            value={seek}
            onChange={this.changeSeekSlider}
            max="100"
            className="bottom-seek"
            aria-label="Seek Slider"
          />
          {}
          <BiVolumeFull className="vol-icon" />
          <input
            type="range"
            value={volume}
            onChange={this.adjustVolume}
            max="10"
            className="bottom-volume"
          />
        </div>
      </div>
    )
  }

  renderLoadingView = () => <Loading />

  renderFailureView = () => {
    const onClickRetry = () => {
      this.getAlbumLists()
    }
    return (
      <div className="failure-bg-container-1">
        <img
          src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png"
          alt="failure view"
          className="failure-image"
        />
        <p className="failure-para">Something went wrong. Please try again</p>
        <button type="button" className="failure-button" onClick={onClickRetry}>
          Try again
        </button>
      </div>
    )
  }

  renderAlbumList = () => {
    const {musicList, displayInfo, screenSize, index} = this.state

    return (
      <>
        <div className="playlist-top-container-1">
          <div>
            <AlbumDisplayInfo
              displayInfo={displayInfo}
              section="New Releases"
            />
          </div>
          <div className="columns-row">
            <p className="column-name-1">Track</p>
            <p className="column-name-2">Time</p>
            <p className="column-name-3">Artist</p>
            <p className="column-name-4">Popularity</p>
          </div>
          <hr className="hr-line" />
          <div className="playlist-list-container-1">
            <ul className="playlist-list-container-2">
              {musicList.map((itemss, key = 0) => (
                <AlbumItem
                  songData={itemss}
                  displayInfo={displayInfo}
                  playSong={this.onClickSelectSong}
                  isActive={index === key}
                  key={key}
                  index={key}
                />
              ))}
            </ul>
          </div>
          <div className="music-container">
            {screenSize >= 768
              ? this.renderMusicControlsDesktopView()
              : this.renderMusicControlsMobileView()}
          </div>
        </div>
      </>
    )
  }

  renderAlbumListView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAlbumList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {screenSize} = this.state

    return (
      <div className="playlists-bg-container">
        {screenSize >= 768 && <Header />}
        <div className="playlists-container">
          <div className="playlist-top-container">
            <Back />
          </div>
          {this.renderAlbumListView()}
        </div>
      </div>
    )
  }
}

export default AlbumDetails
