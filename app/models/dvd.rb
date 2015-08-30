class Dvd < ActiveRecord::Base
  dragonfly_accessor :image
  acts_as_taggable_on :tags

  validates :rating, allow_nil: true, :numericality => { :greater_than => 0, :less_than_or_equal_to => 5 }
  validates :playback_time, allow_nil: true, :numericality => { :greater_than_or_equal_to => 0 }

  has_many :episodes
  has_many :bookmarks

  def self.get_yoopsie(barcode)
    #barcode = '717951000842'
    url = "http://www.yoopsie.com/query.php?query=" + barcode
    doc = Nokogiri::HTML(open(url))

    td = doc.css('.info_image').search('td')[0]
    return { title: td.search('a')[0]['title'], image_url: td.children.children[0]['src'] }
  end
end