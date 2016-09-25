# react-falcor

[React](https://github.com/facebook/react) binding for [Falcor](https://github.com/Netflix/falcor).

## Installation

```
npm install react-falcor --save
```

## Usage

```js
import { Model } from 'falcor'
import HttpDataSource from 'falcor-http-datasource'

import { Provider, falcorGet } from 'react-falcor'
import React from 'react'
import ReactDOM from 'react-dom'

const falcor = new Model({
  source: new HttpDataSource('/model.json'),
})

const App = falcorGet(
  ['greeting']
))(({greeting}) => {
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
