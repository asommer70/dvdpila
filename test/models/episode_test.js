const assert = require('assert');
const Dvd = require('../../models/dvd');
const Episode = require('../../models/episode_schema');

describe('Episodes on a Dvd', () => {
  it('can create an episode', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', episodes: [{name: 'Disc 1'}]});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.episodes.length === 1);
        assert(dvd.episodes[0].name == 'Disc 1');
        done();
      });
  });

  it('can add an Episode to an existing Dvd', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', episodes: []});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        dvd.episodes.push({name: 'Disc 2'});
        return dvd.save()
      })
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.episodes.length === 1);
        assert(dvd.episodes[0].name == 'Disc 2');
        done();
      });
  });

  it('an Episode can be removed from a Dvd', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', episodes: [{name: 'Disc 1'}]});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        dvd.episodes[0].remove()
        return dvd.save();
      })
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.episodes.length == 0);
        done();
      });
  });
});
