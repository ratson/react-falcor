import _ from 'lodash'
import warning from 'warning'

import createHOC from '../utils/createHOC'

const defaultState = {
  loading: true,
  response: null,
}

export function defaultMergeProps(response, ownProps) {
  const { json } = response || {}
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
  const mergePropsFn = mergeProps || defaultMergeProps

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
      const newProps = mergePropsFn(state.response, props)
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
      subscription = falcor.get(...pathSets).subscribe(
        response => {
          hasResponse = _.size(_.get(response, 'json')) > 0
          setState({
            loading: false,
            response,
          })
        },
        () => {},
        () => {
          if (!hasResponse) {
            setState({
              loading: false,
              response: {},
            })
          }
        },
      )
    },
    unsubscribe,
  }
}

export default (getPathSets, mergeProps, opts) =>
  createHOC(
    createHandler,
    {
      getDisplayName: name => `falcorGet(${name})`,
      ...opts,
    },
    getPathSets,
    mergeProps,
  )
