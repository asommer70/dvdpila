App = Ember.Application.create();
App.ApplicationStore = DS.Store.extend({
  adapter: 'App.ApplicationAdapter'
});

var attr = DS.attr,
    hasMany = DS.hasMany,
    belongsTo = DS.belongsTo;

App.ApplicationAdapter = DS.RESTAdapter.extend({});

App.Search = DS.Model.extend({
  title: attr('string'),
});

App.Router.map(function() {
  this.resource('about');
  this.resource('dvd', { path: ':dvd_id' });
  //this.resource("dvds", function() {
  //  this.route("dvd", { path: ':dvd_id' });
  //});
  this.route("search", { path: "/dvds/search/:query" })
});

/*App.ApplicationSerializer = DS.RESTSerializer.extend({
  keyForRelationship: function(key, relationship) {
    return 'dvd_id';
  }
});*/


App.Dvd = DS.Model.extend({
  init: function() {
    this._super();
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
  search: attr('string'),
  //episodes: DS.hasMany('episode', {async:true}),

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
      statusCode: {
        500: function(dvd) {
          App.FlashQueue.pushFlash('error', "Problem uploading file to server, please check the file type.");
        }
      }
    });
    return this.get('uploadPromise');
  },

  episodes: DS.hasMany('episode'),
  tags: DS.hasMany('tags'),
});

App.Episode = DS.Model.extend({
  name: attr('string'),
  episode_file_url: attr('string'),
  //dvds_id: attr('number'),
  dvd_id: attr('number'),
  file_url: function() {
    return this.get('episode_file_url');
  }.property('file_url'),
  //dvd: DS.belongsTo('dvd', {key: "dvd_id"})
  dvd: DS.belongsTo('dvd'),
});

App.Tag = DS.Model.extend({
  name: attr('string'),
  dvds: DS.hasMany('dvd'),
});


App.IndexController = Ember.ArrayController.extend({
  isEditing: false,
  isAdding: false,

  titleFilter: null,

  sortProperties: ['title'],
  sortAscending: true,
  
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
    /*pageOne: function() {
      // Filter from the first page.
      console.log('sending to page 1...');
      this.send('selectPage', 1);
    },*/

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
          //console.log(dvd);
          if (dvd.get('created_by') == 'error') {
            App.FlashQueue.pushFlash('error', dvd.get('title'));
          } else {
            self.set('title', '');
            self.set('created_by', '');
            self.set('rating', '');
            self.get('model').set('isAdding', false);
            App.FlashQueue.pushFlash('notice', dvd.get('title') + " added to your Pila.");
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

});

App.SearchBox = Ember.TextField.extend({
  insertNewline: function(event) {
    var query = this.get('value');
    App.searchResultsController.search(query);
  },

  focusIn: function(event) {
    //console.log("Search focussed...");
    var $search = $(event.target);

    if ($search.val() != '') {
      App.searchResultsController.set('searchResults', true);
      App.searchResultsController.set('searchResults', false);
    }
  },
});

App.searchResultsController = Ember.ArrayController.create({
//App.searchResultsController = Ember.ArrayController.extend({
  searchResults: false,
  isSearching: false,
  //hasPages: false,

  search: function(query) {
    //console.log('searching...');
    if (query == '') {
      this.set('searchResults', false);
      return;
    }

    var self = this;
    this.set('isSearching', true);

    $.get('/dvds/search/' + query).then(function(dvd) {
      self.set('content', JSON.parse(dvd).dvds);
      self.set('searchResults', true);
      self.set('isSearching', false);
    });

  },

});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('dvd');
  },

  actions: {
    pageOne: function() {
      // Clear search results if there are any.
      if ($('.search').val() != '') {
        App.searchResultsController.set('searchResults', false);
        $('.search').val('');
      }

      //console.log('sending to page 1...');
      
      // Go to the first page.
      this.controller.send('selectPage', 1);
    },
  },
});

