task :update_images => :environment do
  Dvd.all.each do |dvd|
    puts dvd.image_name
    if dvd.image
      begin
        dvd.image_url = "http://dvdpila/img/posters/#{dvd.image_name}"
        dvd.save
      rescue
        puts "dvd.image not found: #{dvd.title}"
      end
    end
  end
end
