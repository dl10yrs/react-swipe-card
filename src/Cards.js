import React, { Component, cloneElement } from 'react'
import ReactDOM from 'react-dom'
import { DIRECTIONS } from './utils'

class SwipeCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      like: false,
      dislike: false,
      nolike: false,
      nolike2: false,
      alertLeft: false,
      alertRight: false,
      alertTop: false,
      alertBottom: false,
      index: 0,
      containerSize: { x: 0, y: 0 }
    }
    this.removeCard = this.removeCard.bind(this)
  }
  removeCard() {
    const { children, onEnd } = this.props

    if (children.length === (this.state.index + 1) && onEnd) onEnd()
    
    setTimeout(() => this.setState({ [`alert${side}`]: false }), 300)

    this.setState({
      like: false,
      dislike: false,
      nolike: false,
      nolike2: false,
    })
    this.setState({
      index: this.state.index + 1,
      [`alert${side}`]: true
    })
  }

  like() {
    if (!this.state.like && !this.state.dislike && !this.state.nolike && !this.state.nolike2) {
      this.setState({
        like: true
      });
    }
  }

  dislike() {
    if (!this.state.like && !this.state.dislike && !this.state.nolike && !this.state.nolike2) {
      this.setState({
        dislike: true
      });
    }
  }
  
  nolike() {
    if (!this.state.like && !this.state.dislike && !this.state.nolike && !this.state.nolike2) {
      this.setState({
        nolike: true
      });
    }
  }
  
  nolike2() {
    if (!this.state.like && !this.state.dislike && !this.state.nolike && !this.state.nolike2) {
      this.setState({
        nolike2: true
      });
    }
  }  

  render() {
    const { like, dislike, index, nolike, nolike2 } = this.state
    const { children, className, likeOverlay, dislikeOverlay, nolikeOverlay, nolike2Overlay } = this.props

    const _cards = children.reduce((memo, c, i) => {
      if (index > i) return memo
      const props = {
        key: i,
        index: children.length - index,
        ...DIRECTIONS.reduce((m, d) =>
          ({ ...m, [`onOutScreen${d}`]: () => this.removeCard() }), {}),
        active: index === i,
        like,
        dislike,
        likeOverlay,
        dislikeOverlay,
        nolikeOverlay.
        nolike2Overlay
      }
      return [cloneElement(c, props), ...memo]
    }, [])

    return (
      <div className={className}>
        {DIRECTIONS.map(d => 
          <div key={d} className={`${this.state[`alert${d}`] ? 'alert-visible': ''} alert-${d.toLowerCase()} alert`}>
            {this.props[`alert${d}`]}
          </div>
        )}
        <div id='cards'>
          {_cards}
        </div>
      </div>
    )
  }
}

export default SwipeCards
