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

  describe('getValueToProps', () => {
    const Bar = falcorGetValue({greeting: ['greeting']})(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    it('render greeting', () => {
      const wrapper = shallow(<FooBar/>)
      wrapper.html().should.be.exactly('<div>Hello World!</div>')
    })
  })

  describe('mapGetValueToProps', () => {
    const Bar = falcorGetValue(() => ({greeting: ['greeting']}))(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    it('render greeting', () => {
      const wrapper = shallow(<FooBar/>)
      wrapper.html().should.be.exactly('<div>Hello World!</div>')
    })
  })
})
