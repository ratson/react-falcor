import model from './model'

describe('model', () => {
  it('can read greeting message', async () => {
    const value = await model.getValue('greeting')
    expect(value).toEqual('Hello World!')
  })

  it('has _root', () => {
    expect(typeof model._root).toBe('object')
  })

  it('has _root.onChange()', () => {
    expect(typeof model._root.onChange).toBe('function')
  })

  it('has _request.requests array', () => {
    expect(Array.isArray(model._request.requests)).toBe(true)
  })
})
