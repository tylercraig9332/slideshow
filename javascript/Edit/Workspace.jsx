'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './custom.css'

import Editor, { createEditorStateWithText, createWithContent } from 'draft-js-plugins-editor'
import {EditorState, getDefaultKeyBinding, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons'


const {hasCommandModifier} = KeyBindingUtil

export default class Workspace extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      content: {
        // title: props.content['title'],
        saveContent: props.content.saveContent
      }
    }
    this.onEditChange = (editorState) =>  {
      this.saveEditorState()
      this.setState({editorState})
    }

    this.loadEditorState = this.loadEditorState.bind(this)
    this.fetchContent = this.fetchContent.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.saveKeyBindingFn = this.saveKeyBindingFn.bind(this)
    this.deleteElement = this.deleteElement.bind(this)
  }

  componentDidMount() {
    this.loadEditorState(this.props.content)
  }

  componentDidUpdate(prevProps) {
    if (this.props.content != undefined) {
      console.log("componentDidUpdate:")
      console.log(this.props.content.saveContent)
      console.log(prevProps.content.saveContent)
      if (prevProps.content != this.props.content || prevProps.currentSlide !== this.props.currentSlide) {
        this.fetchContent(this.props.content)
      }
    }
  }

  loadEditorState(content) {
    if (content.saveContent == undefined || content.saveContent == null) {

      let body = ""
      switch (content.type) {
        case 'Title':
          body = "Please click me to enter a TITLE."
          break;
        case 'Textbox':
          body = "Please click me to enter BODY TEXT."
          break;
        case 'Image':
          body = "PLACEHOLDER FOR AN IMAGE"
          break;
        case 'Quiz':
          body = "PLACEHOLDER FRO A QUIZ"
          break;
        default:
          body = "Insert text here."
      }
      this.setState({
         editorState: createEditorStateWithText(body)
       })
    } else {
      console.log("Loaded Content:")
      console.log(content.saveContent)
      //console.log(JSON.parse(content.saveContent))
      //console.log(convertFromRaw(JSON.parse(content.saveContent)))
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(content.saveContent)))
      })

    }
  }

  saveEditorState() {
    const contentState = convertToRaw(this.state.editorState.getCurrentContent())
    this.setState({saveContent: contentState})
    this.props.saveContentState(JSON.stringify(contentState))
  }

  fetchContent(data) {
    this.setState({
      activeIndex: data.currentSlide,
      content: {
        // title: content.title
        body: data.content.body,
        saveContent: data.content.saveContent
      }
    })
    this.loadEditorState(data.content)
  }

  saveKeyBindingFn(e) {
    // This function will handle a "ctrl-s" as a save
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return 'save'
    }
    return getDefaultKeyBinding(e)
  }

  handleKeyCommand(command) {
    // This will handle other key comamnds such as "ctrl-z"
    if (command === 'save') {
      // perform a save whether this may be a function call or something idk.
      this.saveEditorState()
      alert("content saved!")
      return 'handled'
    }
    return 'not-handled'
  }

  _undo()
  {
    // This is here but it is not yet implemented
    // I will add this to a button on the nav bar at some point
    this.onEditChange(EditorState.undo(EditorState))
  }

  _redo()
  {
    this.onEditChange(EditorState.redo(EditorState))
  }

  deleteElement() {
    this.props.deleteElement(this.props.content)
  }

  render() {
    var editorStyle = {
      padding: '5px',
      border: '1px solid grey',
      borderRadius: '5px'
    }

    return (
      <div>
        <div style={this.state.hasFocus ? editorStyle : {}}>
          <div className="row no-gutters">
            <div className="cust-col-11">
              <Editor
                editorState={this.state.editorState}
                onChange={this.onEditChange}
                plugins={this.props.plugins}
                handleKeyCommand={this.handleKeyCommand}
                keyBindingFn={this.saveKeyBindingFn}
                onFocus={() => this.setState({ hasFocus: true })}
                onBlur={() => this.setState({ hasFocus: false })}
                ref={(element) => { this.editor = element; }} />
            </div>
            <div className="cust-col-1">
              <a className="close" aria-label="Close" onClick={this.deleteElement}>
                <span aria-hidden="true">&times;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

Workspace.propTypes = {
  save: PropTypes.func
}
