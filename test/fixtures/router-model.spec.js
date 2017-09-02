import model from './router-model'

describe('router-model', () => {
  it('can subscribe undefined value', async () => {
    const value = await new Promise((resolve, reject) => {
      model.get(['undefined']).subscribe(resolve, reject, resolve)
    })
    expect(value).toEqual({ json: {} })
  })

  it('can subscribe null value', async () => {
    const value = await new Promise((resolve, reject) => {
      model.get(['null']).subscribe(resolve, reject, resolve)
    })
    expect(value).toEqual({ json: {} })
  })

  it('can read undefined value', async () => {
    const value = await model.getValue('undefined')
    expect(value).toBeUndefined()

    const res = await model.get(['undefined', 'nested', 'value'])
    expect(res).toEqual({ json: {} })

    const res2 = await model.get(['undefined', 'value'], ['delayed'])
    expect(res2).toEqual({ json: { delayed: 'delayed' } })
  })

  it('can read delayed value', async () => {
    const value = await model.getValue('delayed')
    expect(value).toBe('delayed')
  })
})
