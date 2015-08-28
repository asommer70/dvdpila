class CreateDvds < ActiveRecord::Migration
  def change
    create_table :dvds do |t|
      t.string :title
      t.integer :rating
      t.string :abstract_txt
      t.string :abstract_source
      t.string :abstact_url
      t.string :file_url
      t.integer :playback_time

      t.timestamps null: false
    end
  end
end
