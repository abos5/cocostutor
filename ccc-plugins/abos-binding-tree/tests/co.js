
// co = require('co')

const sys = require('sys');

(function* () {
    let foo = yield (next) => {
        return () => {
            console.log(1)
            next(null, 1)
        }
    }
    console.log(foo)
})()


