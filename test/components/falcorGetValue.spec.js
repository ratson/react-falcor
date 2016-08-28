import 'should'
import React from 'react'
import {shallow} from 'enzyme'

import {Provider, falcorGetValue} from '../../src'

import model from '../fixtures/model'

describe('falcorGetValue', () => {
  const Foo = ({greeting}) => (
    <div>{greeting}</div>
  )

  describe('Foo', () => {
    it('render greeting', () => {
      const wrapper = shallow(<Foo greeting="hi"/>)
      wrapper.html().should.be.exactly('<div>hi</div>')
    })
  })

  it('accept mapPathSetsToProps as object', () => {
    const Bar = falcorGetValue({greeting: ['greeting']})(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('accept mapPathSetsToProps as function', () => {
    const Bar = falcorGetValue(({path}) => ({greeting: [path]}))(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar path="greeting"/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })
})
