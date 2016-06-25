# react-falcor

React binding for Falcor.

## Installation

```
npm install react-falcor --save
```

## Usage

```js
import { Model } from 'falcor'
import HttpDataSource from 'falcor-http-datasource'

import { Provider, getValue } from 'react-falcor'
import React from 'react'
import ReactDOM from 'react-dom'

const falcor = new Model({
  source: new HttpDataSource('/model.json'),
})

const App = getValue({
  greeting: ['greeting'],
})(({greeting}) => {
  return (
    <p>{greeting}</p>
  )
})

ReactDOM.render(
  <Provider falcor={falcor}>
    <App />
  </Provider>,
  document.getElementById('container')
)
```
