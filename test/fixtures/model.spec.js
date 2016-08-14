import model from './model'

describe('model', () => {
  it('can read greeting message', () => {
    return model.getValue('greeting').should.be.finally.equal('Hello World!')
  })
})
