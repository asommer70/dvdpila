class PlayingsController < WebsocketRails::BaseController
  before_action :set_playing

  def play
      @playing.update(status: 'play')
      send_message :playing_success, @playing
  end

  def pause
    # Need to check for stop status cause a Pause is sent when DVD is page is left and video is playing.
    if (@playing.status != 'stop')
      @playing.update(status: 'pause')
      send_message :pause_success, @playing
    end

    # Find the last updated DVD and check it's status
    # Playing.order('updated_at').last
  end

  def stop
    @playing.update(status: 'stop')
    send_message :stop_success, @playing
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
