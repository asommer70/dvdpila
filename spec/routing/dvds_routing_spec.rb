require "rails_helper"

RSpec.describe DvdsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/dvds").to route_to("dvds#index")
    end

    it "routes to #new" do
      expect(:get => "/dvds/new").to route_to("dvds#new")
    end

    it "routes to #show" do
      expect(:get => "/dvds/1").to route_to("dvds#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/dvds/1/edit").to route_to("dvds#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/dvds").to route_to("dvds#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/dvds/1").to route_to("dvds#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/dvds/1").to route_to("dvds#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/dvds/1").to route_to("dvds#destroy", :id => "1")
    end

  end
end
