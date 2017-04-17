const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Dvd = mongoose.model('dvd');

describe('DvdsController', () => {
  it.only('POST to /dvds creates a new Dvd', (done) => {
    Dvd.count()
      .then((count) => {
        request(app)
          .post('/dvds')
          .send({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'})
          .end((err, res) => {
            assert(res.status === 302);

            Dvd.count().then((newCount) => {
              assert(count + 1 === newCount);
              done();
            });
          });
      });
  });
});
