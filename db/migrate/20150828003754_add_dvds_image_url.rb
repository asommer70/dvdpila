class AddDvdsImageUrl < ActiveRecord::Migration
  def change
    add_column :dvds, :image, :string
    add_column :dvds, :image_uid, :string
    add_column :dvds, :image_name, :string
  end
end
