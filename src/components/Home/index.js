import {Component} from 'react'

import Cookies from 'js-cookie'
import Header from '../Header'
import PlaylistItem from '../PlaylistItem'
import CategoryItem from '../CategoryItem'
import NewReleaseItem from '../NewReleaseItem'
import Loading from '../Loading'
import './index.css'

const editorApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const genreApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const newReleaseApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    playlistList: [],
    categoriesList: [],
    newReleasesList: [],
    editorApiStatus: editorApiStatusConstants.initial,
    genreApiStatus: genreApiStatusConstants.initial,
    newReleaseApiStatus: newReleaseApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getFeaturedPlaylists()
    this.getCategoryPlaylists()
    this.getNewReleasesPlaylists()
  }

  getFeaturedPlaylists = async () => {
    this.setState({editorApiStatus: editorApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis2.ccbp.in/spotify-clone/featured-playlists'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const playlistData = await response.json()
    if (response.ok === true) {
      const formattedPlaylistData = playlistData.playlists.items.map(play => ({
        href: play.href,
        collaborative: play.collaborative,
        description: play.description,
        externalUrls: play.external_urls,
        spotify: play.external_urls.spotify,
        id: play.id,
        images: play.images,
        url: play.images.length > 0 ? play.images[0].url : null,
        name: play.name,
        owner: play.owner,
        displayName: play.owner.display_name,
        ownerExternalUrls: play.owner.external_urls,
        ownerSpotify: play.owner.external_urls.spotify,
        ownerHref: play.owner.href,
        ownerId: play.owner.id,
        ownerType: play.owner.type,
        ownerUri: play.owner.uri,
        primaryColor: play.primary_color,
        public: play.public,
        snapshotId: play.snapshot_id,
        tracks: play.tracks,
        tracksHref: play.tracks.href,
        type: play.type,
        uri: play.uri,
      }))
      this.setState({
        playlistList: formattedPlaylistData,
        editorApiStatus: editorApiStatusConstants.success,
      })
    } else {
      this.setState({
        editorApiStatus: editorApiStatusConstants.failure,
      })
    }
  }

  getCategoryPlaylists = async () => {
    this.setState({genreApiStatus: genreApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis2.ccbp.in/spotify-clone/categories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const categoryResponse = await fetch(url, options)
    const categoryData = await categoryResponse.json()
    if (categoryResponse.ok === true) {
      const formattedCategoryData = categoryData.categories.items.map(
        eachItem => ({
          href: eachItem.href,
          icons: eachItem.icons,
          url: eachItem.icons.length > 0 ? eachItem.icons[0].url : null,
          id: eachItem.id,
          name: eachItem.name,
        }),
      )
      this.setState({
        categoriesList: formattedCategoryData,
        genreApiStatus: genreApiStatusConstants.success,
      })
    } else {
      this.setState({
        genreApiStatus: genreApiStatusConstants.failure,
      })
    }
  }

  getNewReleasesPlaylists = async () => {
    this.setState({
      newReleaseApiStatus: newReleaseApiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis2.ccbp.in/spotify-clone/new-releases'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const newReleaseResponse = await fetch(url, options)
    const newReleaseData = await newReleaseResponse.json()

    if (newReleaseResponse.ok === true) {
      const formattedNewReleaseData = newReleaseData.albums.items.map(
        newRel => ({
          albumType: newRel.album_type,
          artists: newRel.artists,
          externalUrls: newRel.external_urls,
          id: newRel.id,
          href: newRel.href,
          name: newRel.name,
          images: newRel.images,
          url: newRel.images.length > 0 ? newRel.images[0].url : null,
        }),
      )
      this.setState({
        newReleasesList: formattedNewReleaseData,
        newReleaseApiStatus: newReleaseApiStatusConstants.success,
      })
    } else {
      this.setState({
        newReleaseApiStatus: newReleaseApiStatusConstants.failure,
      })
    }
  }

  renderEditorsPick = () => {
    const {playlistList} = this.state

    return (
      <>
        <ul className="home-list-container">
          {playlistList.map(playlistCard => (
            <PlaylistItem
              key={playlistCard.id}
              playlistDetails={playlistCard}
            />
          ))}
        </ul>
      </>
    )
  }

  renderGenrePick = () => {
    const {categoriesList} = this.state
    return (
      <>
        <ul className="home-list-container">
          {categoriesList.map(category => (
            <CategoryItem key={category.id} categoryDetails={category} />
          ))}
        </ul>
      </>
    )
  }

  renderNewReleasePick = () => {
    const {newReleasesList} = this.state
    return (
      <>
        <ul className="home-list-container">
          {newReleasesList.map(release => (
            <NewReleaseItem key={release.id} newReleaseDetails={release} />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => <Loading />

  renderFailureView1 = () => {
    const onClickRetry1 = () => {
      this.getFeaturedPlaylists()
    }
    return (
      <div className="failure-bg-container">
        <img
          src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png"
          alt="failure view"
          className="failure-image"
        />
        <p className="failure-para">Something went wrong. Please try again</p>
        <button
          type="button"
          className="failure-button"
          onClick={onClickRetry1}
        >
          Try again
        </button>
      </div>
    )
  }

  renderFailureView2 = () => {
    const onClickRetry2 = () => {
      this.getCategoryPlaylists()
    }
    return (
      <div className="failure-bg-container">
        <img
          src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png"
          alt="failure view"
          className="failure-image"
        />
        <p className="failure-para">Something went wrong. Please try again</p>
        <button
          type="button"
          className="failure-button"
          onClick={onClickRetry2}
        >
          Try again
        </button>
      </div>
    )
  }

  renderFailureView3 = () => {
    const onClickRetry3 = () => {
      this.getNewReleasesPlaylists()
    }
    return (
      <div className="failure-bg-container">
        <img
          src="https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png"
          alt="failure view"
          className="failure-image"
        />
        <p className="failure-para">Something went wrong. Please try again</p>
        <button
          type="button"
          className="failure-button"
          onClick={onClickRetry3}
        >
          Try again
        </button>
      </div>
    )
  }

  renderTopView = () => {
    const {editorApiStatus} = this.state
    switch (editorApiStatus) {
      case editorApiStatusConstants.success:
        return this.renderEditorsPick()
      case editorApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case editorApiStatusConstants.failure:
        return this.renderFailureView1()
      default:
        return null
    }
  }

  renderMiddleView = () => {
    const {genreApiStatus} = this.state
    switch (genreApiStatus) {
      case genreApiStatusConstants.success:
        return this.renderGenrePick()
      case genreApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case genreApiStatusConstants.failure:
        return this.renderFailureView2()
      default:
        return null
    }
  }

  renderBottomView = () => {
    const {newReleaseApiStatus} = this.state
    switch (newReleaseApiStatus) {
      case newReleaseApiStatusConstants.success:
        return this.renderNewReleasePick()
      case newReleaseApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case newReleaseApiStatusConstants.failure:
        return this.renderFailureView3()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-bg-container">
        <Header />
        <div className="home-container">
          <h1 className="home-heading">Editors Picks</h1>
          {this.renderTopView()}
          <h1 className="home-heading-1">Genres & Moods</h1>
          {this.renderMiddleView()}
          <h1 className="home-heading-1">New Releases</h1>
          {this.renderBottomView()}
        </div>
      </div>
    )
  }
}

export default Home
