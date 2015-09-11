class Dvd < ActiveRecord::Base
  dragonfly_accessor :image
  acts_as_taggable_on :tags

  validates :rating, allow_nil: true, :numericality => { :greater_than => 0, :less_than_or_equal_to => 5 }
  validates :playback_time, allow_nil: true, :numericality => { :greater_than_or_equal_to => 0 }

  has_many :episodes
  has_many :bookmarks

  def self.get_yoopsie(barcode)
    require 'open-uri'
    #barcode = '717951000842'
    url = "http://www.yoopsie.com/query.php?query=" + barcode
    doc = Nokogiri::HTML(open(url))

    td = doc.css('.info_image').search('td')[0]
    title = td.search('a')[0]['title']

    # Remove parantheses and everything between them.
    while title.gsub!(/\([^()]*\)/,""); end

    return { title: title, image_url: td.children.children[0]['src'] }
  end

  def self.get_ddg(title)
    require 'duck_duck_go'

    ddg = DuckDuckGo.new
    res = ddg.zeroclickinfo(title)
    if res.heading.nil?
      res = ddg.zeroclickinfo(title + ' (film)')
    else
      res = ddg.zeroclickinfo(title + ' (movie)')
    end

    return {
        abstract_txt: res.abstract_text,
        abstract_source: res.abstract_source,
        abstract_url: res.abstract_url.to_s,
        image_url: res.image.to_s
    }
  end
end
