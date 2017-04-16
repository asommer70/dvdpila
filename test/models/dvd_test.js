const assert = require('assert');
const Dvd = require('../../models/dvd');

describe('Creating Dvd records', () => {
  it('saves a Dvd', (done) => {
    const dvd = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});

    dvd.save()
      .then(() => {
        assert(!dvd.isNew);
        done();
      })
  });

  it('requires a title', () => {
    const dvd = new Dvd({title: undefined});
    const validationResult = dvd.validateSync();
    const { message } = validationResult.errors.title;
    assert(message == 'Title is required.');
  });

  it('disallows invalide records from being saved', (done) => {
    const dvd = new Dvd({title: undefined});
    dvd.save()
      .catch((err) => {
        const { message } = err.errors.title;
        assert(message === 'Title is required.');
        done();
      });
  });
});

describe('Getting a Dvd', () => {
  let drStrange;
  let thorDarkWorld;
  let ghostInTheShell;
  let arrival;
  let nerve;

  beforeEach((done) => {
    drStrange = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});
    thorDarkWorld = new Dvd({title: 'Thor: The Dark World', rating: 5, fileUrl: 'http://videos/Thor_The_Dark_World.mkv'});
    ghostInTheShell = new Dvd({title: 'Ghost In The Shell', rating: 5, fileUrl: 'http://videos/Ghost_In_The_Shell.mkv'});
    arrival = new Dvd({title: 'Arrival', rating: 0, fileUrl: 'http://videos/Arrival.mkv'});
    nerve = new Dvd({title: 'Nerve', rating: 0, fileUrl: 'http://videos/Nerve.mkv'});

    Promise.all([drStrange.save(), thorDarkWorld.save(), ghostInTheShell.save(), arrival.save(), nerve.save()])
      .then(() => done());
  });

  it('returns a list of Dvds based on title', (done) => {
    Dvd.find({title: 'Doctor Strange'})
      .then((dvds) => {
        assert(dvds[0]._id.toString() === drStrange._id.toString());
        done();
      });
  });

  it('can find a Dvd with a particular id', (done) => {
    Dvd.findOne({_id: ghostInTheShell._id})
      .then((dvd) => {
        assert(ghostInTheShell.title === 'Ghost In The Shell');
        done();
      });
  });

  it('can skip and limit the result set', (done) => {
    Dvd.find({})
      .sort({title: 1})
      .skip(1)
      .limit(2)
      .then((dvds) => {
        assert(dvds[0].title === 'Doctor Strange');
        assert(dvds.length === 2);
        done();
      });
  });
});

describe('Removing a Dvd', () => {
  let dvd;

  beforeEach((done) => {
    dvd = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});
    dvd.save()
      .then(() => done());
  });

  it('model instance remove', (done) => {
    dvd.remove()
      .then(() => Dvd.findOne({title: 'Doctor Strange'}))
      .then((dvd) => {
        assert(dvd === null);
        done();
      });
  });

  it('class findAndRemove method', (done) => {
    Dvd.findOneAndRemove({title: 'Doctor Strange'})
    .then(() => Dvd.findOne({title: 'Doctor Strange'}))
    .then((dvd) => {
      assert(dvd === null);
      done();
    });
  });
});

describe('Updating a Dvd', () => {
  let dvd;

  beforeEach((done) => {
    dvd = new Dvd({title: 'Doctor Strange', rating: 5, fileUrl: 'http://videos/Doctor_Strange.mkv'});
    dvd.save()
      .then(() => done());
  });

  it('instance type using set and save', (done) => {
    dvd.set({playbackTime: 30});
    dvd.save()
      .then(() => Dvd.find({}))
      .then((dvds) => {
        assert(dvds.length === 1);
        assert(dvds[0].playbackTime === 30);
        done();
      });
  });

  it('instance can update', (done) => {
    dvd.update({playbackTime: 45})
    .then(() => Dvd.find({}))
    .then((dvds) => {
      assert(dvds.length === 1);
      assert(dvds[0].playbackTime === 45);
      done();
    });
  });

  it('can use the model class to update', (done) => {
    Dvd.update({title: 'Doctor Strange'}, {playbackTime: 50})
    .then(() => Dvd.find({}))
    .then((dvds) => {
      assert(dvds.length === 1);
      assert(dvds[0].playbackTime === 50);
      done();
    });
  });

  it('can use the model to find and udpate one', (done) => {
    Dvd.findOneAndUpdate({title: 'Doctor Strange'}, {playbackTime: 60})
    .then(() => Dvd.find({}))
    .then((dvds) => {
      assert(dvds.length === 1);
      assert(dvds[0].playbackTime === 60);
      done();
    });
  });

  it('updates the updatedAt property, and not the createdAt property', (done) => {
    const { createdAt, updatedAt } = dvd;

    Dvd.findOneAndUpdate({title: 'Doctor Strange'}, {playbackTime: 70})
    .then(() => Dvd.find({}))
    .then((dvds) => {
      assert(dvds.length === 1);
      assert(createdAt.getTime() === dvds[0].createdAt.getTime());
      assert(updatedAt.getTime() !== dvds[0].updatedAt.getTime());
      done();
    });
  });
});