App.DvdRoute = Ember.Route.extend({
  model: function(params) {
    var dvd = this.store.find('dvd', params.dvd_id);
    //console.log(dvd);
    return dvd;
  },
  actions: {
    pageOne: function() {
      // Filter from the first page.
      //this.controller.send('selectPage', 1);
      this.transitionTo('index');
    },
  }
});

App.DvdController = Ember.ObjectController.extend({
  isEditing: false,
  isAddingEpisodes: false,
  currentPage: Ember.computed.alias('parentController.page'),
        
  activePage: (function() {
    return this.get('number') === this.get('currentPage');
  }).property('number', 'currentPage'),

  searchResults: (function() {
    if (App.searchResultsController.isSearching) {
      this.transitionToRoute('index');
    }
  }).observes('App.searchResultsController.searchResults'),

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    cancelEditing: function() {
      this.set('isEditing', false);
    },

    addEpisode: function() {
      this.set('isAddingEpisodes', true);
      $('#add-name').focus();
    },

    cancelAddingEpisode: function() {
      this.set('isAddingEpisodes', false);
    },

    saveDvd: function() {
      var model = this.get('model');
      var self = this;

      //console.log('saving edit...');
      if (validateRating(this.get('model').get('rating'), App)) {
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
        model.uploadFile();
      }
    },

    saveNewEpisode: function() {
      console.log("Saving New Episode...");
      
      var self = this;
      var episode = this.get('store').createRecord('episode', {
          name: this.get('name'),
          episode_file_url: this.get('episode_file_url'),
          dvd_id: this.get('id')
          //dvds_id: this.get('id'),
      });

      episode.save().then(function(new_episode) {
        //console.log(new_episode);
        self.set('name', '');
        self.set('episode_file_url', '');
        self.set('isAddingEpisodes', false);
        self.get('episodes').pushObject(new_episode); 
        App.FlashQueue.pushFlash('notice', new_episode.get('name') + " added to your Pila.");
      });
    },

    delete: function(context) {
      var dvd = this.get('content');
      this.get('model').destroyRecord();

      dvd.one('didDelete', this, function () {
        App.FlashQueue.pushFlash('notice', dvd.get('title') + " successfully deleted.");
        this.transitionToRoute('index');
      });
    },

    deleteEpisode: function(episode_id) {
      console.log("episode id:", episode_id);
      //var episode = this.get('episodes').get('content')[episode_id];
      var episode = this.get('episodes').get('content').findBy("id", episode_id);
      console.log(episode);

      //console.log(episode.get("episodes").get('content'));
      
      episode.destroyRecord();

      episode.one('didDelete', this, function () {
        App.FlashQueue.pushFlash('notice', episode.get('name') + " successfully deleted.");
      });
    },

    addTag: function() {
      console.log("Adding Tag...");
      this.set('isAddingTag', true);
    },

    cancelAddingTag: function() {
      this.set('isAddingTag', false);
    },

    saveTag: function() {
      console.log("Saving Tag...");
      var self = this;
      var tag_field = this.get('tag');

      // Find new tag.
      this.store.find('tag', { name: tag_field }).then(function(tag) {
        //var tag_in_store = this.store.find('tag', 5);
        console.log("tag_in_store:", tag);
        if (tag.objectAt(0).get('name') != "false") {
          self.get('tags').pushObject(tag.objectAt(0));
            self.model.save().then(function(tag) {
              console.log("Tag saved...");

              App.FlashQueue.pushFlash('notice', tag.get('name') + " successfully added.");
              self.set('tag', '');
              self.set('isAddingTag', false);
            });
        } else {
          // If tag isn't in database add it then update the DVD.
          var new_tag_record = self.get('store').createRecord('tag', {
              name: tag_field,
          });

          new_tag_record.save().then(function(new_tag) {
            //console.log(tag);
            self.get('tags').pushObject(new_tag);

            self.model.save().then(function(tag) {
              console.log("Tag saved...");

              App.FlashQueue.pushFlash('notice', "Tag: " + new_tag.get('name') + " successfully added.");
              self.set('tag', '');
              self.set('isAddingTag', false);
            });
          });
        }
      });
    },

    removeTag: function(tag_id) {
      console.log("Removing tag_id: ", tag_id);
      this.get('tags').removeAt(tag_id);
      this.model.save();
    },
  }
});

