class AddNowToPlaying < ActiveRecord::Migration
  def change
    add_column :playings, :now, :boolean
  end
end
