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

json.image_url @dvd.image.url