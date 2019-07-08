'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, AtomicBlckUtils} from 'draft-js'

import { Popover, Overlay } from 'react-bootstrap'

import Dropzone from 'react-dropzone-uploader'

export default class CustomToolbarButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showUpload: false,
      file: null
    }

    this.attachRef = target  => this.setState({target})

    this.handleImage = this.handleImageUpload.bind(this)
    this.handleChange = this.handleFileChange.bind(this)
  }

  componentDidMount() {
    console.log(this.props)
  }

  insertImage() {
    //console.log(this.props)
    alert("Insert Image:\n\nnot yet implemented")
  }

  handleImageUpload(fileWithMeta) {
    // This should only run once, but it's here for when we upload more than one file.
    //console.log(fileWithMeta)
    fileWithMeta.map((fMeta) => {
      // Request to save new image
      const meta = fMeta.meta

      let formData = new FormData()
      formData.append('file', fMeta.file)
      formData.append('showId', Number(window.sessionStorage.getItem('id')))
      formData.append('index', Number(window.sessionStorage.getItem('index')))
      formData.append('title', meta.name)
      formData.append('width', meta.width)
      formData.append('height', meta.height)
      formData.append('type', meta.type)
      $.ajax({
        url: './slideshow/Image/',
        data: formData,
        processData: false,
        contentType: false,
        type: 'post',
        success: () => {
          window.sessionStorage.setItem('img', meta.name)
          // Need to find a way around this
          document.location.reload()
        },
        error: (req, res) => {
          console.error(req, res.toString())
        }
      })
    })
    this.setState({showUpload: false})
  }

  handleFileChange(fileWithMeta, status) {
    let fileObject = fileWithMeta.file
    //console.log(fileObject)
    let file = {
      'lastModified'     : fileObject.lastModified,
      'lastModifiedDate' : fileObject.lastModifiedDate,
      'name'             : fileObject.name,
      'size'             : fileObject.size,
      'type'             : fileObject.type
    }
    this.setState({file: file})
  }

  render() {

    let preview = ({meta}) => {
      return (<div key="1"><p>{meta.name} </p><div className="spinner-border text-primary"></div><span className="spinner-border spinner-border-sm"></span></div>)
    }

    return (
      <span>
          <button className="toolbar" ref={this.attachRef} onClick={() => this.setState({showUpload: !this.state.showUpload})}><i className="fas fa-images"></i></button>
          <Overlay target={this.state.target} show={this.state.showUpload} placement="bottom" container={this}>
            <Popover id="imageUpload" title="Insert Image">
              <Dropzone
                accept="image/jpeg,image/png"
                maxFiles={1}
                multiple={false}
                canCancel={true}
                minSizeBytes={1024}
                maxSizeBytes={18388608}
                onSubmit={this.handleImage}
                inputContent={'Drag Image or Click to Browse'}
                submitButtonContent={'Insert'}
                onChangeStatus={this.handleChange}
                PreviewComponent={preview}
                classNames={{submitButton: 'btn btn-secondary btn-block', dropzone: 'alert alert-info'}}
                />
            </Popover>
          </Overlay>
      </span>
    )
  }
}
