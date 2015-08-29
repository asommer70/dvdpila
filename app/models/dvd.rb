class Dvd < ActiveRecord::Base
  dragonfly_accessor :image

  validates :rating, allow_nil: true, :numericality => { :greater_than => 0, :less_than_or_equal_to => 5 }
  validates :playback_time, allow_nil: true, :numericality => { :greater_than_or_equal_to => 0 }

  has_many :episodes
  has_many :bookmarks
end