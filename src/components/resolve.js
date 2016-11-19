import _ from 'lodash'
import warning from 'warning'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function mergeProps(props, nextProps) {
  return {
    ...props,
    ...nextProps,
  }
}

function getInitialState() {
  return {
    version: 0,
    nextProps: {},
  }
}

export default (mapFalcorToProps, {pure = true} = {}) => {
  return WrappedComponent => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.falcor = props.falcor || context.falcor.model
        this.state = getInitialState(props)

        this._counter = 0
        this._cancelPromise = false
      }

      componentDidMount() {
        this.mapAsyncDataToProps()
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !pure || !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
      }

      componentWillUnmount() {
        this._cancelPromise = true
      }

      mapAsyncDataToProps(props = this.props) {
        const counter = ++this._counter

        Promise.resolve(mapFalcorToProps(this.falcor, props)).then(nextProps => {
          // resolve to nothing when cancelled or has pending resolve
          if (this._cancelPromise || counter !== this._counter) {
            return
          }

          this.setState({
            version: this.falcor.getVersion(),
            nextProps,
          })
        })
      }

      render() {
        return <WrappedComponent {...mergeProps(this.props, this.state.nextProps)}/>
      }
    }

    Resolve.contextTypes = {
      falcor: PropTypes.object,
    }
    Resolve.propTypes = {
      falcor: PropTypes.object,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
