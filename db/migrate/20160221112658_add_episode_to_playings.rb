class AddEpisodeToPlayings < ActiveRecord::Migration
  def change
    add_column :playings, :episode_id, :integer
    add_index "playings", ["episode_id"], name: "index_playings_on_episode_id", using: :btree
  end
end
