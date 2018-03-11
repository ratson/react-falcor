import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import getComponentName from 'recompose/getDisplayName'
import shallowEqual from 'recompose/shallowEqual'

import falcorShape from './falcorShape'

export default function createHOC(
  createHandler,
  {
    defer = false,
    pure = true,
    loadingComponent,
    getDisplayName = name => `Resolve(${name})`,
  } = {},
  ...args
) {
  const Loading = loadingComponent

  return WrappedComponent => {
    class Resolve extends React.Component {
      static displayName = getDisplayName(getComponentName(WrappedComponent))

      constructor(props, context) {
        super(props, context)

        this.eventEmitter = context.falcor.eventEmitter
        this.falcor = context.falcor.model

        this.handler = createHandler(...args)
        this.state = this.handler.defaultState
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
          this.setState({ loading: true }, () => {
            this.subscribe(nextProps)
          })
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.version !== this.falcor.getVersion()) {
          return true
        }
        return (
          !pure ||
          !shallowEqual(this.props, nextProps) ||
          !shallowEqual(this.state, nextState)
        )
      }

      componentWillUpdate() {
        this.version = this.falcor.getVersion()
      }

      componentWillUnmount() {
        this._unsubscribe()
        this.eventEmitter = null

        this.handler.unsubscribe()
        this.handler = null

        this.falcor = null
        this.version = null
      }

      onModelChange = () => {
        this.subscribe(this.props)
      }

      listenAndSubscribe() {
        this._unsubscribe = this.eventEmitter.on('change', this.onModelChange)
        this.subscribe(this.props)
      }

      subscribe(props) {
        if (this.falcor === null) {
          return
        }
        this.handler.unsubscribe()

        this.handler.subscribe(this.falcor, props, state => {
          // HACK avoid server-side rendering setState() no-op
          // this is happened when calling renderToString(),
          // this callback is run after component is rendered,
          // which triggering the warning
          if (
            this.updater &&
            this.updater.transaction &&
            this.updater.transaction._isInTransaction === false
          ) {
            return
          }

          this.setState(state)
        })
      }

      render() {
        if (this.state.loading) {
          return Loading ? <Loading {...this.props} /> : null
        }
        const props = this.handler.computeProps(this.props, this.state)
        if (props === null) {
          return null
        }
        return <WrappedComponent {...props} />
      }
    }

    Resolve.contextTypes = {
      falcor: falcorShape.isRequired,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
