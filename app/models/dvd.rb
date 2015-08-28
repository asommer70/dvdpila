class Dvd < ActiveRecord::Base
  dragonfly_accessor :image

  validates :rating, :numericality => { :greater_than => 0, :less_than_or_equal_to => 5 }
  validates :playback_time, :numericality => { :greater_than_or_equal_to => 0 }

  has_many :episodes
end