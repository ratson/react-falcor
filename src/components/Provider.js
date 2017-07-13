import _ from 'lodash'
import EventEmitter from 'eventemitter3'
import invariant from 'invariant'

import React from 'react'
import { PropTypes } from 'prop-types'

import falcorShape from '../utils/falcorShape'

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context)

    const { falcor } = props
    invariant(props, '"falcor" is not provided')

    const eventEmitter = new EventEmitter()

    const originalCallback = falcor._root.onChange || _.noop
    falcor._root.onChange = () => {
      originalCallback()
      eventEmitter.emit('change', falcor.getVersion())
    }

    this.falcor = {
      model: falcor,
      eventEmitter,
    }
  }

  getChildContext() {
    return {
      falcor: this.falcor,
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  cleanup() {
    this.falcor = null
  }

  render() {
    const { children } = this.props
    return React.Children.only(children)
  }
}

Provider.propTypes = {
  falcor: PropTypes.shape({
    _root: PropTypes.shape({
      onChange: PropTypes.func,
    }).isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
}
Provider.childContextTypes = {
  falcor: falcorShape.isRequired,
}

export default Provider
