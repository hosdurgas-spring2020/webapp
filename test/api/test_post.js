const request = require('supertest');
const express = require('express');
 
const app = express();

// Bodyparser Middleware
app.use(express.json());
 
app.use('/v1/user', require('../../routes/api/users'), (req, res) => {
  res.status(200).json({ name: 'john' });
});
 
describe('POST /v1/user', () => {
    it('responds with json', (done) => {
      request(app)
        .post('/v1/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });








// const expect = require('chai');
// const request = require('supertest');

// const app = require('../../server');
// const connection = require('../../config');

// describe('POST api/users', () =>{
//     it('OK, creating new user works',(done)=>{
//         connection.query(`SELECT * FROM finaltable`)
//         .then((row) => done(rpw))
//         .catch((err) => done(err))

//     })

//     it('OK, creating new user works', (done) =>{
//         request(app).post('users')
//         .send({"first_name": "test","last_name": "test","email":"s@gmail.com","password":"test1234"})
//         .then((res)=>{
//             const body = res.body;
//             expect(body).to.contain.property('id');
//             done();
//         })
//     })

// });

