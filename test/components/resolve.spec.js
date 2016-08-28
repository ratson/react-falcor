import 'should'
import delay from 'timeout-as-promise'
import React from 'react'
import {mount, shallow} from 'enzyme'

import {Provider, resolve} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('resolve', () => {
  const Bar = resolve((falcor) => falcor.getValue(['greeting']).then((greeting) => ({
    greeting,
  })))(Foo)
  const FooBar = () => (
    <Provider falcor={model}>
      <Bar/>
    </Provider>
  )

  describe('FooBar', () => {
    it('render empty tag', () => {
      const wrapper = shallow(<FooBar/>)
      wrapper.html().should.be.exactly('<div></div>')
    })

    it('render greeting', () => {
      const wrapper = mount(<FooBar/>)
      wrapper.html().should.be.exactly('<div></div>')

      return delay().then(() => {
        wrapper.html().should.be.exactly('<div>Hello World!</div>')
      })
    })
  })
})
