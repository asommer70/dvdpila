class CreatePlaying < ActiveRecord::Migration
  def change
    create_table :playings do |t|
      t.belongs_to :dvd, index:true

      t.timestamps null: false
    end
  end
end
