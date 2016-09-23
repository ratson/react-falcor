import 'should'

import React from 'react'
import {shallow} from 'enzyme'

import {Provider, withFalcor} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('withFalcor', () => {
  it('render wrapped component with `falcor` prop', () => {
    const Bar = withFalcor(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.prop('falcor').should.be.exactly(model)
  })
})
