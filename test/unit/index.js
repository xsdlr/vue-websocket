const helpersContext = require.context('./helpers', true)
helpersContext.keys().forEach(helpersContext)

const testsContext = require.context('./specs', true, /\.spec/)
testsContext.keys().forEach(testsContext)
