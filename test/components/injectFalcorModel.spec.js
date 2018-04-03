import React from 'react'
import { mount } from 'enzyme'
import { getDisplayName } from 'recompose'

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
    const Bar = injectFalcorModel()(Mock)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar />
      </Provider>
    )

    const wrapper = mount(<FooBar />)
    expect(Mock).toBeCalled()
    expect(wrapper.find(Foo).length).toBe(1)
  })

  it('renders wrapped component with custom named model prop', () => {
    expect.assertions(3)
    const Mock = jest.fn(({ falcor }) => {
      expect(falcor).toBe(model)
      return <Foo />
    })
    const Bar = injectFalcorModel({ prop: 'falcor' })(Mock)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar />
      </Provider>
    )

    const wrapper = mount(<FooBar />)
    expect(Mock).toBeCalled()
    expect(wrapper.find(Foo).length).toBe(1)
  })

  it('correctly sets displayName with default buildDisplayName', () => {
    const Mock = jest.fn(() => <Foo />)
    const Bar = injectFalcorModel()(Mock)
    expect(Bar.displayName).toBe(`injectFalcorModel(${getDisplayName(Mock)})`)
  })

  it('correctly sets displayName with custom buildDisplayName', () => {
    const Mock = jest.fn(() => <Foo />)
    const Bar = injectFalcorModel({ buildDisplayName: name => `withFalcorQuery(${name})` })(Mock)
    expect(Bar.displayName).toBe(`withFalcorQuery(${getDisplayName(Mock)})`)
  })
})
