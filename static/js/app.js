App = Ember.Application.create();
App.ApplicationStore = DS.Store.extend({
  adapter: 'App.ApplicationAdapter'
});

var attr = DS.attr,
    hasMany = DS.hasMany,
    belongsTo = DS.belongsTo;

App.ApplicationAdapter = DS.RESTAdapter.extend({});

App.Dvd = DS.Model.extend({
  init: function() {
    this._super();
    //Ember.assert("File to upload required on init.", !!this.get('fileToUpload'));
    this.set('uploadPromise', Ember.Deferred.create());
  },

  title: attr('string'),
  created_by: attr('string'),
  created_at: attr('date'),
  rating: attr('number'),
  abstract_txt: attr('string'),
  abstract_source: attr('string'),
  abstract_url: attr('string'),
  image_url: attr('string'),
  file_url: attr('string'),
  ddg_url: function() {
    return 'https://duckduckgo.com/?q=' + this.get('title');
  }.property('title'),

  uploadFile: function() {
    if(this.get('isUploading') || this.get('didUpload') || this.get('didError')) {
      return this.get('uploadPromise');
    }

    var fileToUpload = $('.dvd-image-upload')[0].files[0]
    if (fileToUpload == undefined) {
      this.set('didUpload', true);
      return;
    }
    this.set('image_url', 'images/' + fileToUpload.name);

    var fd = new FormData();
    var self = this;

    fd.append('success_action_status', '201');
    fd.append('Content-Type', fileToUpload.type);
    fd.append('type', 'file');
    fd.append('file', fileToUpload);

    this.set('isUploading', true);

    $.ajax({
      url: '/dvds/' + this.id,
      type: "POST",
      data: fd,
      paramname: 'file',
      processData: false,
      contentType: false,
    });
    return this.get('uploadPromise');
  },

});

App.Router.map(function() {
  this.resource('about');
  this.resource('dvds', function() {
    this.resource('dvd', { path: ':dvd_id' });
  });
});

App.IndexController = Ember.ArrayController.extend({
  isEditing: false,
  isAdding: false,

  search: '',
  titleFilter: null,

  sortProperties: ['id'],
  sortAscending: false,
  
  page: 1,
  perPage: 10,
  totalPages: (function() {
    return Math.ceil(this.get('length') / this.get('perPage'));
  }).property('length', 'perPage'),

  pages: (function() {
    var collection = Ember.A();

    for(var i = 0; i < this.get('totalPages'); i++) {
      collection.pushObject(Ember.Object.create({
        number: i + 1
      }));
    }

    return collection;
  }).property('totalPages'),

  hasPages: (function() {
    return this.get('totalPages') > 1;
  }).property('totalPages'),

  prevPage: (function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');

    if(page > 1 && totalPages > 1) {
      return page - 1;
    } else {
      return null;
    }
  }).property('page', 'totalPages'),

  nextPage: (function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');

    if(page < totalPages && totalPages > 1) {
      return page + 1;
    } else {
      return null;
    }
  }).property('page', 'totalPages'),


  paginatedContent: (function() {
    var start = (this.get('page') - 1) * this.get('perPage');
    var end = start + this.get('perPage');

    return this.get('arrangedContent').slice(start, end);
  }).property('page', 'totalPages', 'arrangedContent.[]'),

  actions: {
    query: function() {
      // Filter from the first page.
      this.send('selectPage', 1);

      // the current value of the text field
      var query = this.get('search');
      this.set('titleFilter', query);
    },

    add: function() {
      //console.log('adding...');
      this.get('model').set('isAdding', true);
    },

    createDvd: function() {
      //console.log('creating...');
      var self = this;
      if (validateRating(this.get('rating'), App)) {
        var dvd = this.get('store').createRecord('dvd', {
          title: this.get('title'),
          created_by: this.get('created_by'),
          rating: this.get('rating'),
          abstract_txt: this.get('abstract_txt'),
          abstract_source: this.get('abstract_source'),
          abstract_url: this.get('abstract_url'),
          image_url: this.get('image_url'),
          file_url: this.get('file_url'),
        });
        dvd.save().then(function(dvd) {
          console.log(dvd);
          if (dvd.get('created_by') == 'error') {
            App.FlashQueue.pushFlash('error', dvd.get('title'));
          } else {
            self.set('title', '');
            self.set('created_by', '');
            self.set('rating', '');
            self.get('model').set('isAdding', false);
          }
        });
      }
    },

    cancelAdding: function() {
      this.get('model').set('isAdding', false);
    },

    selectPage: function(number) {
      this.set('page', number);
    },

  },

  arrangedContent: function() {
    var search = this.get('search');
    if (!search) { return this.get('content') }

    return this.get('content').filter(function(dvd) {
      var re = new RegExp(search, 'i');
      return dvd.get('title').match(re) != null;
    })
  }.property('content', 'titleFilter'),
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('dvd');
  },
});

