import should from 'should'

import model from './model'

describe('model', () => {
  it('can read greeting message', () => {
    return model.getValue('greeting').should.be.finally.equal('Hello World!')
  })

  it('has _root.onChange()', () => {
    return should(model._root.onChange).be.a.Function()
  })

  it('has _request.requests array', () => {
    return should(model._request.requests).be.a.Array()
  })
})
