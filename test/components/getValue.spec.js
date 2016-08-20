import 'should'
import delay from 'timeout-as-promise'
import React from 'react'
import {mount, shallow} from 'enzyme'

import {Provider, getValue} from '../../src'

import model from '../fixtures/model'

describe('getValue', () => {
  const Foo = ({greeting}) => (
    <div>{greeting}</div>
  )
  const Bar = getValue({greeting: ['greeting']})(Foo)
  const FooBar = () => (
    <Provider falcor={model}>
      <Bar/>
    </Provider>
  )

  describe('Foo', () => {
    it('render greeting', () => {
      const wrapper = shallow(<Foo greeting="hi"/>)
      wrapper.html().should.be.exactly('<div>hi</div>')
    })
  })

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
