require 'rails_helper'

RSpec.describe "dvds/show", type: :view do
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

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Superbad/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera./)
    expect(rendered).to match(/Wikipedia/)
    expect(rendered).to match(/https:\/\/en.wikipedia.org\/wiki\/Superbad_\(film\)/)
    expect(rendered).to match(/http:\/\/emachina\/SUPERBAD_UNRATED.mp4/)
    expect(rendered).to match(/0/)
  end
end
