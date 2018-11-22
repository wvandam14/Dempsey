const pg = new require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:p@localhost:5432/todo';

const pool = pg.Pool({
    connectionString: connectionString,
});

// pool.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text  VARCHAR(40) not null, complete BOOLEAN)', function (err, result) {
//     if(err){
//         console.log(err);
//     }
//     //pool.end();
// });

// pool.query('', function (err, result) {
//     if(err){
//         console.log(err);
//     }
//     //pool.end();
// });

// pool.query('create table players(id serial primary key,name varchar(40), birthday date, teamID integer, jerseyNumber integer, city varchar(40), state varchar(2), photoID integer, emergencyContactName varchar(40), emergencyContactPhone varchar(13), emergencyContactRelationship varchar(40))', function (err, result) {
//     if(err){
//         console.log(err);
//     }
//     //pool.end();
// });
pool.query(
    `create table players(
    id serial primary key,
    userID integer,
    name varchar(40),
    birthday date,
    teamID integer,
    jerseyNumber integer,
    city varchar(40),
    state varchar(2),
    photoID integer,
    emergencyContactName varchar(40),
    emergencyContactPhone varchar(13),
    emergencyContactRelationship varchar(40))`, function (err, result) {
    if(err){
        console.log(err);
    }
    //pool.end();
});

pool.query(
    `create table teams(
    id serial primary key,
    name varchar(40),
    city varchar(40),
    state varchar(2),
    ageGroup varchar(10),
    leagueName varchar(40),
    number integer,
    logoID integer,
    primaryColor varchar(6),
    teamStatsID integer,
    coachID integer)`, function (err, result) {
    if(err){
        console.log(err);
    }
    //pool.end();
});

pool.query(
    `create table coaches(
        id serial primary key,
        username varchar(40),
        firstName varchar(40),
        lastname varchar(40),
        email varchar(40),
        password varchar(16),
        phone varchar(13),
        city varchar(40),
        state varchar(2),
        photoID integer)`, function (err, result) {
    if(err){
        console.log(err);
    }
    //pool.end();
});

pool.end();