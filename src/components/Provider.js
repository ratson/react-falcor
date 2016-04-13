import invariant from 'invariant'

import React, { PropTypes } from 'react'

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context)

    invariant(props.falcor, `"falcor" is not provided`)

    this.falcor = props.falcor
  }

  getChildContext() {
    return { falcor: this.falcor }
  }

  render() {
    const { children } = this.props
    return React.Children.only(children)
  }
}

Provider.propTypes = {
  falcor: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}
Provider.childContextTypes = {
  falcor: PropTypes.object.isRequired,
}

export default Provider
