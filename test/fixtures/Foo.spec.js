import React from 'react'
import renderer from 'react-test-renderer'

import Foo from './Foo'

describe('Foo', () => {
  it('render greeting', () => {
    const component = renderer.create(<Foo greeting="hi"/>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
