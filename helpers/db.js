/**
 * Database helper/service module
 * @module helpers/db
 */
const path = require('path');
const fs = require('fs');
const pg = require('./pg');

let base = null;
let queries = null;

getQueries = (directory = '/') => {
    let dir = path.join(base, directory);
    let list = fs.readdirSync(dir);

    for (let name of list) {
        let stats = fs.lstatSync(dir + '/' + name);

        if (stats.isDirectory()) {  
            getQueries(path.join(directory, name));
        } else if (name.endsWith('.sql')) {
            let queryName = path.join(directory, name);
            if (queryName.startsWith('/'))
                queryName = queryName.substring(1).slice(0, -4);
            queries.set(queryName, fs.readFileSync(path.join(dir, name)).toString());
        }
    }
};

module.exports.setup = (dir, force = false) => {
  if (!queries || force) {
    queries = new Map();
    base = dir;

    getQueries();
  }
}

module.exports.run = (name, ...values) => {
  return pg.query(queries.get(name), ...values);
}

module.exports.first = (name, ...values) => {
  return pg.first(queries.get(name), ...values);
}