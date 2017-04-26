const assert = require('assert');
const Dvd = require('../../models/dvd');
const Tag = require('../../models/tag');
const DvdTag = require('../../models/dvd_tag');

describe('DvdTag model', () => {
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


  it('can create join model between a Tag and Dvd', (done) => {
    const dvdtag = new DvdTag({dvd: dvd, tag: tag})
    dvdtag.save()
      .then(() => {
        DvdTag.findOne({'dvd.title': 'Doctor Strange'})
          .populate('dvd')
          .populate('tag')
          .then((dvdtag) => {
            console.log('dvdtag:', dvdtag);
            done();
          });
      })
  });
});
