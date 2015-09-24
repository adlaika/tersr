function trimSlashes (path) {
    if (typeof path !== 'string') throw new TypeError(path + ' is not a string!');
    if (path[path.length - 1] === '/') {
        path = path.substring(0, path.length - 1)
    }
    if (path[0] === '/') {
        path = path.substring(1)
    }
    return path
}

module.exports = {
    trimSlashes: trimSlashes
};