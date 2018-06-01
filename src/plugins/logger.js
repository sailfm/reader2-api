const good = require('good')

module.exports = {
  plugin: good,
  options: {
    ops: {
      interval: 10000
    },
    reporters: {
      myConsoleReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [
            {
              request: '*', // request logging information emitted by request.log(), 'request' event
              response: '*', // info about incoming requests and the response., 'request' and 'tail' events
              error: '*', // request responses that have a status code of 500, 'request' event on error channel
              log: '*' // info not bound to a request: system errors, background work, config errors, 'log' event
              // ops: '*' // CPU, memory, disk, and other metrics
            }
          ]
        },
        {
          module: 'good-console',
          args: [{ format: 'YY/MM/DD-HH:MM:ss.SSS' }]
        },
        'stdout'
      ]
    }
  }
}
