import 'should'
import _ from 'lodash'
import delay from 'timeout-as-promise'
import rewire from 'rewire'

import {mount} from 'enzyme'
import falcor from 'falcor'
import React from 'react'

import {Provider, falcorGet} from '../../src'

import Foo from '../fixtures/Foo'
import model from '../fixtures/model'

const falcorGetModule = rewire('../../src/components/falcorGet')
const defaultMergeProps = falcorGetModule.__get__('defaultMergeProps')

describe('falcorGet', () => {
  describe('defaultMergeProps', () => {
    it('handle undefined response', () => {
      const props = {a: 1}
      defaultMergeProps(undefined, props).should.be.eql(props)
    })

    it('merge props', () => {
      const props = {a: 1, b: 2}
      defaultMergeProps({json: {a: 2}}, props).should.be.eql({
        a: 2,
        b: 2,
      })
    })
  })

  it('accept passing single pathSet', () => {
    const Bar = falcorGet(['greeting'])(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('accept array of pathSet', () => {
    const Bar = falcorGet([['greeting']])(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('accept function that returns array of pathSet', () => {
    const Bar = falcorGet(({path}) => [[path]])(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar path="greeting"/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')
  })

  it('can transform to props', () => {
    const Bar = falcorGet(['todos[0].name', ['todos', 1, 'name']], ({json}) => {
      json.todos[0].name.should.be.exactly('get milk from corner store')
      return {
        greeting: json.todos[1].name,
      }
    })(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    wrapper.html().should.be.exactly('<div>withdraw money from ATM</div>')
    wrapper.unmount()
  })

  it('re-fetch on invalidate', () => {
    const model = new falcor.Model({
      cache: {
        greeting: 'Hello World!',
      },
    })

    const Bar = falcorGet(['greeting'])(Foo)
    const FooBar = () => (
      <Provider falcor={model}>
        <Bar/>
      </Provider>
    )

    const wrapper = mount(<FooBar/>)
    wrapper.html().should.be.exactly('<div>Hello World!</div>')

    return delay().then(() => {
      const cache = model.getCache()
      model.invalidate('greeting')
      _.set(cache, 'greeting.value', 'Hi!')
      model.setCache(cache)

      wrapper.html().should.be.exactly('<div>Hi!</div>')
    })
  })
})
