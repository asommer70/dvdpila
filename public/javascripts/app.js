$(document).foundation();

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
  })
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

// Get the Bookmarks and Episodes before creating the MediaElement.
if ($('#player').length !== 0) {
  $.ajax({
    method: 'get',
    url: '/api/dvds/' + $('#player').data().dvdid,
    success: function(data) {
      var times = data.dvd.bookmarks.map(function(bookmark) { return bookmark.time });

      $('#player').mediaelementplayer({
        pluginPath: "/javascripts/plugins/",
        features: ['playpause', 'current', 'progress', 'duration', 'speed', 'fullscreen', 'markers'],
        markers: times,
        success: function(mediaElement, originalNode) {
          // Get playbackTime
          $(mediaElement).on('loadedmetadata', function(e) {
            $.ajax({
              method: 'get',
              url: '/api/dvds/' + $(originalNode).data().dvdid,
              success: function(data) {
                originalNode.currentTime = data.dvd.playbackTime;
              },
              error: function(err) {
                console.log('DVD GET err:', err);
              }
            });
          });

          // Save playbackTime.
          $(mediaElement).on('pause', function() {
            updatePlaybackTime(originalNode.currentTime, $(originalNode).data().dvdid);
          });

          // Save playback if page is refreshed, or navigated away from.
          $(window).on('beforeunload', function() {
            updatePlaybackTime(originalNode.currentTime, $(originalNode).data().dvdid);
          });

          // Reset playbackTime to 0 when video has 'ended'.
          $(mediaElement).on('ended', function() {
            updatePlaybackTime(0, $(originalNode).data().dvdid);
          });
        }
      });
    }
  });

  // Update MediaElement playbackTime when Bookmark link is clicked.
  $('.bookmark').on('click', function(e) {
    e.preventDefault();

    $('#player')[0].currentTime = $(this).data().time;
  });
}

function updatePlaybackTime(playbackTime, dvdId) {
  $.ajax({
    url: '/api/dvds/' + dvdId,
    method: 'put',
    data: JSON.stringify({playbackTime: playbackTime}),
    cache: false,
    dataType: 'json',
    headers: {"Content-Type": "application/json"},
    processData: false,
    contentType: false,
    success: function(res) {
    },
    error: function(err) {
      console.log('DVD Update err:', err);
    }
  });

  // Set the value of the #bookmark_time input.
  $('#bookmark_time').val(playbackTime);
}
