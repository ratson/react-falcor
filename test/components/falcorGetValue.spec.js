import React from 'react'
import {shallow} from 'enzyme'

import {Provider, falcorGetValue} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('falcorGetValue', () => {
  it('accept mapPathSetsToProps as object', () => {
    const Bar = falcorGetValue({greeting: ['greeting']})(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar />
      </Provider>
    )

    const wrapper = shallow(<FooBar />)
    expect(wrapper.html()).toBe('<div>Hello World!</div>')
  })

  it('accept mapPathSetsToProps as function', () => {
    const Bar = falcorGetValue(({path}) => ({greeting: [path]}))(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar path="greeting" />
      </Provider>
    )

    const wrapper = shallow(<FooBar />)
    expect(wrapper.html()).toBe('<div>Hello World!</div>')
  })
})
