import {Component} from 'react'

import Cookies from 'js-cookie'
import Header from '../Header'
import PlaylistItem from '../PlaylistItem'
import CategoryItem from '../CategoryItem'
import NewReleaseItem from '../NewReleaseItem'
import Loading from '../Loading'
import './index.css'

const apiStatusConstants = {
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
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getFeaturedPlaylists()
    this.getCategoryPlaylists()
    this.getNewReleasesPlaylists()
  }

  getFeaturedPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
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
      const formattedPlaylistData = playlistData.playlists.items.map(item => ({
        href: item.href,
        collaborative: item.collaborative,
        description: item.description,
        externalUrls: item.external_urls,
        spotify: item.external_urls.spotify,
        id: item.id,
        images: item.images,
        url: item.images.length > 0 ? item.images[0].url : null,
        name: item.name,
        owner: item.owner,
        displayName: item.owner.display_name,
        ownerExternalUrls: item.owner.external_urls,
        ownerSpotify: item.owner.external_urls.spotify,
        ownerHref: item.owner.href,
        ownerId: item.owner.id,
        ownerType: item.owner.type,
        ownerUri: item.owner.uri,
        primaryColor: item.primary_color,
        public: item.public,
        snapshotId: item.snapshot_id,
        tracks: item.tracks,
        tracksHref: item.tracks.href,
        type: item.type,
        uri: item.uri,
      }))
      this.setState({
        playlistList: formattedPlaylistData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getCategoryPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
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
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getNewReleasesPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
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
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderEditorsPick = () => {
    const {playlistList} = this.state

    return (
      <>
        <ul className='home-list-container'>
          {playlistList.map(playlist => (
            <PlaylistItem key={playlist.id} playlistDetails={playlist} />
          ))}
        </ul>
      </>
    )
  }

  renderGenrePick = () => {
    const {categoriesList} = this.state
    return (
      <>
        <ul className='home-list-container'>
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
        <ul className='home-list-container'>
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
      <div className='failure-bg-container'>
        <img
          src='https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png'
          alt='failure view'
          className='failure-image'
        />
        <p className='failure-para'>Something went wrong. Please try again</p>
        <button
          type='button'
          className='failure-button'
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
      <div className='failure-bg-container'>
        <img
          src='https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png'
          alt='failure view'
          className='failure-image'
        />
        <p className='failure-para'>Something went wrong. Please try again</p>
        <button
          type='button'
          className='failure-button'
          onClick={onClickRetry2}
        >
          Try again
        </button>
      </div>
    )
  }

  renderFailureView3 = () => {
    const onClickRetry3 = () => {
      this.getNewRealsesPlaylists()
    }
    return (
      <div className='failure-bg-container'>
        <img
          src='https://res.cloudinary.com/dq9pyd1fh/image/upload/v1711288427/a7t2cmgymw8gstakespn.png'
          alt='failure view'
          className='failure-image'
        />
        <p className='failure-para'>Something went wrong. Please try again</p>
        <button
          type='button'
          className='failure-button'
          onClick={onClickRetry3}
        >
          Try again
        </button>
      </div>
    )
  }

  renderTopView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderEditorsPick()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView1()
      default:
        return null
    }
  }

  renderMiddleView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderGenrePick()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView2()
      default:
        return null
    }
  }

  renderBottomView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderNewReleasePick()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView3()
      default:
        return null
    }
  }

  render() {
    return (
      <div className='home-bg-container'>
        <Header />
        <div className='home-container'>
          <h1 className='home-heading'>Editors Picks</h1>
          {this.renderTopView()}
          <h1 className='home-heading-1'>Genres & Moods</h1>
          {this.renderMiddleView()}
          <h1 className='home-heading-1'>New Releases</h1>
          {this.renderBottomView()}
        </div>
      </div>
    )
  }
}

export default Home
