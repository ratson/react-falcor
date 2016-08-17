import 'should'
import React from 'react'
import {mount, shallow} from 'enzyme'

import {Provider, resolve} from '../../src'

import model from '../fixtures/model'

describe('resolve', () => {
  const Foo = ({greeting}) => (
    <div>{greeting}</div>
  )
  const Bar = resolve((falcor) => falcor.getValue(['greeting']).then((greeting) => ({
    greeting,
  })))(Foo)
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

      Promise.resolve().then(() => {
        wrapper.html().should.be.exactly('<div>Hello World!</div>')
      })
    })
  })
})
