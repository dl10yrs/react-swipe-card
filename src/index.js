import Cards from './Cards'

export { default as Card } from './CardSwitcher'

Number.prototype.map = function ({ inputRange: [iMin, iMax], outputRange: [oMin, oMax], clamp = false }) {
    let finalValue = (this.valueOf() - iMin) / (iMax - iMin) * (oMax - oMin) + oMin;
    if (clamp) {
        if (finalValue > oMax) {
            return oMax
        } else if (finalValue < oMin) {
            return oMin
        }
    }
    return finalValue;
}

export default Cards
