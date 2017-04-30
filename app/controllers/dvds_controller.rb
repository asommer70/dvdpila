class DvdsController < ApplicationController
  before_action :set_dvd, only: [:show, :edit, :update, :destroy]
  protect_from_forgery :except => [:barcode, :socketio]

  # GET /dvds
  # GET /dvds.json
  def index
    #@dvds = Dvd.all.order('updated_at DESC')
    @dvds = Dvd.order('updated_at DESC').paginate(:page => params[:page], :per_page => 10)
    puts "@dvds.count: #{@dvds.class}"
  end

  # POST /search
  def search
    @search = params[:search]
    @dvds = Dvd.where("title ~* ?", @search)
    render :index
  end

  # GET /search.json
  def search_json
    @search = params[:search]
    @dvds = Dvd.where("title ~* ?", @search)
    render 'index.json.jbuilder'
  end

  # POST /ddg/
  def ddg
    ddg = Dvd.get_ddg(params[:title])
    if ddg
      render json: {status: 'success', ddg: ddg }
    else
      render json: {status: 'failure', ddg: {} }
    end
  end

  # POST /omdb/
  def omdb
    omdb = Dvd.get_omdb(params[:title])
    if omdb
      render json: {status: 'success', omdb: omdb }
    else
      render json: {status: 'failure', omdb: {} }
    end
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
    #ddg = Dvd.get_ddg(dvd_params[:title])
    omdb = Dvd.get_omdb(dvd_params[:title])
    #props = ddg.merge!(omdb)
    #props.merge!(dvd_params)
    props = omdb.merge!(dvd_params)
    @dvd = Dvd.new(props)

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

  def barcode
    yoopsie_data = Dvd.get_yoopsie(params[:barcode])
    omdb = nil

    if (yoopsie_data[:title])
      omdb = Dvd.get_omdb(yoopsie_data[:title])
    end

    if omdb
      @dvd = Dvd.new(yoopsie_data.merge(omdb))
    else
      @dvd = nil
    end

    if @dvd.image.nil?
      @dvd.image_url = yoopsie_data[:image_url]
    end


    if @dvd.save
      return_data = {
          status: :ok,
          message: "DVD created...",
          openUrl: request.base_url + dvd_path(@dvd)
      }
      render json: return_data, status: 200
    else
      return_data = {
          "status": 409,
          "message": "DVD *NOT* Created...",
          "openUrl": request.base_url + dvd_path(@dvd)
      }
      render json: return_data, stauts: 409
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
