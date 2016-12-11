import _ from 'lodash'
import warning from 'warning'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function defaultMergeProps(response, ownProps) {
  const {json} = response || {}
  return {
    ...ownProps,
    ...json,
  }
}

export default (getPathSets, mergeProps, {defer = false, pure = true, loadingComponent} = {}) => {
  if (!mergeProps) {
    mergeProps = defaultMergeProps
  }
  const Loading = loadingComponent
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.eventEmitter = context.falcor.eventEmitter
        this.falcor = context.falcor.model

        this.state = {
          loading: true,
          response: null,
        }
      }

      componentWillMount() {
        if (!defer) {
          this.listenAndSubscribe()
        }
      }

      componentDidMount() {
        if (defer) {
          this.listenAndSubscribe()
        }
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

      listenAndSubscribe() {
        this.eventEmitter.on('change', this.onModelChange)
        this.subscribe(this.props)
      }

      computePathSets(props) {
        const pathSets = _.isFunction(getPathSets) ? getPathSets(props) : getPathSets
        warning(typeof pathSets !== 'undefined', '"pathSets" is undefined')
        return pathSets || []
      }

      subscribe(props) {
        this.tryUnsubscribe()

        const pathSets = this.computePathSets(props)
        this.subscription = this.falcor.get(...pathSets).subscribe((response) => {
          // HACK avoid server-side rendering setState() no-op
          // this is happened when calling renderToString(),
          // this callback is run after component is rendered,
          // which triggering the warning
          if (this.updater && this.updater.transaction && this.updater.transaction._isInTransaction === false) {
            return
          }

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
        if (this.state.loading) {
          return Loading ? <Loading {...this.props}/> : null
        }
        const props = mergeProps(this.state.response, this.props)
        if (!props) {
          return null
        }
        return (
          <WrappedComponent {...props}/>
        )
      }
    }

    Resolve.contextTypes = {
      falcor: PropTypes.object.isRequired,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
