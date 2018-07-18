const DEFAULT_BG_COLOR = '#EEEEEE'

export default {
  backgroundImage (src) {
    const hasSrc = src && src.trim().length
    if (!hasSrc) {
      return DEFAULT_BG_COLOR
    }
    return {
      background: `url(${src}) no-repeat center center / cover`
    }
  }
}
