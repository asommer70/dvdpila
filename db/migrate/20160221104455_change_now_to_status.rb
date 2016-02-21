class ChangeNowToStatus < ActiveRecord::Migration
  def change
    remove_column :playings, :now
    add_column :playings, :status, :string
  end
end
