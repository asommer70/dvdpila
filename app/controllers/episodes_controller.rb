class EpisodesController < ApplicationController
  before_action :set_episode, only: [:show, :edit, :update, :destroy]

  # Get /episodes/1.json
  def show
    respond_to do |format|
      format.json { render :show, location: @episode }
    end
  end
  
  # POST /episodes
  # POST /episodes.json
  def create
    @episode = Episode.new(episode_params)
    dvd = Dvd.find(params[:dvd_id])
    @episode.dvd = dvd if dvd

    respond_to do |format|
      if @episode.save
        format.html { redirect_to dvd_path(@episode.dvd.id), notice: 'Episode was successfully created.' }
        format.json { render :show, status: :created, location: dvd_path(@episode.dvd.id) }
      else
        puts "@episode.errors: #{@episode.errors.full_messages}"
        puts "dvd.errors: #{dvd.errors.full_messages}"

        format.html { redirect_to dvd_path(@episode.dvd.id), error: 'There was a problem creating the episode.' }
        format.json { render json: @episode.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /episodes/1
  # PATCH/PUT /episodes/1.json
  def update
    respond_to do |format|
      if @episode.update(episode_params)
        format.html { redirect_to dvd_path(@episode.dvd), notice: 'Episode was successfully updated.' }
        format.json { render :show, status: :ok, location: dvd_path(@episode.dvd) }
      else
        format.html { render :edit }
        format.json { render json: @episode.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /episodes/1
  # DELETE /episodes/1.json
  def destroy
    @episode.destroy
    respond_to do |format|
      format.html { redirect_to dvd_path(@episode.dvd), notice: 'Episode was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_episode
      @episode = Episode.find(params[:id])
    end
  
    # Never trust parameters from the scary internet, only allow the white list through.
    def episode_params
      params.require(:episode).permit(:name,
                                      :file_url,
                                      :playback_time
      )
    end
end