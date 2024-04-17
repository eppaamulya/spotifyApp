import {Component} from 'react'
import {IoMdArrowRoundBack} from 'react-icons/io'
import {withRouter} from 'react-router-dom'
import './index.css'

class Back extends Component {
  onClickBack = () => {
    const {history} = this.props
    history.goBack()
  }

  render() {
    return (
      <div className="back-container">
        <button
          type="button"
          className="back-button-icon"
          onClick={this.onClickBack}
        >
          {' '}
          <IoMdArrowRoundBack className="back-arrow" />{' '}
        </button>
        <button
          type="button"
          className="back-button-icon back-heading"
          onClick={this.onClickBack}
        >
          Back
        </button>
      </div>
    )
  }
}

export default withRouter(Back)
