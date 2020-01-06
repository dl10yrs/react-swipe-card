
export const translate3d = (x, y, rotation = 0) => {
  const translate = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rotation}deg)`
  return {
    msTransform: translate,
    WebkitTransform: translate,
    transform: translate
  }
}

export const DIRECTIONS = ['Right', 'Left', 'Bottom', 'Top']
