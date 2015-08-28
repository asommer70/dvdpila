json.array!(@dvds) do |dvd|
  json.extract! dvd, :id,
                :title,
                :rating,
                :abstract_txt,
                :abstract_source,
                :abstract_url,
                :file_url,
                :playback_time
  json.image_url dvd.image.url

  json.url dvd_url(dvd, format: :json)
end
