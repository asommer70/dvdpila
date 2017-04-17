const assert = require('assert');
const request = require('supertest');
const app = require('../../app');

describe('Routes', () => {
  it('/dvds/add displays the add Dvd form', (done) => {
    request(app)
      .get('/dvds/add')
      .end((err, res) => {
        assert(res.text.match(/form action="\/dvds" method="post"/))
        done();
      });
  });
});
