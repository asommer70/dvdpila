json.array!(@dvds) do |dvd|
  json.extract! dvd, :id, :title, :rating, :abstract_txt, :abstract_source, :abstact_url, :file_url, :playback_time
  json.url dvd_url(dvd, format: :json)
end
