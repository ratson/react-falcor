import _ from 'lodash'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function defaultMergeProps({json} = {}, ownProps) {
  return {
    ...ownProps,
    ...json,
  }
}

export default (getPathSets, mergeProps = defaultMergeProps, {pure = true} = {}) => {
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.eventEmitter = context.falcorEventEmitter
        this.eventEmitter.on('change', this.onModelChange)

        this.falcor = context.falcor
      }

      componentWillMount() {
        this.subscribe()
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.version !== this.falcor.getVersion()) {
          return true
        }
        return !pure || !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
      }

      componentWillUpdate() {
        this.version = this.falcor.getVersion()
      }

      componentWillUnmount() {
        this.cleanup()
      }

      onModelChange = () => {
        this.subscribe()
      }

      subscribe() {
        this.tryUnsubscribe()

        const pathSets = _.isFunction(getPathSets) ? getPathSets(this.props) : getPathSets

        this.subscription = this.falcor.get(...pathSets).subscribe((response) => {
          this.setState({
            response,
          })
        })
      }

      tryUnsubscribe() {
        if (this.subscription) {
          this.subscription.dispose()
          this.subscription = null
        }
      }

      cleanup() {
        this.eventEmitter.removeListener('change', this.onModelChange)
        this.eventEmitter = null

        this.tryUnsubscribe()
        this.falcor = null
        this.version = null
      }

      render() {
        // TODO provide option to override this
        if (this.state === null) {
          return null
        }
        return (
          <WrappedComponent {...mergeProps(this.state.response, this.props)}/>
        )
      }
    }

    Resolve.contextTypes = {
      falcor: PropTypes.object.isRequired,
      falcorEventEmitter: PropTypes.object.isRequired,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
