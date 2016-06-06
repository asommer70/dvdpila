json.count @dvds.count

json.dvds do |dvds|
  json.array!(@dvds) do |dvd|
    json.extract! dvd, :id,
                  :title,
                  :rating,
                  :abstract_txt,
                  :abstract_source,
                  :abstract_url,
                  :file_url,
                  :playback_time,
                  :created_at
    json.image_url 'http://' + request.host_with_port + dvd.image.url if dvd.image
    json.url dvd_url(dvd, format: :json)
    json.tags dvd.tag_list
  end
end
