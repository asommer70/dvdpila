require 'rails_helper'

RSpec.describe Dvd, type: :model do
  let(:valid_attributes) {
    {
        title: 'Superbad',
        rating: 5,
        abstract_txt: "Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera.",
        abstract_source: 'Wikipedia',
        abstract_url: 'https://en.wikipedia.org/wiki/Superbad_(film)',
        file_url: 'http://emachina/SUPERBAD_UNRATED.mp4',
        playback_time: 0
    }
  }

  context 'validations' do
    let(:dvd) { Dvd.new(valid_attributes) }

    before do
      Dvd.create(valid_attributes)
    end

    it 'rating is between 1 and 5' do
      should allow_value(3).for(:rating)
      should_not allow_value(7).for(:rating)
      should_not allow_value('bad').for(:rating)
    end

    it 'playback_time is a number greater >= 0' do
      should allow_value(7).for(:playback_time)
      should_not allow_value('middle').for(:playback_time)
    end
  end
end
