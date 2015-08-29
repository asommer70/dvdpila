class Episode < ActiveRecord::Base
  acts_as_taggable_on :tags

  belongs_to :dvd
  has_many :bookmarks

  validates :playback_time, allow_nil: true, :numericality => { :greater_than_or_equal_to => 0 }
end