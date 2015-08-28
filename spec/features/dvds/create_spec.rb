require 'rails_helper'

describe "Creating dvds" do

  it "redirects to the the dvd show page on success", :js => true do
    visit '/'
    click_link 'New Dvd'
    expect(page).to have_content('New Dvd')

    fill_in 'Title', with: 'Superbad'
    fill_in 'Rating', with: 5
    fill_in 'Abstract txt', with: "Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera."
    fill_in 'Abstract source', with: 'Wikipedia'
    fill_in 'Abstract url', with: 'https://en.wikipedia.org/wiki/Superbad_(film)'
    fill_in 'File url', with: 'http://emachina/SUPERBAD_UNRATED.mp4'
    fill_in 'Playback time', with: 0

    attach_file('dvd[image]', Rails.root.join('spec/fixtures/superbad.png'))

    click_button 'Create Dvd'
    dvd = Dvd.last

    expect(dvd.image).to be_truthy
    expect(page).to have_content('Superbad')
  end

end