import should from 'should'

import model from './model'

describe('model', () => {
  it('can read greeting message', () => model.getValue('greeting').should.be.finally.equal('Hello World!'))

  it('has _root.onChange()', () => should(model._root.onChange).be.a.Function())

  it('has _request.requests array', () => should(model._request.requests).be.a.Array())
})
