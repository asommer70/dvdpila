class PlayingsController < WebsocketRails::BaseController
  before_action :set_playing

  def connected
    puts "Client connected to socket... #{message.inspect}"
    @dvds = Dvd.order('updated_at DESC').paginate(:page => params[:page], :per_page => 3).as_json
    send_message :dvds, @dvds
  end

  def play
    puts 'Playing...'
    @playing.update(status: 'play')
    send_message :playing_success, @playing
  end

  def remote_play
    puts "remote_play message: #{message.inspect}"
    puts "@playing: #{@playing.inspect}"
    # send_message :play_now, @playing
    WebsocketRails[:remote].trigger 'play_now', @playing
  end

  def remote_pause
    WebsocketRails[:remote].trigger 'pause_now', @playing
  end

  def remote_previous
    WebsocketRails[:remote].trigger 'previous_now', @playing
  end

  def remote_advance
    WebsocketRails[:remote].trigger 'advance_now', @playing
  end

  def pause
    # Need to check for stop status cause a Pause is sent when DVD is page is left and video is playing.
    if (@playing.status != 'stop')
      @playing.update(status: 'pause')
      send_message :pause_success, @playing
    end
  end

  def stop
    @playing.update(status: 'stop')
    send_message :stop_success, @playing
  end

  def now
    # Find the last updated DVD and check it's status
    playing = Playing.order('updated_at').last
    if playing && playing.status != 'stop'
      send_message :now_playing, playing
    else
      send_message :now_playing, 'nothing'
    end
  end

  private
    def set_playing
      @dvd = Dvd.find(message[:id]) if message[:type] == 'dvd'
      @episode = Episode.find(message[:id]) if message[:type] == 'episode'
      if @dvd
        @playing = Playing.where(dvd: @dvd).last
      else
        @playing = Playing.where(episode: @episode).last
      end

      unless @playing
        @playing = Playing.new(dvd: @dvd, status: 'play', episode: @episode)

        if
          @playing.save
          send_message :playing_success, @playing
        else
          send_message :playing_fail, @playing
        end
      end
    end
end
