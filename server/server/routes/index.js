var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = 'postgres://postgres:p@localhost:5432/todo';
let index = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.post('/api/v1/players', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
      connectionString: connectionString,
  });

  const data = req.body;
  
  pool.query('INSERT INTO players(name, jerseyNumber, city, state) values($1, $2, $3, $4)', [data.name, data.jerseyNumber, data.city, data.state], function (err, result) {
      console.log(result);
  });
  
  pool.query('select * from players order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.get('/api/v1/players', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  pool.query('select * from players order by id asc', function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.get('/api/v1/players/:player_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  const id = req.params.player_id;
  pool.query('select * from players where id=($1)', [id], function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.put('/api/v1/players/:player_id', (req, res, next) => {
    const results = [];
    const pool = pg.Pool({
        connectionString: connectionString,
    });
    
    const id = req.params.player_id;
    const player = req.body;
    console.log(player);

    pool.query(
      'update players set name=($1), \
      jerseyNumber=($2), \
      city=($3), \
      state=($4) \
      where id=($5)',
      [player.name, player.jerseyNumber, player.city, player.state, id]);
      // birthday=${birthday~},\
      // teamID=${teamID},\
      // emergencyContactName=${emergencyContanctName~}\
      // emergencyContactPhone=${emergencyContactPhone~},\
      // emergencyContactRelationship=${emergencyContactRelationship~}',
    
    pool.query('select * from players order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.delete('/api/v1/players/:player_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });
  const id = req.params.player_id;
  console.log(id);

  pool.query('delete from players where id=($1)', [id]);

  pool.query('select * from players order by id asc', function (err, result) {
    pool.end();
    return res.json(result);
  });
});



router.post('/api/v1/coach', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
      connectionString: connectionString,
  });

  const data = req.body;
  
  pool.query('INSERT INTO coaches(username, firstname, lastname, email, phone, city, state) values($1, $2, $3, $4, $5, $6, $7)', [data.username, data.firstname, data.lastname, data.email, data.phone, data.city, data.state], function (err, result) {
      console.log(result);
  });
  
  pool.query('select * from coaches order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.get('/api/v1/coach', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  pool.query('select * from coaches order by id asc', function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.get('/api/v1/coach/:coach_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  const id = req.params.coach_id;
  pool.query('select * from coaches where id=($1)', [id], function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.put('/api/v1/coach/:coach_id', (req, res, next) => {
    const results = [];
    const pool = pg.Pool({
        connectionString: connectionString,
    });
    
    const id = req.params.coach_id;
    const data = req.body;
    console.log(data);

    pool.query(
      'update coaches set \
      firstname=($1), \
      lastname=($2), \
      email=($3), \
      phone=($4), \
      city=($5), \
      state=($6), \
      where id=($7)',
      [data.firstname, data.lastname, data.email, data.phone, data.city, data.state, id]);
      // birthday=${birthday~},\
      // teamID=${teamID},\
      // emergencyContactName=${emergencyContanctName~}\
      // emergencyContactPhone=${emergencyContactPhone~},\
      // emergencyContactRelationship=${emergencyContactRelationship~}',
    
    pool.query('select * from coaches order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.delete('/api/v1/coach/:coach_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });
  const id = req.params.coach_id;
  console.log(id);

  pool.query('delete from coaches where id=($1)', [id]);

  pool.query('select * from coaches order by id asc', function (err, result) {
    pool.end();
    return res.json(result);
  });
});




router.post('/api/v1/team', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
      connectionString: connectionString,
  });

  const data = req.body;
  
  pool.query('INSERT INTO teams(name, city, state, ageGroup, leagueName, number, primaryColor) values($1, $2, $3, $4, $5, $6, $7)', [data.username, data.firstname, data.lastname, data.email, data.phone, data.city, data.state], function (err, result) {
      console.log(result);
  });
  
  pool.query('select * from teams order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.get('/api/v1/team', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  pool.query('select * from teams order by id asc', function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.get('/api/v1/team/:team_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });

  const id = req.params.team_id;
  pool.query('select * from teams where id=($1)', [id], function(err, result){
    if(err){
      console.log(err);
    }

    pool.end();
    return res.json(result.rows);
  });
});

