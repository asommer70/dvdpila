class BookmarksController < ApplicationController
  before_action :set_bookmark, only: [:show, :edit, :update, :destroy]

  # Get /bookmarks/1.json
  def show
    respond_to do |format|
      format.json { render :show, location: @bookmark }
    end
  end

  # POST /bookmarks
  # POST /bookmarks.json
  def create
    @bookmark = Bookmark.new(bookmark_params)
    dvd = Dvd.find(params[:dvd_id]) if params[:dvd_id]
    episode = Episode.find(params[:episode_id]) if params[:episode_id]
    @bookmark.dvd = dvd if dvd
    @bookmark.episode = episode if episode

    respond_to do |format|
      if @bookmark.save
        if @bookmark.dvd
        format.html { redirect_to dvd_path(@bookmark.dvd.id), notice: 'Bookmark was successfully created.' }
        format.json { render :show, status: :created, location: dvd_path(@bookmark.dvd.id) }
        elsif @bookmark.episode
          format.html { redirect_to dvd_path(@bookmark.episode.dvd.id), notice: 'Bookmark was successfully created.' }
          format.json { render :show, status: :created, location: dvd_path(@bookmark.episode.dvd.id) }
        end
      else
        if @bookmark.dvd
          format.html { redirect_to dvd_path(@bookmark.dvd.id), alert: 'Problem creating bookmark.' }
        elsif @bookmark.episode
          format.html { redirect_to dvd_path(@bookmark.episode.dvd.id), alert: 'Problem creating bookmark.' }
        end
        format.json { render json: @bookmark.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bookmarks/1
  # PATCH/PUT /bookmarks/1.json
  def update
    respond_to do |format|
      if @bookmark.update(bookmark_params)
        format.html { redirect_to dvd_path(@bookmark.dvd), notice: 'Bookmark was successfully updated.' }
        format.json { render :show, status: :ok, location: dvd_path(@bookmark.dvd) }
      else
        format.html { render :edit }
        format.json { render json: @bookmark.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bookmarks/1
  # DELETE /bookmarks/1.json
  def destroy
    @bookmark.destroy
    respond_to do |format|
      format.html { redirect_to dvd_path(@bookmark.dvd), notice: 'Bookmark was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_bookmark
    @bookmark = Bookmark.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def bookmark_params
    params.require(:bookmark).permit(:name,
                                     :time
    )
  end
end
