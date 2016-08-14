import falcor from 'falcor'

const model = new falcor.Model({
  cache: {
    greeting: 'Hello World!',
    todos: [
      {
        name: 'get milk from corner store',
        done: false,
      },
      {
        name: 'withdraw money from ATM',
        done: true,
      },
    ],
  },
})

export default model
