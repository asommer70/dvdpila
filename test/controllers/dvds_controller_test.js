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

  it('PUT to /api/dvds/:id updates an existing Dvd', (done) => {
    Dvd.create({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'})
      .then((dvd) => {
        request(app)
          .put('/api/dvds/' + dvd._id)
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

  it('DELETE to /api/dvds/:id deletes a Dvd', (done) => {
    Dvd.create({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'})
      .then((dvd) => {
        request(app)
          .delete('/api/dvds/' + dvd._id)
          .end((err, res) => {
            Dvd.findOne({title: 'Doctor Strange'})
              .then((dvd) => {
                assert(dvd === null);
                done();
              });
          });
      })
  });

  it('GET /api/dvds returns a list of Dvds', (done) => {
    drStrange = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});
    thorDarkWorld = new Dvd({title: 'Thor: The Dark World', rating: 5, fileUrl: 'http://videos/Thor_The_Dark_World.mkv'});
    ghostInTheShell = new Dvd({title: 'Ghost In The Shell', rating: 5, fileUrl: 'http://videos/Ghost_In_The_Shell.mkv'});
    arrival = new Dvd({title: 'Arrival', rating: 0, fileUrl: 'http://videos/Arrival.mkv'});
    nerve = new Dvd({title: 'Nerve', rating: 0, fileUrl: 'http://videos/Nerve.mkv'});

    Promise.all([drStrange.save(), thorDarkWorld.save(), ghostInTheShell.save(), arrival.save(), nerve.save()])
      .then(() => {
        request(app)
          .get('/api/dvds')
          .end((err, res) => {
            assert(res.body[0].title == 'Nerve');
            done();
          });
      });
  });
});
