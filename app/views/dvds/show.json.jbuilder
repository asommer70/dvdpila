json.extract! @dvd,
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


json.image_url 'http://' + request.host_with_port + @dvd.image.url if @dvd.image
json.url dvd_url(@dvd, format: :json)

json.episodes @dvd.episodes do |episode|
  json.extract! episode,
                :id,
                :name,
                :file_url,
                :playback_time,
                :created_at
  json.url episode_url(episode, format: :json)
end
