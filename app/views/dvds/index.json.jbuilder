json.array!(@dvds) do |dvd|

  json.extract! dvd,
                :id,
                :title,
                :rating,
                :abstract_txt,
                :abstract_source,
                :abstract_url,
                :file_url,
                :playback_time,
                :created_at,
                :updated_at
  
  json.url dvd_url(dvd, format: :json)
  json.image_url dvd.image.url
  json.tags dvd.tags
  json.episodes dvd.episodes do |episode|
    json.extract! episode, :id, :name, :file_url, :playback_time, :dvd_id, :created_at, :updated_at, :bookmarks
  end
  json.bookmarks dvd.bookmarks
end
