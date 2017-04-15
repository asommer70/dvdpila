const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect('mongodb://localhost/dvdpila_test');
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (err) => console.warn('mongoose.connection err:', err));
});

beforeEach((done) => {
  mongoose.connection.collections.dvds.drop(() => {
    done();
  });
});
