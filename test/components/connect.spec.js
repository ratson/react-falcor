import 'should'
import rewire from 'rewire'

import model from '../fixtures/model'

const connect = rewire('../../src/components/connect')
const reducePathSet = connect.__get__('reducePathSet')

describe('connect', () => {
  describe('reducePathSet', () => {
    const resolve = (pathSet) => reducePathSet({}, pathSet, 'x').x({falcor: model})

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
