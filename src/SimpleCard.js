import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { translate3d } from './utils'

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = { initialPosition: { x: 0, y: 0 } }
  }

  render() {
    const { initialPosition: { x, y } } = this.state
    const { className = 'inactive', overlay } = this.props
    var style = {
      ...translate3d(x, y),
      zIndex: this.props.index,
      ...this.props.style,
    }

    return (
      <div style={{ ...style }} className={`card ${className}`}>
        {this.props.children}
        {overlay &&
          <div style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {overlay}
          </div>
        }
      </div>
    )
  }
}

export default Card
