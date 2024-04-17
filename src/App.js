import {Route, Switch, Redirect} from 'react-router-dom'

import SpotifyProfile from './components/SpotifyProfile'
import Home from './components/Home'
import PlaylistsDetails from './components/PlaylistsDetails'
import CategoryPlaylistsDetails from './components/CategoryPlaylistsDetails'
import AlbumDetails from './components/AlbumDetails'
import ProtectedRoute from './components/ProtectedRoute'

import NotFound from './components/NotFound'

import './App.css'

// write your code here
const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={SpotifyProfile} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/playlist/:id" component={PlaylistsDetails} />
      <ProtectedRoute
        exact
        path="/category/:id/playlists"
        component={CategoryPlaylistsDetails}
      />
      <ProtectedRoute exact path="/album/:id" component={AlbumDetails} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </>
)

export default App
