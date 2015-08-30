task :migrate_db => :environment do
  # Connect to old DVD Pila! database.
  conn = PG.connect( dbname: SECRETS['old_db_name'],
                     user: SECRETS['old_db_username'],
                     password: SECRETS['old_db_password'],
                     host: SECRETS['old_db_host'] )


  dvds_episodes_query = <<-QUERY
SELECT title,
        rating,
        abstract_txt,
        abstract_source,
        abstract_url,
        image_url,
        file_url,
        dvds.playback_time,
        name,
        episode_file_url,
        episodes.playback_time as episode_playback_time
  FROM dvds, episodes
  where episodes.dvd_id = dvds.id;
  QUERY

  dvds_query = <<-DVD
  select title,
        rating,
        abstract_txt,
        abstract_source,
        abstract_url,
        image_url,
        file_url,
        playback_time
  from dvds;
  DVD

  episodes_query = <<-EPISODE
  select title, name, episode_file_url, dvd_id, episodes.playback_time from dvds, episodes where dvds.id = dvd_id;
  EPISODE

  conn.exec(episodes_query) do |result|
    result.each do |episode|
      new_epi = Episode.find_by_name(episode['name'])

      unless new_epi
        new_epi = Episode.new
        new_epi.name = episode['name']
        new_epi.file_url = episode['episode_file_url']
        new_epi.playback_time = episode['playback_time']
        dvd = Dvd.find_by_title(episode['title'])
        new_epi.dvd = dvd if dvd

        unless new_epi.save
          puts "#{episode['name']} wasn't created..."
        end

      end
    end
  end

  #conn.exec(dvds_query) do |result|
  #  result.each do |dvd|
  #    #puts "http://dvdpila:5000/#{dvd['image_url']}:\t\t\t #{dvd['title'].class}"
  #    #puts "dvd['title']: #{dvd['title']}"
  #    #puts "dvd['rating']: #{dvd['rating']}"
  #    #puts "dvd['abstract_txt']: #{dvd['abstract_txt']}"

  #    new_dvd = Dvd.find_by_title(dvd['title'])
  #    unless new_dvd
  #      new_dvd = Dvd.new
  #      begin
  #        new_dvd.title = dvd['title'] if dvd['title']
  #        new_dvd.rating = dvd['rating'] if dvd['rating']
  #        new_dvd.abstract_txt = dvd['abstract_txt'] if dvd['abstract_txt']
  #        new_dvd.abstract_source = dvd['abstract_source'] if dvd['abstract_source']
  #        new_dvd.abstract_url = dvd['abstract_url'] if dvd['abstract_url']
  #        new_dvd.image_url = "http://dvdpila:5000/#{dvd['image_url']}" if dvd['image_url']
  #        new_dvd.file_url = dvd['file_url'] if dvd['file_url']
  #        new_dvd.playback_time = dvd['playback_time'] if dvd['playback_time']

  #        unless new_dvd.save
  #          puts "#{new_dvd.title} \t \t not created..."
  #        end
  #      rescue => error
  #        puts "error.inpsect: #{error.inspect}"
  #        puts "#{new_dvd.title} \t \t not created..."

  #      end
  #    end
  #  end
  #end
end
