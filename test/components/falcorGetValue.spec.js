import React from 'react'
import {shallow} from 'enzyme'
import {renderToStaticMarkup} from 'react-dom/server'

import {Provider, falcorGetValue} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('falcorGetValue', () => {
  it('set displayName', () => {
    const Bar = falcorGetValue(['greeting'])(Foo)
    expect(Bar.displayName).toBe('falcorGetValue(Foo)')
  })

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

  it('should resolve values for server-side rendering', () => {
    const Bar = falcorGetValue({greeting: ['greeting']})(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar />
      </Provider>
    )
    const html = renderToStaticMarkup(<FooBar />)
    expect(html).toBe('<div>Hello World!</div>')
  })
})
