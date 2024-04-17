import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import CategoryPlaylistItem from '../CategoryPlaylistItem'
import Back from '../Back'
import Loading from '../Loading'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CategoryPlaylistsDetails extends Component {
  state = {
    categoryPlaylists: [],
    categoriesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCategoriesPlaylists()
  }

  getCategoriesPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis2.ccbp.in/spotify-clone/category-playlists/${id}`
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
      const formattedCategoryListData = data.playlists.items.map(item => ({
        collaborative: item.collaborative,
        href: item.href === null ? '' : item.href,
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
        tracksTotal: item.tracks.total,
        type: item.type,
        uri: item.uri,
      }))
      this.setState({
        categoryPlaylists: formattedCategoryListData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCategorySuccessView = () => {
    const {categoryPlaylists, categoriesList} = this.state

    return (
      <>
        <ul className="home-list-container">
          {categoryPlaylists.map(eachOne => (
            <CategoryPlaylistItem
              categoriesList={categoriesList}
              key={eachOne.id}
              categoryPlaylistDetails={eachOne}
            />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => <Loading />

  renderFailureView = () => {
    const onClickRetry = () => {
      this.getCategoriesPlaylists()
    }
    return (
      <div className="failure-bg-container">
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

  renderCategoriesView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCategorySuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="categories-bg-container">
        <Header />
        <div className="playlists-container">
          <Back />
          <>
            <h1 className="home-heading-1">Playlists</h1>
            {this.renderCategoriesView()}
          </>
        </div>
      </div>
    )
  }
}
export default CategoryPlaylistsDetails
