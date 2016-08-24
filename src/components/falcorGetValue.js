import _ from 'lodash'

import React, {PropTypes} from 'react'
import hoistStatics from 'hoist-non-react-statics'

export default (mapGetValueToProps, {pure = true} = {}) => {
  return (WrappedComponent) => {
    class Resolve extends React.Component {
      constructor(props, context) {
        super(props, context)

        this.falcor = props.falcor || context.falcor
      }

      componentWillMount() {
        const getValueToProps = _.isFunction(mapGetValueToProps) ? mapGetValueToProps(this.props) : mapGetValueToProps

        this.subscriptions = _.map(getValueToProps, (pathSet, propKey) => {
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
        this.subscriptions.forEach(({dispose}) => dispose())
      }

      render() {
        return (
          <WrappedComponent {...this.state}/>
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
