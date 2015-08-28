require 'rails_helper'

RSpec.describe "dvds/edit", type: :view do
  before(:each) do
    @dvd = assign(:dvd, Dvd.create!(
      title: 'Superbad',
      rating: 3,
      abstract_txt: "Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera.",
      abstract_source: 'Wikipedia',
      abstract_url: 'https://en.wikipedia.org/wiki/Superbad_(film)',
      file_url: 'http://emachina/SUPERBAD_UNRATED.mp4',
      playback_time: 0
    ))
  end

  it "renders the edit dvd form" do
    render

    assert_select "form[action=?][method=?]", dvd_path(@dvd), "post" do

      assert_select "input#dvd_title[name=?]", "dvd[title]"

      assert_select "input#dvd_rating[name=?]", "dvd[rating]"

      assert_select "input#dvd_abstract_txt[name=?]", "dvd[abstract_txt]"

      assert_select "input#dvd_abstract_source[name=?]", "dvd[abstract_source]"

      assert_select "input#dvd_abstract_url[name=?]", "dvd[abstract_url]"

      assert_select "input#dvd_file_url[name=?]", "dvd[file_url]"

      assert_select "input#dvd_playback_time[name=?]", "dvd[playback_time]"
    end
  end
end
