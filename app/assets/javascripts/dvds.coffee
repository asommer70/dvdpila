ready_dvd = ->
  # Display the image to be uploaded.
  $('#dvd_image').on 'change', (e) ->
    readURL(this);


@readURL = (input) ->
#
# Read the contents of the image file to be uploaded and display it.
#
  if (input.files && input.files[0])
    reader = new FileReader()

    reader.onload = (e) ->
      console.log('e.target:', e.target)

      $img = $('<img id="dynamic">')
      $img.attr('src', e.target.result)
      $img.appendTo('.image_to_upload')

    reader.readAsDataURL(input.files[0]);



# Fire the ready function on load and refresh.
$(document).ready(ready_dvd)
$(document).on('page:load', ready_dvd)