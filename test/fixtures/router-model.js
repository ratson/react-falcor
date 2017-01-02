import delay from 'timeout-as-promise'

import falcor from 'falcor'
import jsong from 'falcor-json-graph'
import Router from 'falcor-router'

const source = new Router([{
  route: 'undefined',
  get() {
    return jsong.pathValue(['undefined'], jsong.undefined())
  },
}, {
  route: 'delayed',
  get() {
    return delay(100).then(() => jsong.pathValue(['delayed'], 'delayed'))
  },
}])

const model = new falcor.Model({
  source,
})

export default model
