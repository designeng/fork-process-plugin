const forkProcessPlugin = require('../index');
const wire = require('wire');
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-integer'));

let context;

const spec = {
    $plugins: [
        forkProcessPlugin
    ],

    deferredFork: {
        createDeferredFork: {
            path: __dirname + '/assets/sendHi.js'
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
    },

    childProcessMessage: {
        create: {
            module: function(childProcess) {
                return new Promise((resolve, reject) => {
                    childProcess.on('message', (message) => {
                        resolve(message);
                    });
                })
            },
            args: [
                {$ref: 'forkedProcess'}
            ]
        }
    }
}

before(async () => {
    try {
        context = await wire(spec);
    } catch (err) {
        console.log('Wiring error', err);
    }
});

describe('forkedProcess', () => {
    it('should be created', async () => {
        await expect(context.forkedProcess.pid).to.be.an.integer();
    });

    it('should recieve child process message', async () => {
        await expect(context.childProcessMessage).to.equal('Hi');
    });
});

after(async () => {
    context.destroy();
});
