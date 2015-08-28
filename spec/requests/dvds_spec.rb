require 'rails_helper'

RSpec.describe "Dvds", type: :request do
  describe "GET /dvds" do
    it "works! (now write some real specs)" do
      get dvds_path
      expect(response).to have_http_status(200)
    end
  end
end
