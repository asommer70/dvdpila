const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect('mongodb://localhost/dvdpila_test');
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (err) => console.warn('mongoose.connection err:', err));
});

beforeEach((done) => {
  const { dvds, tags } = mongoose.connection.collections;

  dvds.drop()
    .then(() => {
      tags.drop()
        .then(() => done())
        .catch(() => done());
    })
    .catch(() => done());
});
