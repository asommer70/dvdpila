class CreateBookmarks < ActiveRecord::Migration
  def change
    create_table :bookmarks do |t|
      t.string :name
      t.integer :time
      t.belongs_to :dvd, index: true
      t.belongs_to :episode, index: true

      t.timestamps null: false
    end
  end
end
