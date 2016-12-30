import _ from 'lodash'
import warning from 'warning'

import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import shallowEqual from 'recompose/shallowEqual'

import falcorShape from '../utils/falcorShape'

function computePathSetToProps(props, mapPathSetToProps) {
  const pathSetToProps = _.isFunction(mapPathSetToProps) ? mapPathSetToProps(props) : mapPathSetToProps
  warning(typeof pathSetToProps !== 'undefined', '"pathSetToProps" is undefined')
  return pathSetToProps || {}
}

export default (mapPathSetToProps, {defer = false, pure = true, loadingComponent} = {}) => {
  const Loading = loadingComponent
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.eventEmitter = context.falcor.eventEmitter
        this.falcor = context.falcor.model

        this.state = {
          loading: true,
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
        if (this.falcor === null) {
          return
        }
        this.tryUnsubscribe()

        const pathSetToProps = computePathSetToProps(props, mapPathSetToProps)
        const propKeys = Object.keys(pathSetToProps)
        this.subscriptions = propKeys
        .map((prop) => {
          const pathSet = pathSetToProps[prop]
          return this.falcor.getValue(pathSet).subscribe((value) => {
            this.resolved[prop] = value
            this.resolvedCount += 1

            if (this.resolvedCount === propKeys.length) {
              // HACK avoid server-side rendering setState() no-op
              // this is happened when calling renderToString(),
              // this callback is run after component is rendered,
              // which triggering the warning
              if (this.updater && this.updater.transaction && this.updater.transaction._isInTransaction === false) {
                return
              }

              this.setState({
                loading: false,
              })
            }
          })
        })
      }

      tryUnsubscribe() {
        if (!this.subscriptions) {
          this.subscriptions = []
        }
        if (this.subscriptions.length > 0) {
          this.subscriptions.forEach(x => x.dispose())
          this.subscriptions = []
        }
        this.resolved = {}
        this.resolvedCount = 0
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
          return Loading ? <Loading {...this.props} /> : null
        }
        return (
          <WrappedComponent {...this.props} {...this.resolved} />
        )
      }
    }

    Resolve.contextTypes = {
      falcor: falcorShape.isRequired,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
