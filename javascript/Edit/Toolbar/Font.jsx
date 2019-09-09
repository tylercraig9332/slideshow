'use strict'
import React, { useState, useEffect } from 'react'
import { Modifier, EditorState, RichUtils } from 'draft-js'
import './buttonStyle.css'
import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'

export default function Font(props) {

  const [font, setFont] = useState(12)
  const [drop, setDrop] = useState(false)

  useEffect((style) => {
    console.log(style)
    const estate = props.getEditorState()
    const cstate = estate.getCurrentContent()
    const sstate = estate.getSelection()

    // Remove all font types currently applied
    const next_cstate = estate.getCurrentInlineStyle().reduce((contentState, style) => {
      if (style.startsWith('font')) return Modifier.removeInlineStyle(contentState, sstate, style)
    }, cstate)
    let next_estate = EditorState.push(estate, next_cstate, 'change-inline-style')

    props.setEditorState(RichUtils.toggleInlineStyle(next_estate, `font-${font}`))

  }, [font])

  const dropContent = <div style={{width: 220}}>{[8,10,12,14,16,18,20,22,24,30,32,48].map((val) => { 
    return <span key={val}><button className="toolbar" onClick={() => setFont(val)}><strong>{val}</strong></button></span>
    })}</div>

  return (
    <span>
      <Tippy content={dropContent} interactive={true} placement="bottom" theme="light-border" arrow={true}>
        <Tippy content={<div>Change Font Size</div>} arrow={true} >
          <button className="toolbar" onClick={() => setDrop(true)} onBlur={() => setDrop(false)}><strong>{font}</strong></button>
        </Tippy>
      </Tippy>
    </span>
  )
}