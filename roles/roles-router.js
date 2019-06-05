const knex = require('knex');

const router = require('express').Router();

//using data access layer; can replace db('roles) with Roles.find() and db('roles').where({ id: req.params.id }) with //Roles.findById(req.params.id)
const Roles = require('./roles-model.js') 


//install knex and driver (sqlite3)
//configure knex and get a connection to the db

const knexConfig = {
  client: 'sqlite3', //driver
  connection: { //how to find the db
    filename: './data/rolex.db3'
  },
  useNullAsDefault: true, // required only for sqlite3
  // debug: true,
  
}

const db = knex(knexConfig); //this will now give us a configured connection to our db


router.get('/', (req, res) => {
  //hey database i'll like to get a hold of the roles table, and once your get all that
  //data from the roles table i'd like to send that back as a json object
    db('roles')  // sql: SELECT * FROM roles-->table
      .then(roles => {
      res.status(200).json(roles);
    })
  //and of course if you run into any issues, have any errors, could you please let me know
  //by sending it back to me, send this error back.
    .catch(error => {
      res.status(500).json(error)
    })
}); 

router.get('/:id', (req, res) => { //select statement: i would like to get from the roles table, all of the columns, but only for a particular id? 
  // select * from roles where id = 123
  db('roles') 
    .where({ id: req.params.id })
    .first() // sends only the first data back -- do a 'where' filter that, i know i'm filtering by the primary key so i'm going grab the first record, roles ->role
            //getting the role back instead of the collection
    .then(role => {
      // console.log('role', role); //role undefined
      //return 404 if the record is not found
      if (role) {
        res.status(200).json(role) //also, works instead of first()-->roles[0] returns just the record object, not in an array.
      } else {
        res.status(404).json({ message: 'Role not found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
  });
}); // why do we always return back an array? when your using 'where'(filter) you're working with a set of data, 
// thats on a table, and a table is a set of records, and its always going to return a set of records, even if that set only has 1 record , or none. 
//every time you run a 'where' your always going to get a collection back, even if its only 1 record.

router.post('/', (req, res) => {
  db('roles')
      .insert(req.body, 'id') //always going to get an array with the id of the last record that you inserted
               //what column/data do i want to get back from the db after you insert the record
              //promise - happens asynchronously
      .then(ids => {  
      res.status(201).json(ids); //getting back a collection of ids
  }).catch( error => {
    res.status(500).json(error)
  })
             
});

router.put('/:id', (req, res) => {
  const changes = req.body // new data you want to update to e.g { "name": "Student" }
  db('roles')
  .where({ id: req.params.id }) //filter it
  .update(changes) //update passing the changes
  .then(count => { //count = how many records did i update
    if(count > 0) { //if i did update something the count is going to be more then 0
      res.status(200).json({ message: `${count} records updated`})
    } else { //i could not find any records with this filter -- .where({ id: req.params.id })
      res.status(404).json({ message: 'Role not found' })
    }
  }).catch(error => {  
      res.status(500).json(error)
  })
});

router.delete('/:id', (req, res) => {
  const changes = req.body
  db('roles') //i have my roles 
  .where({ id: req.params.id }) //filter it - find the ones i want to delete
  .del() 
  .then(count => { //count = how many records did i delete
    if(count > 0) { //if i did delete something the count is going to be more then 0
      const unit = count > 1 ? `records`: 'record';
      res.status(200).json({ message: `${count} ${unit} deleted`});
    } else { //i could not find any records with this filter -- .where({ id: req.params.id })
      res.status(404).json({ message: 'Role not found' });
    }
  }).catch(error => {  
      res.status(500).json(error)
  })
});

module.exports = router;
