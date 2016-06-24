import invariant from 'invariant'

import dropRight from 'lodash/dropRight'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import last from 'lodash/last'
import reduce from 'lodash/reduce'

import { resolve } from 'react-resolver'
import hoistStatics from 'hoist-non-react-statics'
import React, { PropTypes } from 'react'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const injectFalcor = (WrappedComponent) => {
  const displayName = `Falcor(${getDisplayName(WrappedComponent)})`

  const Connect = (props, context) => {
    const falcor = props.falcor || context.falcor

    invariant(falcor,
      `Could not find "falcor" in either the context or ` +
      `props of "${displayName}". ` +
      `Either wrap the root component in a <Provider>, ` +
      `or explicitly pass "falcor" as a prop to "${displayName}".`
    )

    return (<WrappedComponent falcor={falcor} {...props} />)
  }
  Connect.displayName = displayName
  Connect.WrappedComponent = WrappedComponent
  Connect.propsTypes = {
    falcor: PropTypes.object,
  }
  Connect.contextTypes = {
    falcor: PropTypes.object,
  }
  return hoistStatics(Connect, WrappedComponent)
}

const reducePathSet = (r, pathSetOrFunction, prop) => {
  r[prop] = ({falcor, ...ownProps}) => {
    const pathSet = isFunction(pathSetOrFunction) ? pathSetOrFunction(ownProps) : pathSetOrFunction
    if (isArray(pathSet)) {
      if (isArray(last(pathSet))) {
        return falcor.get(pathSet).then(res => get(res, ['json', ...dropRight(pathSet)]))
      }
      return falcor.getValue(pathSet)
    }
    return pathSet
  }
  return r
}

export default function connect(pathSets, options = {}) {
  return function wrapWithConnect(WrappedComponent) {
    const asyncProps = reduce(pathSets, reducePathSet, {})
    return injectFalcor(resolve(asyncProps)(WrappedComponent))
  }
}