App.EpisodeController = Ember.ObjectController.extend({
  isEditing: false,
  isEditingEpisode: false,
  actions: {
    editEpisode: function() {
      console.log("Edit Episode...");
      this.set('isEditingEpisode', true);
    },

    cancelEditingEpisode: function() {
      this.set('isEditingEpisode', false);
    },

    saveEpisode: function() {
      console.log("Saving Episode...");
      var self = this;

      this.model.save().then(function(episode) {
        console.log("Episode saved...");
        App.FlashQueue.pushFlash('notice', episode.get('name') + " successfully updated.");
        self.set('isEditingEpisode', false);
      });
    },

  }
});

App.TagController = Ember.ObjectController.extend({
  isAddingTag: false,

  actions: {
    addTag: function() {
      console.log("Adding Tag...");
      this.set('isAddingTag', true);
    },

    cancelAddingTag: function() {
      this.set('isAddingTag', false);
    },

    saveTag: function() {
      console.log("Saving Tag...");
      var self = this;

      this.model.save().then(function(tag) {
        console.log("Tag saved...");
        App.FlashQueue.pushFlash('notice', tag.get('name') + " successfully added.");
        self.set('isAddingTag', false);
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

App.Video = Ember.View.extend({
  attributeBindings: ['src', 'controls'],
  src: Ember.computed.alias('context.file_url'),
  vidId: Ember.computed.alias('context.id'),
  dvd_id: Ember.computed.alias('context.dvd_id'),
  controls: true,
  tagName: 'video',

  keyUp: function(event) {
    var $vid = $(event.target)[0];

    console.log('keyUp play/pause...');

    if (event.keyCode == 32 && $vid.paused == true) {
          $vid.play();
    } else if (event.keyCode == 32 && $vid.paused == false) {
          $vid.pause();
    }
  },

  didInsertElement: function() {
    //console.log('didInsertElement...');

    // Get the DVD id.
    var vid_id = this.get('vidId');
    var dvd_id = this.get('dvd_id');
    var vid = this.$();

    this.$().on("pause", function(event) {
      this.focus();
      //console.log('paused...');
      //console.log(this.currentTime);
      var self = this;

      // Send time location to server.
      if (dvd_id == undefined) {
        $.post('/dvds/playback/' + vid_id, { playback_time: this.currentTime });
      } else {
        $.post('/episodes/playback/' + vid_id, { playback_time: this.currentTime });
      }

      // Play on space.
      /*$('body').off('keyup');
      $('body').keyup(function(event) {
        console.log('playing...');
        event.preventDefault();
        if (event.keyCode == 32 && self.paused == true) {
          self.play();
        } else {
          $('body').off('keyup');
        }
      });*/
    });

    this.$().on("play", function(event) {
      this.focus();

      //console.log('playing...');

      var self = this;
      if (dvd_id == undefined) {
        $.get('/dvds/playback/' + vid_id).then(function(data) {
          //console.log(data);
          self.currentTime = data;
          self.play();
        });
      } else {
        $.get('/episodes/playback/' + vid_id).then(function(data) {
          //console.log(data);
          self.currentTime = data;
          self.play();
        });
      }

      // Pause on space.
      /*$('body').off('keyup');
      $('body').keyup(function(event) {
        console.log('paused...');
        event.preventDefault();
        if (event.keyCode == 32) {
          self.pause();
        } else {
          $('body').off('keyup');
        }
      });*/
    });

  },
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
  $('.fancybox').fancybox();

  var menu = $('#navigation-menu');
  var menuToggle = $('#js-mobile-menu');
  var signUp = $('.sign-up');

  $(menuToggle).on('click', function(e) {
    e.preventDefault();
    console.log('menu click...');
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
