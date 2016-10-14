import _ from 'lodash'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function defaultMergeProps({json} = {}, ownProps) {
  return {
    ...ownProps,
    ...json,
  }
}

export default (getPathSets, mergeProps = defaultMergeProps, {defer = true, pure = true, loadingComponent} = {}) => {
  const Loading = loadingComponent
  return WrappedComponent => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.eventEmitter = context.falcorEventEmitter
        this.falcor = context.falcor

        this.state = {
          loading: true,
          response: null,
        }
      }

      componentWillMount() {
        this.eventEmitter.on('change', this.onModelChange)

        this.subscribe(this.props)
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.version !== this.falcor.getVersion()) {
          return true
        }
        return !pure || !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
      }

      componentWillUpdate(nextProps, nextState) {
        this.version = this.falcor.getVersion()
      }

      componentWillReceiveProps(nextProps) {
        if (!pure || !_.isEqual(nextProps, this.props)) {
          this.subscribe(nextProps)
        }
      }

      componentWillUnmount() {
        this.cleanup()
      }

      onModelChange = () => {
        this.subscribe(this.props)
      }

      subscribe(props) {
        this.tryUnsubscribe()

        const pathSets = _.isFunction(getPathSets) ? getPathSets(props) : getPathSets

        this.subscription = this.falcor.get(...pathSets).subscribe((response) => {
          this.setState({
            loading: false,
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
        if (defer && this.state.loading) {
          return Loading ? <Loading {...this.props} /> : null
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
