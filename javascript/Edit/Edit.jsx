'use strict'
import React, { Component } from 'react'
import EditView from './EditView.jsx'
import NavBar from './NavBar.jsx'
import SlidesView from './SlidesView.jsx'
import {
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap'

export default class Edit extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 0,
      id: window.sessionStorage.getItem('id'),
      showTitle: 'Edit:',
      edit: false,
      content: [
        {
          saveContent: undefined,
          quizContent: undefined,
          isQuiz: false,
          slideIndex: 0,
          backgroundColor: '#E5E7E9'
        },
      ],
    }


    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.setCurrentSlide = this.setCurrentSlide.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
    this.addNewQuiz = this.addNewQuiz.bind(this)
    this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateTitleEdit = this.updateTitleEdit.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.saveTitle = this.saveTitle.bind(this)
    this.saveContentState = this.saveContentState.bind(this)
    this.saveQuizContent = this.saveQuizContent.bind(this)
    this.changeBackground = this.changeBackground.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state != prevState) {
      console.log(this.state.content)
    }

  }

  save() {
    let c = this.state.content[this.state.currentSlide].isQuiz ?
          /* if quiz */ this.state.content[this.state.currentSlide].quizContent :
          /* else    */ this.state.content[this.state.currentSlide].saveContent
    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      data: {
        content: c,
        id: this.state.content[this.state.currentSlide].id,
        index: this.state.content[this.state.currentSlide].slideIndex,
        isQuiz: this.state.content[this.state.currentSlide].isQuiz
      },
      type: 'put',
      dataType: 'json',
      error: (req, err) => {
        alert("Failed to save show " + window.sessionStorage.getItem('id'))
        document.write(req.responseJSON.backtrace[0].args[1].xdebug_message)
        console.error(req, err.toString());
      }
    })
  }


  load() {
    $.ajax({
      url: './slideshow/Slide/edit/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        console.log(data['slides'])
        let loaded = data['slides']
        if (loaded[0] != undefined) {
          console.log(loaded)
          window.sessionStorage.setItem('slideIndex', loaded[0].slideIndex)
          window.sessionStorage.setItem('imgUrl', loaded[0].media)
          let showContent = []
          for (let i = 0; i < loaded.length; i++) {
            let saveC = undefined
            let quizC = undefined
            let isQ = this.quizConv(loaded[i].isQuiz)
            if (!isQ) {
              saveC = loaded[i].content
            } else {
              quizC = loaded[i].content
            }
            showContent.push({
              isQuiz: isQ,
              saveContent: saveC,
              quizContent: quizC,
              backgroundColor: loaded[i].backgroundColor,
              slideIndex: Number(loaded[i].slideIndex),
              media: loaded[i].media
            })
          }

          this.setState({
            content: showContent,
            id: loaded[0].showId
          });
        }
      }.bind(this),
      error: function(req, err) {
        alert("Failed to load data.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }


  setCurrentSlide(val) {
    this.save()
    window.sessionStorage.setItem('slideIndex', val)
    this.setState({
      currentSlide: val
    })
  }


  addNewSlide(quiz) {
    if (typeof(quiz) === 'object') quiz = false // an event is bindinded on some calls which causes errors
    /* This function adds to the stack of slides held within state.content */
    const index = this.state.currentSlide + 1
    const newId = Number(this.state.content[this.state.currentSlide].slideIndex) + 1
    console.log(index + ":" + newId)
    const newSlide = {
        saveContent: undefined,
        quizContent: undefined,
        isQuiz: quiz,
        backgroundColor: '#E5E7E9',
        slideIndex: newId
    }
    let copy = [...this.state.content]
    copy.splice(index, 0, newSlide)
    this.setState({
      //currentSlide: index,
      content: copy,
    }, () => this.setCurrentSlide(index))
  }


  addNewQuiz() {
    // This method is useless, since we can change this at the call. However, previous code implemented this method seperately
    // and we can simplify this at a later time.
    this.addNewSlide(true)
  }

  deleteCurrentSlide() {
    let copy = [...this.state.content]
    let newIndex = this.state.currentSlide
    // splice one slide at the current index
    copy.splice(this.state.currentSlide, 1)
    // Current slide is the first slide and there are no other slides
    if (this.state.currentSlide === 0 && this.state.content.length == 1) {
      // set the array to an empty slide
      copy = [{saveContent: undefined}]
    }
    // If we are deleting the last slide
    if (this.state.currentSlide == copy.length) {
      newIndex = this.state.currentSlide - 1
    }

    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      type: 'delete',
      data: {index: this.state.content[this.state.currentSlide].slideIndex, type: 'slide'},
      error: (req, res) => {
        console.error(req, res.toString());
      }
    })

    this.setState({
      content: copy,
      currentSlide: newIndex
    }, /*() => this.setCurrentSlide(newIndex)*/)
  }

  updateTitle(value) {
    this.setState({showTitle: value})
  }

  updateTitleEdit(event) {
    this.setState({showTitle: event.target.value})
  }

  editTitle() {
    this.setState({edit: true})
  }

  saveTitle() {
    $.ajax({
      url: './slideshow/Show/' + window.sessionStorage.getItem('id'),
      data: {title: this.state.showTitle},
      type: 'put',
      dataType: 'json',
      success: function() {
        this.setState({edit: false})
      }.bind(this),
      error: function(req, err) {
        alert("Failed to save data.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  saveContentState(saveContent) {
    if (saveContent != undefined) {
      let c = [...this.state.content]
      c[this.state.currentSlide].saveContent = saveContent
      this.setState({content: c})
    }
  }

  saveQuizContent(quizContent) {
    let c = [...this.state.content]
    c[this.state.currentSlide].quizContent = quizContent
    this.setState({content: c})
  }

  quizConv(quizT) {
    // When we load from the data base the isQuiz boolean
    // is loaded in as a string or a number
    // We need to handle that and bring it back to a boolean
    if (quizT == undefined) return false // initial load
    if (typeof(quizT) === 'number') return (quizT != 0)
    return (typeof(quizT) === "boolean") ? quizT : JSON.parse(quizT)
  }

  changeBackground(newColor) {
    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      data: {index: this.state.currentSlide, backgroundColor: newColor},
      type: 'put',
      error: (req, res) => {
        console.error(req, res.toString())
      }
    })

    let c = [...this.state.content]
    c[this.state.currentSlide].backgroundColor = newColor
    this.setState({content: c})
  }


  render() {
    let isQuiz = this.quizConv(this.state.content[this.state.currentSlide].isQuiz)
    let cardTitle;
    if (this.state.edit) {
      cardTitle = <InputGroup>
                    <FormControl
                      style={{maxWidth: 350}}
                      value={this.state.showTitle}
                      onChange={this.updateTitleEdit}
                    />
                    <InputGroup.Append>
                      <Button variant="primary" onClick={this.saveTitle}>Save</Button>
                    </InputGroup.Append>
                  </InputGroup>
    } else {
      cardTitle = <div>
                    <u>
                    {this.state.showTitle}
                    </u>
                    <a onClick={this.editTitle} style={{paddingLeft: "10px", cursor: "pointer"}}>
                      <i className="fas fa-edit fa-sm"></i>
                    </a>
                  </div>
    }

    return (
      <div>
      <h2>{cardTitle}</h2>
        <NavBar
          id                ={Number(this.state.id)}
          insertSlide       ={this.addNewSlide}
          deleteSlide       ={this.deleteCurrentSlide}
          renameSlide       ={this.renameCurrentSlide}
          addToStack        ={this.addToStack}
          currentSlide      ={this.state.currentSlide}
          insertQuiz        ={this.addNewQuiz}
          saveDB            ={this.save}
          changeBackground  ={this.changeBackground}
          updateTitle       ={this.updateTitle}
          currentColor      ={this.state.content[this.state.currentSlide].backgroundColor}/>
        <div className="row">
          <SlidesView
            slides          ={this.state.content}
            currentSlide    ={this.state.currentSlide}
            setCurrentSlide ={this.setCurrentSlide}
            addNewSlide     ={this.addNewSlide}/>
          <EditView
            currentSlide    ={this.state.currentSlide}
            content         ={this.state.content[this.state.currentSlide]}
            isQuiz          ={isQuiz}
            deleteElement   ={this.deleteFromStack}
            saveContentState={this.saveContentState}
            saveQuizContent ={this.saveQuizContent}
            saveDB          ={this.save}
            />
        </div>
      </div>
    )
  }
}