App.DvdRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('dvd', params.dvd_id);
  },
});

App.DvdController = Ember.ObjectController.extend({
  isEditing: false,
  currentPage: Ember.computed.alias('parentController.page'),
        
  activePage: (function() {
    return this.get('number') === this.get('currentPage');
  }).property('number', 'currentPage'),

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    cancelEditing: function() {
      this.set('isEditing', false);
    },

    saveDvd: function() {
      var model = this.get('model');
      var self = this;

      //console.log('saving edit...');
      if (validateRating(this.get('model').get('rating'), App)) {
        model.uploadFile();
        model.save().then(function(dvd) {
          //console.log(dvd);
          if (dvd.get('created_by') == 'error') {
            App.FlashQueue.pushFlash('error', dvd.get('title'));
            model.set('title', '');
            model.set('created_by', '');
          } else {
            //console.log('setting isEditing...');
            App.FlashQueue.pushFlash('notice', dvd.get('title') + " updated.  Thank You!");
            self.set('isEditing', false);
          }
        });
      }
    },

    delete: function(context) {
      var dvd = this.get('content');
      this.get('model').destroyRecord();

      dvd.one('didDelete', this, function () {
        this.transitionToRoute('index');
      });
    },

  }
});

App.FotoPreview = Ember.View.extend({
      attributeBindings: ['src'],
      tagName: 'img',
});

App.FotoUp = Ember.TextField.extend({
  type: 'file',

  change: function(evt) {
    console.log(evt.target);
    var input = evt.target;
    if (input.files && input.files[0]) {
      var that = this;

      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        that.set('parentView.content', data);
      }
      reader.readAsDataURL(input.files[0]);
    }
  },
});

App.StarRating = Ember.View.extend({
  classNames: ['rating-panel'],
  templateName: 'star-rating',

  rating: Ember.computed.alias('context.rating'),
  fullStars: Ember.computed.alias('rating'),
  numStars:  Ember.computed.alias('maxRating'),

  stars: function() {
    var ratings = [];
    var fullStars = this.starRange(1, this.get('fullStars'), 'full');
    var emptyStars = this.starRange(this.get('fullStars') + 1, this.get('numStars'), 'empty');
    Array.prototype.push.apply(ratings, fullStars);
    Array.prototype.push.apply(ratings, emptyStars);
    return ratings;
  }.property('fullStars', 'numStars'),

  starRange: function(start, end, type) {
    var starsData = [];
    for (i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    };
    return starsData;
  },

  // Might use this later.
  /*(actions: {
    setRating: function() {
      var newRating = $(event.target).data('rating');
      this.set('rating', newRating);
    }
  },*/
});


Ember.Handlebars.helper('format-date', function(date) {
  var js_date = new Date(date*1000);
  return moment(js_date).fromNow();
});

var validateRating = function(rating, App) {
  if (isNaN(rating)) {
    App.FlashQueue.pushFlash('error', 'Rating has to be a number from 1 - 5.');
    return false;
  } else if (rating < 1 || rating > 5) {
    App.FlashQueue.pushFlash('error', 'Rating has to be a number from 1 - 5.');
    return false;
  } else {
    return true;
  }
}

$(document).ready(function() {
  var menu = $('#navigation-menu');
  var menuToggle = $('#js-mobile-menu');
  var signUp = $('.sign-up');

  $(menuToggle).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle(function(){
      if(menu.is(':hidden')) {
        menu.removeAttr('style');
      }
    });
  });


 // underline under the active nav item
  $(".nav .nav-link").click(function() {
    $(".nav .nav-link").each(function() {
      $(this).removeClass("active-nav-item");
    });
    $(this).addClass("active-nav-item");
    $(".nav .more").removeClass("active-nav-item");
  });
});