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
            path: __dirname + '/assets/sayHi.js'
        }
    },

    forkedProcess: {
        create: {
            module: function(target) {
                return target();
            },
            args: [
                {$ref: 'deferredFork'}
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
    it('should be created', () => {
        expect(context.forkedProcess.pid).to.be.an.integer();
    });
});

after(async () => {
    context.destroy();
});
