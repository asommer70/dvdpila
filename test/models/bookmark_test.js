const assert = require('assert');
const Dvd = require('../../models/dvd');
const Bookmark = require('../../models/bookmark_schema');

describe('Bookmarks on a Dvd', () => {
  it('can create a Bookmark', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', bookmarks: [{name: 'Episode 1', time: 20}]});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.bookmarks.length === 1);
        assert(dvd.bookmarks[0].time == 20);
        done();
      });
  });

  it('can add a Bookmark to an existing Dvd', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', bookmarks: []});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        dvd.bookmarks.push({name: 'Episode 2', time: 90});
        return dvd.save()
      })
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.bookmarks.length === 1);
        assert(dvd.bookmarks[0].time == 90);
        done();
      });
  });

  it('a Bookmark can be removed from a Dvd', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', bookmarks: [{name: 'Episode 3', time: 130}]});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        dvd.bookmarks[0].remove()
        return dvd.save();
      })
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.bookmarks.length == 0);
        done();
      });
  });

  it('can add a Bookmark to an Episode', (done) => {
    const drStrange = new Dvd({title: 'Doctor Strange', episodes: [{name: 'Disc 1'}], bookmarks: []});
    drStrange.save()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        dvd.episodes[0].bookmarks.push({name: 'Episode 9', time: 450});
        return dvd.save()
      })
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd.episodes[0].bookmarks.length === 1);
        assert(dvd.episodes[0].bookmarks[0].time == 450);
        done();
      });
  });
});
