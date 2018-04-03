import React from 'react'
import { mount } from 'enzyme'

import { Provider, injectFalcorModel } from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('injectFalcorModel', () => {
  it('renders wrapped component with default `falcorModel` prop', () => {
    expect.assertions(3)
    const Mock = jest.fn(({ falcorModel }) => {
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
