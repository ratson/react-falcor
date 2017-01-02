import _ from 'lodash'
import warning from 'warning'

import createHOC from '../utils/createHOC'

const defaultState = {
  loading: true,
  response: null,
}

const NO_RESPONSE = {}

export function defaultMergeProps(response, ownProps) {
  if (response === NO_RESPONSE) {
    return null
  }
  const {json} = response || {}
  return {
    ...ownProps,
    ...json,
  }
}

function computePathSets(props, getPathSets) {
  const pathSets = _.isFunction(getPathSets) ? getPathSets(props) : getPathSets
  warning(typeof pathSets !== 'undefined', '"pathSets" is undefined')
  if (pathSets === null) {
    return null
  }
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
      if (pathSets === null) {
        setState({
          loading: false,
        })
        return
      }
      let hasResponse = false
      subscription = falcor.get(...pathSets).subscribe((response) => {
        hasResponse = true
        setState({
          loading: false,
          response,
        })
      }, () => {
      }, () => {
        if (!hasResponse) {
          setState({
            loading: false,
            response: NO_RESPONSE,
          })
        }
      })
    },
    unsubscribe,
  }
}

export default (getPathSets, mergeProps, opts) => createHOC(createHandler, opts, getPathSets, mergeProps)
