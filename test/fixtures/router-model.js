import delay from 'delay'

import falcor from 'falcor'
import jsong from 'falcor-json-graph'
import Router from 'falcor-router'

const source = new Router([
  {
    route: 'undefined',
    get() {
      return jsong.pathValue(['undefined'], jsong.undefined())
    },
  },
  {
    route: 'delayed',
    async get() {
      await delay(100)
      return jsong.pathValue(['delayed'], 'delayed')
    },
    call() {
      return jsong.pathValue(['delayed'], 'called')
    },
  },
  {
    route: 'called',
    call() {
      return jsong.pathValue(
        ['called'],
        jsong.atom({
          hello: 'world',
        }),
      )
    },
  },
  {
    route: 'greeting',
    get() {
      return jsong.pathValue(['greeting'], 'Hello World!')
    },
  },
])

const model = new falcor.Model({
  source,
})

export default model
