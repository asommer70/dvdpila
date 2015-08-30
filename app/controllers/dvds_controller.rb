class DvdsController < ApplicationController
  before_action :set_dvd, only: [:show, :edit, :update, :destroy]

  # GET /dvds
  # GET /dvds.json
  def index
    #@dvds = Dvd.all.order('updated_at DESC')
    @dvds = Dvd.order('updated_at DESC').paginate(:page => params[:page], :per_page => 10)
  end

  # GET /search
  def search
    @search = params[:search]
    @dvds = Dvd.where("title ~* ?", @search)
    render :index
  end

  # GET /dvds/1
  # GET /dvds/1.json
  def show
  end

  # GET /dvds/new
  def new
    @dvd = Dvd.new
  end

  # GET /dvds/1/edit
  def edit
  end

  # POST /dvds
  # POST /dvds.json
  def create
    @dvd = Dvd.new(dvd_params)

    respond_to do |format|
      if @dvd.save
        format.html { redirect_to @dvd, success: 'DVD was successfully created.' }
        format.json { render :show, status: :created, location: @dvd }
      else
        format.html { render :new }
        format.json { render json: @dvd.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dvds/1
  # PATCH/PUT /dvds/1.json
  def update

    # if dvd_params[:tag_list]
    #   tag_list = params[:dvd].delete :lat
    #   @dvd.tag_list.add(tag_list, parse: true)
    #   @dvd.save
    # end

    respond_to do |format|
      if @dvd.update(dvd_params)
        format.html { redirect_to @dvd, success: 'DVD was successfully updated.' }
        format.json { render :show, status: :ok, location: @dvd }
      else
        format.html { render :edit }
        format.json { render json: @dvd.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dvds/1
  # DELETE /dvds/1.json
  def destroy
    @dvd.destroy
    respond_to do |format|
      format.html { redirect_to dvds_url, success: 'DVD was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dvd
      @dvd = Dvd.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dvd_params
      params.require(:dvd).permit(:title,
                                  :rating,
                                  :abstract_txt,
                                  :abstract_source,
                                  :abstract_url,
                                  :file_url,
                                  :playback_time,
                                  :image,
                                  :tag_list
      )
    end
end
