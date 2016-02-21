class Playing < ActiveRecord::Base
  belongs_to :dvd
  belongs_to :episode
end
