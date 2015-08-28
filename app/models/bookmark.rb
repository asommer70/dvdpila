class Bookmark < ActiveRecord::Base
  belongs_to :dvd
  belongs_to :episode

  validates :time, :numericality => { :greater_than_or_equal_to => 0 }
end