import React, { Component } from 'react'
import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import SimpleCard from './SimpleCard'
import { translate3d } from './utils'

class DraggableCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      initialPosition: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 },
      animation: null,
      pristine: true
    }
    this.swipeThreshold = props.swipeThreshold || 200
    this.rotationThreshold = props.rotationThreshold || 20
    this.resetPosition = this.resetPosition.bind(this)
    this.handlePan = this.handlePan.bind(this)
  }

  componentDidMount() {
    this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this))
    this.hammer.add(new Hammer.Pan({ threshold: 2 }))

    this.hammer.on('panstart panend pancancel panmove', this.handlePan)
    this.hammer.on('swipestart swipeend swipecancel swipemove', this.handleSwipe)

    this.resetPosition()
    window.addEventListener('resize', this.resetPosition)
  }

  componentWillReceiveProps(props) {
    if (props.like) {
      this.onLike();
    } else if (props.dislike) {
      this.onDislike();
    } else if (props.nolike) {
      this.onNolike();
    } else if (props.nolike2) {
      this.onNolike2();
    }
  }

  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop()
      this.hammer.destroy()
      this.hammer = null
    }
    window.removeEventListener('resize', this.resetPosition)
  }


  resetPosition() {
    const initialPosition = {
      x: 0,
      y: 0
    }

    this.setState({
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: { x: 0, y: 0 }
    })
  }

  panstart() {
    const { x, y } = this.state
    this.setState({
      animation: false,
      startPosition: { x, y },
      pristine: false
    })
  }

  panend(ev) {
    const screen = this.props.containerSize
    const card = ReactDOM.findDOMNode(this)

    const getDirection = () => {
      switch (true) {
        case (ev.deltaX < -this.swipeThreshold): return 'Left'
        case (ev.deltaX > this.swipeThreshold): return 'Right'
        case (ev.deltaY < this.swipeThreshold): return 'Top'
        case (ev.deltaY > this.swipeThreshold): return 'Bottom'
          
        default: return false
      }
    }

    const direction = getDirection()

    if (this.props[`onSwipe${direction}`]) {
      if (direction === 'Right') {
        this.onLike();
      } else if (direction === 'Left') {
        this.onDislike();
      } else if (direction === 'Bottom') {
        this.onNolike();
      } else if (direction === 'Top') {
        this.onNolike2();
      }
    } else {
      this.resetPosition()
      this.setState({ animation: true })
    }
  }

  onLike() {
    this.animateCard({
      toX: this.state.initialPosition.x + 5 * this.swipeThreshold,
      duration: 100
    }, () => {
      this.props[`onSwipeRight`]()
      this.props[`onOutScreenRight`](this.props.index)
    });
  }

  onDislike() {
    this.animateCard({
      toX: this.state.initialPosition.x - 5 * this.swipeThreshold,
      duration: 100
    }, () => {
      this.props[`onSwipeLeft`]()
      this.props[`onOutScreenLeft`](this.props.index)
    });
  }
  
  onNolike() {
    this.animateCard({
      toY: this.state.initialPosition.y + 5 * this.swipeThreshold,
      duration: 100
    }, () => {
      this.props[`onSwipeBottom`]()
      this.props[`onOutScreenBottom`](this.props.index)
    });
  }
  
  onNolike2() {
    this.animateCard({
      toY: this.state.initialPosition.y - 5 * this.swipeThreshold,
      duration: 100
    }, () => {
      this.props[`onSwipeTop`]()
      this.props[`onOutScreenTop`](this.props.index)
    });
  }

  animateCard({ toX = 0, toY = 0, duration = 100 }, callback) {
    let offset = toX - this.state.x;
    let offset_Y = toY - this.state.y;
    
    let changeOffset = offset / duration;
    let changeOffset_Y = offset_Y / duration;
    

    let animation = () => {
      let { x } = this.state
      let { y } = this.state
      if ((toX < 0 && x + this.state.initialPosition.x <= toX) || (toX > 0 && x - this.state.initialPosition.x >= toX) || (toY < 0 && y + this.state.initialPosition.y <= toY) || (toY > 0 && y - this.state.initialPosition.y >= toY)) {
        callback && callback()
        clearInterval(this.interval)
      } else {
        this.setState(state => ({
          x: state.x + changeOffset,
          y: state.y + changeOffset_Y,
          
        }));
      }
    }

    this.interval = setInterval(animation, 1)
    setImmediate(animation);
  }

  panmove(ev) {
    this.setState(this.calculatePosition(ev.deltaX, ev.deltaY));
  }

  pancancel(ev) {
    console.log(ev.type)
  }

  handlePan(ev) {
    ev.preventDefault()
    this[ev.type](ev)
    return false
  }

  handleSwipe(ev) {
    console.log(ev.type)
  }

  calculatePosition(deltaX, deltaY) {
    const { initialPosition: { x, y } } = this.state
    return {
      x: (x + deltaX),
      y: (y + deltaY)
    }
  }

  render() {
    const { x, y, initialPosition, animation, pristine } = this.state
    let xOffset = x - initialPosition.x;
    let rotation = xOffset.map({
      inputRange: [-2 * this.swipeThreshold, 2 * this.swipeThreshold],
      outputRange: [-this.rotationThreshold, this.rotationThreshold],
      clamp: true
    });

    const style = {
      ...translate3d(x, y, rotation)
    };
    let movingRight = xOffset > 0;
    let overlayOpacity = Math.abs(xOffset).map({
      inputRange: [0, this.swipeThreshold],
      outputRange: [0, 1],
      clamp: true
    });

    let { likeOverlay, dislikeOverlay, nolikeOverlay, nolike2Overlay, ...restProps } = this.props;

    return (
      <SimpleCard
        {...restProps}
        style={style}
        className={animation ? 'animate' : pristine ? 'inactive' : ''}
        overlay={
          <div style={{ opacity: overlayOpacity }}>
            {movingRight ?
              likeOverlay
              :
              dislikeOverlay
            }
          </div>
        }
      />
    );
  }
}

export default DraggableCard
