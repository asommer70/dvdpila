class CreateEpisodes < ActiveRecord::Migration
  def change
    create_table :episodes do |t|
      t.string :name
      t.string :file_url
      t.integer :playback_time
      t.belongs_to :dvd, index:true

      t.timestamps null: false
    end
  end
end
