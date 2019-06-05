const knex = require('knex');

const knexConfig = {
    client: 'sqlite3', //driver
    connection: { //how to find the db
      filename: './data/rolex.db3'
    },
    useNullAsDefault: true, // required only for sqlite3
    // debug: true,
    
  }
  
const db = knex(knexConfig); //this will now give us a configured connection to our db
  

module.exports = {
    find, // db('roles')
    findById,
    add,
    update,
    remove
}

//data access library that's going to be able to talk to the database

function find() { //return a call to the database, sql: SELECT * FROM roles-->table
    return db('roles'); //promise
}

function findById(id) {
    return db('roles')
        .where({ id })
        .first();
}

function add(role) {
    return null;
}

function update(id, changes) {
    return null;
}

function remove(id) {
    return null;
}

//if i want to use this data access layer on my router -- export

