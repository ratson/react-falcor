import _ from 'lodash'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

function defaultTransformResponseToProps(response) {
  return response.json
}

export default (getPathSets, transformResponseToProps = defaultTransformResponseToProps, {pure = true} = {}) => {
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.falcor = props.falcor || context.falcor
      }

      componentWillMount() {
        const pathSets = _.isFunction(getPathSets) ? getPathSets(this.props) : getPathSets

        this.subscription = this.falcor.get(pathSets).subscribe((response) => {
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
        return (
          <WrappedComponent {...transformResponseToProps(this.state.response)}/>
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