router.put('/api/v1/team/:team_id', (req, res, next) => {
    const results = [];
    const pool = pg.Pool({
        connectionString: connectionString,
    });
    
    const id = req.params.team_id;
    const data = req.body;
    console.log(data);

    pool.query(
      'update teams set \
      name=($1), \
      city=($2), \
      state=($3), \
      ageGroup=($4), \
      leagueName=($5), \
      number=($6), \
      primaryColor=($7), \
      where id=($8)',
      [data.name, data.city, data.state, data.ageGroup, data.leagueName, data.number, data.primaryColor, id]);
      // birthday=${birthday~},\
      // teamID=${teamID},\
      // emergencyContactName=${emergencyContanctName~}\
      // emergencyContactPhone=${emergencyContactPhone~},\
      // emergencyContactRelationship=${emergencyContactRelationship~}',
    
    pool.query('select * from teams order by id asc', function (err, result) {
      pool.end();
      return res.json(result);
  });
});

router.delete('/api/v1/team/:team_id', function(req, res, next) {
  const results = [];
  const pool = pg.Pool({
    connectionString: connectionString,
  });
  const id = req.params.team_id;
  console.log(id);

  pool.query('delete from teams where id=($1)', [id]);

  pool.query('select * from teams order by id asc', function (err, result) {
    pool.end();
    return res.json(result);
  });
});



// router.get('/api/v1/items/:todo_id', function(req, res, next) {
//   const results = [];
//   const pool = pg.Pool({
//     connectionString: connectionString,
//   });
//   const id = req.params.todo_id;
//   console.log(id);

//   pool.query('select * from items where id=($1)', [id], function(err, result){
//     if(err){
//       console.log(err);
//     }

//     pool.end();
//     return res.json(result.rows);
//   });
// });

// router.get('/api/v1/items', function(req, res, next) {
//   const results = [];
//   const pool = pg.Pool({
//     connectionString: connectionString,
//   });

//   pool.query('select * from items', function(err, result){
//     if(err){
//       console.log(err);
//     }

//     pool.end();
//     return res.json(result.rows);
//   });
// });

// router.post('/api/v1/items', function(req, res, next) {
//     const results = [];
//     const pool = pg.Pool({
//         connectionString: connectionString,
//     });
//     const data = {text: req.body.text, complete: false};
    
//     pool.query('INSERT INTO items(text, complete) values($1, $2)', [data.text, data.complete], function (err, result) {
//         console.log(result);
//     });
    
//     pool.query('select * from items order by id asc', function (err, result) {
//         pool.end();
//         return res.json(result);
//     });
// });

// router.put('/api/v1/:todo_id', function(req, res, next) {
//   const results = [];
//   const pool = pg.Pool({
//     connectionString: connectionString,
//   });
//   const id = req.params.todo_id;
//   console.log(id);

//   const data = {text: req.body.text, complete: req.body.complete};
//   console.log(data);

//   pool.query('update items set text=($1), complete=($2) where id=($3)', [data.text, data.complete, id]);

//   pool.query('select * from items order by id asc', function (err, result) {
//     pool.end();
//     return res.json(result);
//   });
// });

// router.delete('/api/v1/items/:todo_id', function(req, res, next) {
//   const results = [];
//   const pool = pg.Pool({
//     connectionString: connectionString,
//   });
//   const id = req.params.todo_id;
//   console.log(id);

//   pool.query('delete from items where id=($1)', [id]);

//   pool.query('select * from items order by id asc', function (err, result) {
//     pool.end();
//     return res.json(result);
//   });
// });

module.exports = router;
