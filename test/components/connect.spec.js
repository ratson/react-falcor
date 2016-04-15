import should from 'should'
import rewire from 'rewire'

import falcor from 'falcor'

import React from 'react'

import { Provider } from '../../src'

const connect = rewire('../../src/components/connect')
const reducePathSet = connect.__get__('reducePathSet')

describe('React', () => {
  const model = new falcor.Model({
    cache: {
      greeting: 'Hello World!',
      todos: [
        {
          name: 'get milk from corner store',
          done: false,
        },
        {
          name: 'withdraw money from ATM',
          done: true,
        },
      ],
    },
  })

  it('can read greeting message', () => {
    return model.getValue('greeting').should.be.finally.equal('Hello World!')
  })

  describe('connect', () => {

    describe('reducePathSet', () => {

      const resolve = (pathSet) => reducePathSet({}, pathSet, 'x')['x']({falcor: model})

      it('should resolve greeting', () => {
        return resolve(['greeting']).should.be.finally.equal('Hello World!')
      })

      it('should resolve greeting using function', () => {
        return resolve(() => ['greeting']).should.be.finally.equal('Hello World!')
      })

      it('should resolve todos', () => {
        return resolve(['todos', 1, ['name', 'done']]).should.be.finally.eql({
          name: 'withdraw money from ATM',
          done: true,
        })
      })

    })

  })
})
