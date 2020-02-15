$(document).foundation();

// Display/hide the x button inside the tag pill.
$('.tag-name').hover(function(e) {
  $($(this).children()[0]).toggleClass('hide');
}, function() {
  $($(this).children()[0]).toggleClass('hide');
});

$('.remove-tag').on('click', function(e) {
  e.preventDefault();
  var url = '/api/tags/' + $(this).data().dvdid + '/' + $(this).data().tagid;

  $.ajax({
    url: url,
    method: 'delete',
    success: function(res) {
      window.location.reload();
    },
    error: function(err) {
      console.log('DVD Delete err:', err);
    }
  })
});

$('.remove-bookmark').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var url;
  if ($this.data().mediatype == 'dvd') {
    url = '/api/bookmarks/' + $this.data().mediaid + '/' + $this.data().bookmarkid;
  } else {
    url = '/api/episode/bookmarks/' + $this.data().dvdid + '/' + $this.data().mediaid + '/' + $this.data().bookmarkid;
  }

  $.ajax({
    url: url,
    method: 'delete',
    success: function(res) {
      window.location.reload();
    },
    error: function(err) {
      console.log('DVD Delete err:', err);
    }
  })
});

// Display the image to be uploaded.
$('#dvd_image').on('change', function(e) {
  window.image = e.target.files[0];
  readURL(this);
});

function readURL(input) {
  //
  // Read the contents of the image file to be uploaded and display it.
  //
  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.onload = function(e) {
      $('.image_to_upload').attr('src', e.target.result);
      $preview = $('.preview');

      if ($preview.hasClass('hide')) {
        $preview.toggleClass('hide');
      }
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$('a.delete').on('click', function(e) {
  e.preventDefault();

  $.ajax({
    url: '/api/dvds/' + $(this).data().dvdid,
    method: 'delete',
    success: function(res) {
      window.location = window.location.origin;
    },
    error: function(err) {
      console.log('DVD Delete err:', err);
    }
  });
});

$('button.delete-episode').on('click', function(e) {
  e.preventDefault();

  if (confirm("Really DELETE episode?")) {
    $.ajax({
      url: '/api/episode/' + $(this).data().dvdid + '/' + $(this).data().episodeid,
      method: 'delete',
      success: function(res) {
        location.reload();
      },
      error: function(err) {
        console.log('Episode Delete err:', err);
      }
    });
  }
});

$('.editform').submit(function(e) {
  e.preventDefault();
  $this = $(this);

  var data = new FormData($this[0]);
  if (window.image) {
    $.each(window.image, function(key, value) {
      data.append(key, value);
    });
  }

  $.ajax({
    url: '/api/dvds/' + $this.data().dvdid,
    method: 'put',
    data: data,
    cache: false,
    dataType: 'json',
    processData: false,
    contentType: false,
    success: function(res) {
      window.location = window.location.origin + '/dvds/' + $this.data().dvdid
    },
    error: function(err) {
      console.log('DVD Update err:', err);
    }
  })
});

// Get DVD info from Wikipedia.
$('#title').on('blur', function(e) {
  if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] != 'edit')
    $.ajax({
      url: '/wikiSearch',
      method: 'post',
      data: 'title=' + $('#title').val(),
      success: function(data) {
        console.log('data:', data);
        var $wikipedia_data = $('#wikipedia_data');

        $wikititle = $('.wikititle');
        if ($wikititle.hasClass('hide')) {
          $wikititle.toggleClass('hide');
        }

        data[1].forEach(function(entry, idx) {
          var li = '<li>';
          li += '<a href="' + data[3][idx] + '" class="wikilink" data-idx="' + idx + '">';
          li += entry;
          li += '</a>'
          li += '</li>';
          $wikipedia_data.append(li);
        });

        $('.wikilink').on('click', function(e) {
          e.preventDefault();
          var $this = $(this);

          $.ajax({
            url: '/wikiData',
            method: 'post',
            data: 'pageUrl=' + data[3][$this.data().idx],
            success: function(data) {
              $('#abstractSource').val('Wikipedia');
              $('#abstracTxt').val(data.plot).height($('#abstracTxt').prop('scrollHeight'));
              $('#abstractUrl').val(data.pageUrl);

              $('.image_to_upload').attr('src', data.imageUrl);
              $preview = $('.preview');
              if ($preview.hasClass('hide')) {
                $preview.toggleClass('hide');
              }
              if (data.imageUrl) {
                $('#imageUrl').val(data.imageUrl);
              }
              $flash = $('.flash');
              if (!$flash.hasClass('hide')) {
                $flash.toggleClass('hide');
              }
            },
            error: function(err) {
              $flash = $('.flash');
              if ($flash.hasClass('hide')) {
                $flash.toggleClass('hide');
              }
              $flash.html(err.responseText);
            }
          });
        });
      }
    });
});


