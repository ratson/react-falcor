import _ from 'lodash'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function defaultMergeProps(state, ownProps) {
  return {
    ...ownProps,
    ...state,
  }
}

export default (mapPathSetsToProps, mergeProps = defaultMergeProps, {pure = true} = {}) => {
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.falcor = props.falcor || context.falcor
      }

      componentWillMount() {
        const pathSetsToProps = _.isFunction(mapPathSetsToProps) ? mapPathSetsToProps(this.props) : mapPathSetsToProps

        this.subscriptions = _.map(pathSetsToProps, (pathSet, propKey) => {
          return this.falcor.getValue(pathSet).subscribe((value) => {
            this.setState({
              [propKey]: value,
            })
          })
        })
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !pure || !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
      }

      componentWillUnmount() {
        this.subscriptions.forEach((subscription) => {
          subscription.dispose()
        })
      }

      render() {
        if (this.state === null) {
          return null
        }
        return (
          <WrappedComponent {...mergeProps(this.state)}/>
        )
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
