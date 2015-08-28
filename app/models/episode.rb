class Episode < ActiveRecord::Base
  belongs_to :dvd

  validates :playback_time, :numericality => { :greater_than_or_equal_to => 0 }
end