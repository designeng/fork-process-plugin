## Fork process plugin for wire.js

## Installation
`npm i fork-process-plugin`

Install wire from `git://github.com/cujojs/wire.git#0.10.11`

## Usage
```
import wire from 'wire';
import forkProcessPlugin from 'fork-process-plugin';

const spec = {
    $plugins: [
        forkProcessPlugin
    ],

    deferredFork: {
        createDeferredFork: {
            path: __dirname + '/../forks/one/index.js'
        }
    },

    forkedProcess: {
        create: {
            module: function(run) {
                return run();
            },
            args: [
                {$ref: 'deferredFork'}
            ]
        }
    }
}

wire(spec);
```
