class PlayingsController < WebsocketRails::BaseController
  before_action :set_playing

  def connected
    dvds = Dvd.order('updated_at DESC').paginate(:page => params[:page], :per_page => 5).as_json
    send_message :dvds, dvds
  end

  def play
    @playing.update(status: 'play')
    send_message :playing_success, @playing
    WebsocketRails[:browser].trigger 'play_now', @playing
  end

  def pause
    # Need to check for stop status cause a Pause is sent when DVD is page is left and video is playing.
    if (@playing.status != 'stop')
      @playing.update(status: 'pause')
      send_message :pause_success, @playing
      WebsocketRails[:browser].trigger 'pause_now', @playing
    end
  end

  def stop
    @playing.update(status: 'stop')
    send_message :stop_success, @playing
    WebsocketRails[:browser].trigger 'stop_now', @playing
  end

  def now
    # Find the last updated DVD and check it's status
    puts 'Executing now...'
    playing = Playing.order('updated_at').last
    puts "now playing: #{playing.inspect}"
    # if playing && playing.status != 'stop'
      send_message :now_playing, playing
    # else
    #   send_message :now_playing, 'nothing'
    # end
  end

  def new_now
    puts "new_now #{@playing.inspect}"
    @playing.update(status: 'pause')
    WebsocketRails[:remote].trigger 'new_now', @playing
    send_message :now_playing, @playing
  end

  def remote_play
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
