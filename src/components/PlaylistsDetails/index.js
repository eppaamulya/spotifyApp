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

const playApiStatusConstants = {
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
    playApiStatus: playApiStatusConstants.initial,
  }

  audioRef = React.createRef()

  componentDidMount() {
    this.getSpecificPlaylists()
  }

  getSpecificPlaylists = async () => {
    this.setState({playApiStatus: playApiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const playResponse = await fetch(apiUrl, options)
    const data = await playResponse.json()
    if (playResponse.ok === true) {
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

      const formattedSpecificPlaylistData = data.tracks.items.map(itemData => ({
        track: itemData.track,
        album: itemData.track.album,
        artists: itemData.track.artists,
        albumImages: itemData.track.album.images,
        albumUrl:
          itemData.track.album.images.length > 0
            ? itemData.track.album.images[2].url
            : null,
        availableMarkets: itemData.track.available_markets,
        discNumber: itemData.track.disc_number,
        durationMs: itemData.track.duration_ms,
        episode: itemData.track.episode,
        explicit: itemData.track.explicit,
        externalIds: itemData.track.external_ids,
        externalUrls: itemData.track.external_urls,
        href: itemData.track.href,
        id: itemData.track.id,
        isLocal: itemData.track.is_local,
        popularity: itemData.track.popularity,
        previewUrl: itemData.track.preview_url,
        name: itemData.track.name,
        trackNumber: itemData.track.track_number,
        type: itemData.track.type,
        uri: itemData.track.uri,
      }))
      this.setState({
        musicLists: formattedSpecificPlaylistData,
        displayInfos: formattedSpecificPlaylistInfo,
        playApiStatus: playApiStatusConstants.success,
      })
    } else {
      this.setState({playApiStatus: playApiStatusConstants.failure})
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

  renderMusicControls = () => {
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

  renderSuccessView = () => {
    const {displayInfos, musicLists, index} = this.state

    return (
      <>
        <div className="playlist-top-container-1">
          <div>
            <PlaylistDisplayInfo
              displayInfos={displayInfos}
              section="Editors Picks"
            />
          </div>
          <div>
            <div className="playlist-columns-row">
              <p className="column-name-1">Track</p>
              <p className="column-name-2">Album</p>
              <p className="column-name-3">Time</p>
              <p className="column-name-4">Artist</p>
              <p className="column-name-5">Added</p>
            </div>
            <hr className="hr-line" />
          </div>
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
          <div className="music-container">{this.renderMusicControls()}</div>
        </div>
      </>
    )
  }

  renderMusicListView = () => {
    const {playApiStatus} = this.state
    switch (playApiStatus) {
      case playApiStatusConstants.success:
        return this.renderSuccessView()
      case playApiStatusConstants.failure:
        return this.renderFailureView()
      case playApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {screenSize} = this.state

    return (
      <div className="playlists-bg-container">
        {screenSize >= 768 && <Header className="display-header" />}
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
