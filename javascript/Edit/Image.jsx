import React, { Component } from 'react'

export default class Image extends Component {
  constructor() {
    super()
    this.state = {
      focus: false
    }

    this.focus = () => {
      this.setState({focus: !this.state.focus})
    }
  }


  render() {
    let imgC = document.getElementById('img')
    let width = 0;
    let height = 0;
    if (imgC != null) {
      width = imgC.width
      height = imgC.height
      //this.props.showImage()
    }

    let defaultStyle = {
    height: `${height}px`,
    width: `${width}px`,
    margin: '1rem',
    padding: '3px',

  }

  let focusStyle = {
    height: `${height}px`,
    width: `${width}px`,
    border: '3px solid green',
    margin: '1rem',
  }

  return (
    <div onClick={this.focus} style={(this.state.focus) ? (focusStyle) : (defaultStyle)}>
      <img id="img" src={this.props.src}></img>
    </div>
  )
}
}
