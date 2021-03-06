'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

export default class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const styles = {
      overlay: {
        backgroundColor: 'rgba(0,0,0,.7)'
      },
      content: {
        height: this.props.height,
        width: this.props.width,
        margin: '0 auto',
        padding: '0px 3px 3px 3px',
        borderRadius: '8px',
      },
    }

    const modalContent = {
      padding: '6px'
    }
    return (
      <ReactModal isOpen={this.props.isOpen} contentLabel="Modal" style={styles} ariaHideApp={false}>
        <div>
          <span className="fa-stack fa-lg float-right pointer" onClick={this.props.close}>
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className="fa fa-times fa-stack-1x fa-inverse"></i>
          </span>
        </div>
        <div className="clearfix"></div>
        <div style={modalContent}>
          {this.props.children}
        </div>
      </ReactModal>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  close: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
}

Modal.defaultProps = {
  width: '400px',
  height: '230px',
}
