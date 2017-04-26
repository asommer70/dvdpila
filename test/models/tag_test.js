const assert = require('assert');
const Dvd = require('../../models/dvd');
const Tag = require('../../models/tag_schema');

describe('Tagging Dvds', () => {
  let dvd, arrival;
  let tag;

  beforeEach((done) => {
    dvd = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv', tags: [{name: 'scifi'}, {name: 'comics'}]});
    arrival = new Dvd({title: 'Arrival', rating: 5, fileUrl: 'http://videos/Arrival.mkv', tags: [{name: 'scifi'}]});
    thorDarkWorld = new Dvd({title: 'Thor: The Dark World', rating: 5, fileUrl: 'http://videos/Thor_The_Dark_World.mkv', tags: [{name: 'comics'}]});
    ghostInTheShell = new Dvd({title: 'Ghost In The Shell', rating: 5, fileUrl: 'http://videos/Ghost_In_The_Shell.mkv', tags: [{name: 'comics'}]});
    nerve = new Dvd({title: 'Nerve', rating: 0, fileUrl: 'http://videos/Nerve.mkv'});

    tag = {name: 'great'};
    dvd.tags.push(tag);

    Promise.all([dvd.save(), arrival.save(), thorDarkWorld.save(), ghostInTheShell.save(), nerve.save()])
      .then(() => done());
  });

  it('saves a relation between a dvd and a tag', (done) => {
    Dvd.findOne({title: 'Doctor Strange'})
      .then((dvd) => {
        assert(dvd.tags[0].name === 'great');
        done();
      })
  });

  it('can find a Tag on a Dvd', (done) => {
    Dvd.findOne({title: 'Doctor Strange'})
      .then((dvd) => {
        const action = {name: 'action'};
        // action.save()
          // .then(() => {
            dvd.tags.push(action);
            dvd.save()
              .then(() => Dvd.findOne({title: 'Doctor Strange'}).populate('tags'))
              .then((dvd) => {
                const actionTag = dvd.tags.filter((tag) => {
                  if (tag.name == 'action') {
                    return tag;
                  }
                });

                assert(actionTag[0].name === 'action');
                done();
              })
          // })
      })
  });

  it('can find all Dvds with a tag', (done) => {
    Dvd.find({'tags.name': 'comics'})
      .then((dvds) => {
        assert(dvds.length === 3);
        done();
      })
  });

  it('can save multiple Tags to a Dvd', (done) => {
    const newTags = 'great, super, funny';
    Dvd.findOne({title: 'Doctor Strange'})
      .then((dvd) => {
        newTags.replace(/\s/g, '').split(',').forEach((tagStr) => {
          const tagged = dvd.tags.findIndex((tag) => {
            if (tag.name === tagStr) {
              return true;
            }
            return false;
          });

          if (tagged === -1) {
            dvd.tags.push({name: tagStr});
          }
        });

        dvd.save()
          .then(() => {
            Dvd.findOne({title: 'Doctor Strange'})
              .then((dvd) => {
                assert(dvd.tags.length == 5);
                done();
              });
          });
      });
  });
});
