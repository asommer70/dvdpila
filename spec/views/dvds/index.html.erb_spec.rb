require 'rails_helper'

RSpec.describe "dvds/index", type: :view do
  before(:each) do
    assign(:dvds, [
      Dvd.create!(
        title: 'Superbad',
        rating: 3,
        abstract_txt: "Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera.",
        abstract_source: 'Wikipedia',
        abstract_url: 'https://en.wikipedia.org/wiki/Superbad_(film)',
        file_url: 'http://emachina/SUPERBAD_UNRATED.mp4',
        playback_time: 0
      ),
      Dvd.create!(
        :title => 'Snatch',
        :rating => 3,
        :abstract_txt => "Snatch is a 2000 crime comedy film written and directed by Guy Ritchie, featuring an ensemble cast. ",
        :abstract_source => "Wikipedia",
        :abstract_url => "https://en.wikipedia.org/wiki/Snatch_(film)",
        :file_url => 'http://videos/SNATCH.mp4',
        :playback_time => 0
      )
    ])
  end

  it 'renders a list of dvds' do
    render
    assert_select '.title', :count => 2
    assert_select '.rating', :count => 2
    assert_select '.abstract_txt', :count => 2
    assert_select '.abstract_source', :count => 2
    assert_select '.abstract_url', :count => 2
    assert_select '.file_url', :count => 2
    assert_select '.playback_time', :count => 2
  end
end
