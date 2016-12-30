import React from 'react'
import {mount} from 'enzyme'

import {Provider, injectFalcorModel} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('injectFalcorModel', () => {
  it('render wrapped component with `falcorModel` prop', () => {
    const Mock = jest.fn(({falcorModel}) => {
      expect(falcorModel).toBe(model)
      return <Foo />
    })
    const Bar = injectFalcorModel(Mock)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar />
      </Provider>
    )

    const wrapper = mount(<FooBar />)
    expect(Mock).toBeCalled()
    expect(wrapper.find(Foo).length).toBe(1)
  })
})
