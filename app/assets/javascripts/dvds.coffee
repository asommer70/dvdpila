ready_dvd = ->
  #
  # Handle Form actions.
  #
  # Display the image to be uploaded.
  $('#dvd_image').on 'change', (e) ->
    readURL(this);

  # Set the abstract_txt field hieght to match the text.
  $('#dvd_abstract_txt').height($('#dvd_abstract_txt').prop('scrollHeight'))


  #
  # Handle Player actions.
  #
  # Save playback_time when paused.
  $('.player').on 'pause', (e) ->
    $player = $(this)
    $player.focus()

    # Do some Maths on the playback time.
    videoTime = getVideoTime(this.currentTime)

    # Determine the put URL.
    if $player.hasClass('episode')
      url = '/episodes/'
      type = 'episode'
    else
      url = '/dvds/'
      type = 'dvd'

    url += $player.data().id + '.json'

    # Update timer fields.
    $.each $('.timer'), (idx, timer) ->
      $timer = $(timer)
      $timer.val(videoTime)

      # Set the first Option in the Bookmark dropdown's text.
      if $timer.prop('nodeName') == 'OPTION'
        $timer.text(Math.floor(videoTime))

    # Do the putting.
    $.ajax({
      url: url,
      method: 'put',
      data: type + '[playback_time]=' + videoTime
    })

  # Start playing at the playback_time.
  $('.player').on 'play', (e) ->
    self = this
    self.focus()
    $player = $(this)

    videoTime = getVideoTime(this.currentTime)

    if $player.hasClass('episode')
      url = '/episodes/'
    else
      url = '/dvds/'

    $.get(url + $player.data().id + '.json').then (data) ->
        self.currentTime = data.playback_time;
        self.play()


  # Play and pause on space bar.
  $('.player').on 'keyup', (e) ->
    player = $('.player')[0]

    if (e.keyCode == 32 && player.paused == true)
      player.play()
    else if (e.keyCode == 32 && player.paused == false)
      player.pause()

  # Reset the playback_time to 0 when the movie has reached the end.
  $('.player').on 'ended', (e) ->
    $player = $(this)

    $.ajax({
      url: '/dvds/' + $player.data().id + '.json',
      method: 'put',
      data: 'dvd[playback_time]=' + 0
    })

  # Play and Pause when video element is clicked.
  $('.player').on 'click', (e) ->
    player = $(this)[0]

    if (player.paused == true)
      player.play()
    else if (player.paused == false)
      player.pause()

  # Seek to bookmark and play video.
  $('.bookmarks-select').on 'change', (e) ->
    $selected_bookmark = $($(this).find(':selected'))

    if $selected_bookmark.data().dvd?
      $player = $("*[data-dvd='#{$selected_bookmark.data().dvd}']")[0]
    else if $selected_bookmark.data().episode?
      $player = $("*[data-episode='#{$selected_bookmark.data().episode}']")[0]

    $player.currentTime = $selected_bookmark.data().time
    $($player).unbind('play')
    $player.play()


  #
  # Toggle elements with an id attribute designated by the event target's data-exposer attribute.
  #
  $('.hider').on 'click', (e) ->
    e.preventDefault()
    $('#' + $(this).data().exposer).toggle()


@getVideoTime = (time) ->
  hours = Math.floor(time / 3600)
  minutes = Math.floor(time / 60)
  if (minutes > 59)
    minutes = Math.floor(time / 60) - 60

  seconds = Math.round(time - minutes * 60)
  if (seconds > 3599)
    seconds = Math.round(time - minutes * 60) - 3600

  return time

@readURL = (input) ->
#
# Read the contents of the image file to be uploaded and display it.
#
  if (input.files && input.files[0])
    reader = new FileReader()

    reader.onload = (e) ->
      $img = $('<img id="dynamic">')
      $img.attr('src', e.target.result)
      $img.appendTo('.image_to_upload')

    reader.readAsDataURL(input.files[0]);



# Fire the ready function on load and refresh.
$(document).ready(ready_dvd)
$(document).on('page:load', ready_dvd)