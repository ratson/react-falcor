import { PropTypes } from 'react'
import getContext from 'recompose/getContext'

export default () => getContext({
  falcor: PropTypes.object,
})