// Get the Bookmarks and Episodes before creating the MediaElement.
if ($('.player').length !== 0) {
  var parts = window.location.pathname.split('/');
  var dvdId = parts[parts.length - 1];

  $.ajax({
    method: 'get',
    url: '/api/dvds/' + dvdId,
    success: function(data) {
      var times = {};
      if (!data.dvd.episodes.length) {
        times[data.dvd._id] = data.dvd.bookmarks.map(function(bookmark) { return bookmark.time });
      } else {
        data.dvd.episodes.map(function(episode) {
          times[episode._id] = episode.bookmarks.map(function(bookmark) { return bookmark.time })
        });
      }

      $.each($('.player'), function(idx, player) {
        $(player).mediaelementplayer({
          pluginPath: "/javascripts/plugins/",
          features: ['playpause', 'current', 'progress', 'duration', 'speed', 'fullscreen', 'markers'],
          markers: times[$(player).data().mediaid],
          success: function(mediaElement, originalNode) {
            $originalNode = $(originalNode);
            $mediaElement = $(mediaElement);

            var url;
            if ($originalNode.data().mediatype == 'episode') {
              url = '/api/dvds/' + $originalNode.data().dvdid + '/episode/' + $originalNode.data().mediaid;
            } else {
              url = '/api/dvds/' + $originalNode.data().mediaid;
            }

            // Get playbackTime
            $mediaElement.on('loadedmetadata', function(e) {
              $.ajax({
                method: 'get',
                url: url,
                success: function(data) {
                  if (data.episode) {
                    originalNode.currentTime = data.episode.playbackTime;
                  } else {
                    originalNode.currentTime = data.dvd.playbackTime;
                  }
                },
                error: function(err) {
                  console.log('DVD GET err:', err);
                }
              });
            });

            // Save playbackTime.
            $mediaElement.on('pause', function() {
              updatePlaybackTime(originalNode.currentTime, url);
            });

            // Save playback if page is refreshed, or navigated away from.
            // $(window).on('beforeunload', function() {
            //   updatePlaybackTime(originalNode.currentTime, $(originalNode).data().dvdid);
            // });

            // Reset playbackTime to 0 when video has 'ended'.
            $(mediaElement).on('ended', function() {
              updatePlaybackTime(0, url);
            });
          }
        });
      });
    }, // end get dvd/:id success function
    error: function(req, status, err) {
      console.log('GET dvd err:', err, 'status:', status);
    }
  });

  // Update MediaElement playbackTime when Bookmark link is clicked.
  $('.bookmark').on('click', function(e) {
    e.preventDefault();
    $this = $(this);
    var mediaId = $this.data().mediaid;
    $('video[data-mediaid="' + mediaId + '"]')[0].currentTime = $this.data().time;
  });
}

function updatePlaybackTime(playbackTime, url) {
  $.ajax({
    url: url,
    method: 'put',
    data: JSON.stringify({playbackTime: playbackTime}),
    cache: false,
    dataType: 'json',
    headers: {"Content-Type": "application/json"},
    processData: false,
    contentType: false,
    success: function(res) {
      // console.log('updatePlaybackTime success res:', res);
    },
    error: function(err) {
      console.log('DVD/Episode Update err:', err);
    }
  });

  // Set the value of the #bookmark_time_$mediaId input.
  var parts = url.split('/');
  var mediaId = parts[parts.length - 1];
  $('#bookmark_time_' + mediaId).val(playbackTime);
}
