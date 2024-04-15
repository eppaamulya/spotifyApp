import React, {Component} from 'react'
import {BiVolumeFull} from 'react-icons/bi'
import {
  MdSkipPrevious,
  MdPauseCircle,
  MdPlayCircle,
  MdSkipNext,
} from 'react-icons/md'

import Cookies from 'js-cookie'

import Header from '../Header'
import Back from '../Back'
import PlaylistDisplayInfo from '../PlaylistDisplayInfo'
import PlayItem from '../PlayItem'
import Loading from '../Loading'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PlaylistsDetails extends Component {
  state = {
    musicLists: [],
    displayInfos: {},
    index: 0,
    pause: true,
    activeSongClass: 0,
    currTime: '0:00',
    seek: 0,
    volume: 5,
    currentSong: null,
    screenSize: window.innerWidth,
    apiStatus: apiStatusConstants.initial,
  }

  audioRef = React.createRef()

  componentDidMount() {
    this.getSpecificPlaylists()
  }

  getSpecificPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedSpecificPlaylistInfo = {
        collaborative: data.collaborative,
        description: data.description,
        externalUrls: data.external_urls,
        href: data.href,
        id: data.id,
        images: data.images,
        url: data.images.length > 0 ? data.images[0].url : null,
        name: data.name,
        owner: data.owner,
        primaryColor: data.primary_color,
        public: data.public,
        snapshotId: data.snapshot_id,
        tracks: data.tracks,
        type: data.type,
        uri: data.uri,
      }

      const formattedSpecificPlaylistData = data.tracks.items.map(item => ({
        track: item.track,
        album: item.track.album,
        artists: item.track.artists,
        albumImages: item.track.album.images,
        albumUrl:
          item.track.album.images.length > 0
            ? item.track.album.images[2].url
            : null,
        availableMarkets: item.track.available_markets,
        discNumber: item.track.disc_number,
        durationMs: item.track.duration_ms,
        episode: item.track.episode,
        explicit: item.track.explicit,
        externalIds: item.track.external_ids,
        externalUrls: item.track.external_urls,
        href: item.track.href,
        id: item.track.id,
        isLocal: item.track.is_local,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        name: item.track.name,
        trackNumber: item.track.track_number,
        type: item.track.type,
        uri: item.track.uri,
      }))
      this.setState({
        musicLists: formattedSpecificPlaylistData,
        displayInfos: formattedSpecificPlaylistInfo,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
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

  playNextSong = () => {
    const {index, musicLists} = this.state
    if (index < musicLists.length - 1) {
      this.playSong(index + 1)
    }
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
    const {index, musicLists} = this.state
    if (index < musicLists.length - 1) {
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
    const {musicLists, index} = this.state
    const currentSong = musicLists[index]
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
    const {musicLists, index, pause} = this.state
    const currentSong = musicLists[index]

    return (
      <div className="audio-container">
        <div className="container-1">
          <img
            src={currentSong ? currentSong.albumUrl : ''}
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
            onClick={this.playOrPause}
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
    const {musicLists, index, pause, seek, volume, currTime} = this.state
    const currentSong = musicLists[index]

    return (
      <div className="audio-container">
        <div className="container-1">
          <img
            src={currentSong ? currentSong.albumUrl : ''}
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
          />
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
      this.getSpecificPlaylists()
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
          Try Again
        </button>
      </div>
    )
  }

  renderMusicLists = () => {
    const {displayInfos, screenSize, musicLists, index} = this.state

    return (
      <>
        <div className="playlist-top-container-1">
          <div>
            <PlaylistDisplayInfo
              displayInfos={displayInfos}
              section="Editors Picks"
            />
          </div>
          <div className="columns-row">
            <p className="column-name-1">Track</p>
            <p className="column-name-2">Album</p>
            <p className="column-name-3">Time</p>
            <p className="column-name-4">Artist</p>
            <p className="column-name-5">Added</p>
          </div>
          <hr className="hr-line" />
          <div className="playlist-list-container-1">
            <ul className="playlist-list-container-2">
              {musicLists.map((itemss, key = 0) => (
                <PlayItem
                  songData={itemss}
                  displayInfos={displayInfos}
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

  renderMusicListView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMusicLists()
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
          {this.renderMusicListView()}
        </div>
      </div>
    )
  }
}
export default PlaylistsDetails
