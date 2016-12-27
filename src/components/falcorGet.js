import _ from 'lodash'
import warning from 'warning'

import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import shallowEqual from 'recompose/shallowEqual'

import falcorShape from '../utils/falcorShape'

export function defaultMergeProps(response, ownProps) {
  const {json} = response || {}
  return {
    ...ownProps,
    ...json,
  }
}

function computePathSets(props, getPathSets) {
  const pathSets = _.isFunction(getPathSets) ? getPathSets(props) : getPathSets
  warning(typeof pathSets !== 'undefined', '"pathSets" is undefined')
  return pathSets || []
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

      componentWillReceiveProps(nextProps) {
        if (!pure || !shallowEqual(nextProps, this.props)) {
          this.subscribe(nextProps)
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.version !== this.falcor.getVersion()) {
          return true
        }
        return !pure || !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
      }

      componentWillUpdate() {
        this.version = this.falcor.getVersion()
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

      subscribe(props) {
        this.tryUnsubscribe()

        const pathSets = computePathSets(props, getPathSets)
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
      falcor: falcorShape.isRequired,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
