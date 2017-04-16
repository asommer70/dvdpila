const assert = require('assert');
const Dvd = require('../../models/dvd');
const Tag = require('../../models/tag');

describe('Tagging Dvds', () => {
  let dvd;
  let tag;

  beforeEach((done) => {
    dvd = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});
    tag = new Tag({name: 'great'});

    dvd.tags.push(tag);
    tag.dvds.push(dvd);

    Promise.all([dvd.save(), tag.save()])
      .then(() => done());
  });

  it('saves a relation between a dvd and a tag', (done) => {
    Dvd.findOne({title: 'Doctor Strange'}).populate('tags')
      .then((dvd) => {
        assert(dvd.tags[0].name === 'great');
        done();
      })
  });

  it('saves full relation tree between tags and dvds', (done) => {
    Dvd.findOne({title: 'Doctor Strange'}).populate({
      path: 'tags',
      populate: {
        path: 'dvds',
        model: 'dvd'
      }
    })
    .then((dvd) => {
      assert(dvd.tags[0].name === 'great');
      assert(dvd.tags[0].dvds[0].title === 'Doctor Strange');
      done();
    });
  });
});
