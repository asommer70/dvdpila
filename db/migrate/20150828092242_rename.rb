class Rename < ActiveRecord::Migration
  def change
    rename_column :dvds, :abstact_url, :abstract_url
  end
end
