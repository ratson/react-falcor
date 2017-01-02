import _ from 'lodash'
import warning from 'warning'

import createHOC from '../utils/createHOC'

const defaultState = {
  loading: true,
  response: null,
}

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

function createHandler(getPathSets, mergeProps) {
  if (!mergeProps) {
    mergeProps = defaultMergeProps
  }

  let subscription = null

  function unsubscribe() {
    if (subscription) {
      subscription.dispose()
      subscription = null
    }
  }

  return {
    defaultState,
    computeProps(props, state) {
      const newProps = mergeProps(state.response, props)
      if (!newProps) {
        return null
      }
      return newProps
    },
    subscribe(falcor, props, setState) {
      const pathSets = computePathSets(props, getPathSets)
      subscription = falcor.get(...pathSets).subscribe((response) => {
        setState({
          loading: false,
          response,
        })
      })
    },
    unsubscribe,
  }
}

export default (getPathSets, mergeProps, opts) => createHOC(createHandler, opts, getPathSets, mergeProps)
