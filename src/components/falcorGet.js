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

        this.falcor = props.falcor || context.falcor
      }

      componentWillMount() {
        const pathSets = _.isFunction(getPathSets) ? getPathSets(this.props) : getPathSets

        this.subscription = this.falcor.get(...pathSets).subscribe((response) => {
          this.setState({
            response,
          })
        })
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !pure || !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
      }

      componentWillUnmount() {
        this.subscription.dispose()
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
      falcor: PropTypes.object,
    }
    Resolve.propTypes = {
      falcor: PropTypes.object,
    }

    return hoistStatics(Resolve, WrappedComponent)
  }
}
