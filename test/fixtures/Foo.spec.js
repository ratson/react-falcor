import React from 'react'
import {shallow} from 'enzyme'

import Foo from './Foo'

describe('Foo', () => {
  it('render greeting', () => {
    const wrapper = shallow(<Foo greeting="hi"/>)
    wrapper.html().should.be.exactly('<div>hi</div>')
  })
})
