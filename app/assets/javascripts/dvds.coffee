ready_dvd = ->
  #
  # Handle Form actions.
  #
  # Display the image to be uploaded.
  $('#dvd_image').on 'change', (e) ->
    readURL(this);

  # Set the abstract_txt field hieght to match the text.
  $('#dvd_abstract_txt').height($('#dvd_abstract_txt').prop('scrollHeight'))

  # Display the image to be uploaded.
  $('#dvd_image').on 'change', (e) ->
    readURL(this);

  $('#dvd_title').on 'blur', ->
    console.log('Getting info...')
    if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] != 'edit')
      $.ajax({
        url: '/ddg'
        method: 'post',
        data: 'title=' + $('#dvd_title').val()
      }).success (data) ->
        console.log('data:', data)
        if (data.status == 'success')
          $('#dvd_abstract_source').val(data.ddg.abstract_source)
          $('#dvd_abstract_txt').val(data.ddg.abstract_txt).height($('#dvd_abstract_txt').prop('scrollHeight'))
          $('#dvd_abstract_url').val(data.ddg.abstract_url)
          $('.image_to_upload').attr('src', data.ddg.image_url)
          $preview = $('.preview')
          if $preview.hasClass('hide')
            $preview.toggleClass('hide');

  #
  # Handle Player actions.
  #
  if $('.player').length > 0
    #
    # Disable spacebar paging.
    #
    if $('video').length != 0
      $(window).on 'keydown', (e) ->
        return !(e.keyCode == 32);

    # Save playback_time when paused.
    $('.player').on 'pause', (e) ->
      this.focus()
      $player = $(this)
      $player.focus()

      # Do some Maths on the playback time.
      videoTime = getVideoTime(this.currentTime)

      # Determine the put URL.
      if $player.hasClass('episode')
        url = '/episodes/' + $player.data().episode + '.json'
        type = 'episode'
      else
        url = '/dvds/' + $player.data().dvd + '.json'
        type = 'dvd'

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
      }).then () ->
        $('.player').on 'play', (e) ->
          play_location(this)

    # Start playing at the playback_time.
    .on 'play', (e) ->
      this.focus()
      play_location(this)

    # Play and pause on space bar.
    .on 'keyup', (e) ->
      this.focus()
      e.preventDefault()
      e.stopPropagation()
      player = $('.player')[0]

      if (e.keyCode == 32 && player.paused == true)
        player.play()
      else if (e.keyCode == 32 && player.paused == false)
        player.pause()

    # Scroll playback time forward and backward with the Arrow keys.
    .on 'keydown', (e) ->
      player = $('.player')[0]

      if (e.keyCode == 39)
        player.currentTime += 1
      else if (e.keyCode == 37)
        player.currentTime -= 1

    # Play and Pause when video element is clicked.
    .on 'click', (e) ->
      $('.player').focus()
      player = $(this)[0]
      $player = $(player)
      $player.focus()

      if $player.attr('src') != undefined
        if (player.paused == true)
         player.play()
        else if (player.paused == false)
         player.pause()
      else
        if $player.hasClass('episode')
          url ='/episodes/' + $player.data().episode + '.json'
        else
          url = '/dvds/' + $player.data().dvd + '.json'

        $.ajax({
          url: url,
        }).then (data) ->
          $player.prop('controls', true)
          $player.prop('src', data.file_url)
          $player.removeAttr('poster')

          if (player.paused == true)
            player.play()
          else if (player.paused == false)
            player.pause()

    # Seek the video on scroll.
    .on 'wheel', (e) ->
      e.preventDefault()
      e.stopPropagation()
      player = $(this)[0]
      $player = $(player)
      $player.focus()

      if e.originalEvent.wheelDelta > 0
        player.currentTime += 1
      else
        player.currentTime -= 1

    .on 'dblclick', (e) ->
      e.preventDefault()
      e.stopPropagation()
      player = $(this)[0]
      $player = $(player)
      $player.focus()

      toggleFullScreen(player)

    .on 'ended', (e) ->
      $player = $(this)

      if $player.hasClass('episode')
        url = '/episodes/' + $player.data().episode + '.json'
      else
        url = '/dvds/' + $player.data().dvd + '.json'

      $.ajax({
        url: url,
        method: 'put',
        data: 'dvd[playback_time]=' + 0
      })


  # Seek to bookmark and play video.
  $('.bookmarks-select').on 'change', (e) ->
    $selected_bookmark = $($(this).find(':selected'))

    if $selected_bookmark.data().dvd?
      player = $("*[data-dvd='#{$selected_bookmark.data().dvd}']")[0]
    else if $selected_bookmark.data().episode_id?
      player = $("*[data-episode='#{$selected_bookmark.data().episode_id}']")[0]

    $player = $(player)
    player.currentTime = $selected_bookmark.data().time
    $player.unbind('play')

    if $player.attr('src')?
      player.play()
    else
      if $player.hasClass('episode')
        url ='/episodes/' + $player.data().episode + '.json'
      else
        url = '/dvds/' + $player.data().dvd + '.json'

      $.ajax({
        url: url,
      }).then (data) ->
        $player.prop('controls', true)
        $player.prop('src', data.file_url)
        $player.removeAttr('poster')
        player.play()


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


@play_location = (video) ->
  video.focus()
  self = video
  $player = $(video)

  videoTime = getVideoTime(video.currentTime)

  if $player.hasClass('episode')
    url = '/episodes/' + $player.data().episode + '.json'
  else
    url = '/dvds/' + $player.data().dvd + '.json'

  $.get(url).then (data) ->
    self.currentTime = data.playback_time;
    self.play()


@readURL = (input) ->
  #
  # Read the contents of the image file to be uploaded and display it.
  #
  if (input.files && input.files[0])
    reader = new FileReader()

    reader.onload = (e) ->
      $('.image_to_upload').attr('src', e.target.result)
      $preview = $('.preview')
      if $preview.hasClass('hide')
        $preview.toggleClass('hide');

    reader.readAsDataURL(input.files[0]);

@toggleFullScreen = (player) ->
  if not document.fullscreenElement && not document.mozFullScreenElement && not document.webkitFullscreenElement &&
  not document.msFullscreenElement
   
    if (player.requestFullscreen)
      player.requestFullscreen()
    else if (player.msRequestFullscreen)
      player.msRequestFullscreen()
    else if (player.mozRequestFullScreen)
      player.mozRequestFullScreen()
    else if (player.webkitRequestFullscreen)
      player.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)

  else
    if (player.exitFullscreen)
     player.exitFullscreen()
    else if (player.msExitFullscreen)
      player.msExitFullscreen()
    else if (player.mozCancelFullScreen)
      player.mozCancelFullScreen()
    else if (player.webkitExitFullscreen)
      player.webkitExitFullscreen()


# Fire the ready function on load and refresh.
$(document).ready(ready_dvd)
$(document).on('page:load', ready_dvd)