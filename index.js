const fork = require('child_process').fork;

function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return Object.prototype.toString.call(value);
}

function isString(value) {
    const type = typeof value;
    return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]');
}

function isNil(value) {
    return value == null;
}

export default function forkProcessPlugin(options) {
    const openedProcesses = [];

    const closeOpenedProcesses = () => {
        openedProcesses.forEach(proc => proc.kill('SIGINT'));
    }

    const runProcess = (path, args) => {
        const childProcess = fork(path, args);
        openedProcesses.push(childProcess);
        return childProcess;
    }

    function createDeferredFork(resolver, compDef, wire) {
        wire(compDef.options).then(({
            path
        }) => {
            if(isNil(path) || !isString(path) || !path.length) throw new Error('[forkProcessPlugin] process path should be defined');
            resolver.resolve((args) => runProcess(path, args));
        });
    }

    return {
        factories: {
            createDeferredFork
        },
        context: {
            error: (resolver, wire, err) => {
                closeOpenedProcesses();
                resolver.resolve();
            }
        }
    }
}
