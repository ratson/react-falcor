import 'should'
import React from 'react'
import {shallow} from 'enzyme'

import {Provider, falcorGet} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

describe('falcorGet', () => {
  it('accept getPathSets as array', () => {
    const Bar = falcorGet(['greeting'])(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('accept getPathSets as function', () => {
    const Bar = falcorGet(({path}) => ([path]))(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar path="greeting"/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('can transform to props', () => {
    const Bar = falcorGet(['greeting'], ({json}) => {
      return {
        greeting: json.greeting,
      }
    })(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = shallow(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })
})
