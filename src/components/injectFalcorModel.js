
import connectFalcorModel from './connectFalcorModel'

const buildDisplayName = name => `injectFalcorModel(${name})`

export default connectFalcorModel({ buildDisplayName })
