const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Dvd = mongoose.model('dvd');

describe('DvdsController', () => {
  it('POST to /dvds creates a new Dvd', (done) => {
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

  it('PUT to /dvds/:id updates an existing Dvd', (done) => {
    Dvd.create({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'})
      .then((dvd) => {
        request(app)
          .put('/dvds/' + dvd._id)
          .send({rating: 3.5})
          .end((err, res) => {
            Dvd.findOne({title: 'Doctor Strange'})
              .then((dvd) => {
                assert(dvd.rating === 3.5);
                done();
              });
          });
      })
  });

  it('DELETE to /dvds/:id deletes a Dvd', (done) => {
    Dvd.create({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'})
      .then((dvd) => {
        request(app)
          .delete('/dvds/' + dvd._id)
          .end((err, res) => {
            Dvd.findOne({title: 'Doctor Strange'})
              .then((dvd) => {
                assert(dvd === null);
                done();
              });
          });
      })
  });
});
