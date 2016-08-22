import _ from 'lodash'
import invariant from 'invariant'

import React, {PropTypes} from 'react'

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context)

    const {falcor} = props
    invariant(props, `"falcor" is not provided`)

    const originalCallback = falcor._root.onChange || _.noop
    falcor._root.onChange = () => {
      originalCallback()
      this.forceUpdate()
    }

    this.falcor = falcor
  }

  getChildContext() {
    return {falcor: this.falcor}
  }

  render() {
    const {children} = this.props
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
