class PlayingsController < WebsocketRails::BaseController
  def create
    # The `message` method contains the data received
    puts "message: #{message[:id]}"
    dvd = Dvd.find(message[:id])
    puts "dvd: #{dvd.inspect}"
    playing = Playing.new(dvd: dvd)
    if playing.save
      send_message :create_success, playing
    else
      send_message :create_fail, playing
    end
  end
end
