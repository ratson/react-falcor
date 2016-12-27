import React from 'react'
import {mount} from 'enzyme'

import {Provider, withFalcor} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('withFalcor', () => {
  it('render wrapped component with `falcor` prop', () => {
    const Mock = jest.fn(({falcor}) => {
      expect(falcor.model).toBe(model)
      return <Foo/>
    })
    const Bar = withFalcor()(Mock)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    expect(Mock).toBeCalled()
    expect(wrapper.find(Foo).length).toBe(1)
  })

  it('can rename `falcor` prop', () => {
    const Mock = jest.fn(({awesome, falcor}) => {
      expect(falcor).toBeUndefined()
      expect(awesome.model).toBe(model)
      return <Foo/>
    })
    const Bar = withFalcor({
      prop: 'awesome',
    })(Mock)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    expect(Mock).toBeCalled()
    expect(wrapper.find(Foo).length).toBe(1)
  })
})
