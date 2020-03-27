const path = require('path');
const json = require('../../package.json');

// application path's
const PATH_DIST = path.join(process.cwd(), 'build');
const PATH_SOURCE = path.join(process.cwd(), 'src');
const PATH_STATIC = path.join(process.cwd(), 'src', 'server', 'static');

// application specifics
const VERSION = json.version;
const NAME = json.name;

module.exports = {
    PATH_DIST,
    PATH_SOURCE,
    PATH_STATIC,
    VERSION,
    NAME,
};
