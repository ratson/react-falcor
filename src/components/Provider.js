import _ from 'lodash'
import EventEmitter from 'eventemitter3'
import invariant from 'invariant'

import React, {PropTypes} from 'react'

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context)

    const {falcor} = props
    invariant(props, `"falcor" is not provided`)

    const eventEmitter = new EventEmitter()

    const originalCallback = falcor._root.onChange || _.noop
    falcor._root.onChange = () => {
      originalCallback()
      eventEmitter.emit('change', falcor.getVersion())
    }

    this.eventEmitter = eventEmitter
    this.falcor = falcor
  }

  componentWillUnmount() {
    this.cleanup()
  }

  getChildContext() {
    return {
      falcor: this.falcor,
      falcorEventEmitter: this.eventEmitter,
    }
  }

  cleanup() {
    this.eventEmitter = null
    this.falcor = null
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
  falcorEventEmitter: PropTypes.object.isRequired,
}

export default Provider
