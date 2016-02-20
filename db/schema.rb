# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160220180234) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bookmarks", force: :cascade do |t|
    t.string   "name"
    t.integer  "time"
    t.integer  "dvd_id"
    t.integer  "episode_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "bookmarks", ["dvd_id"], name: "index_bookmarks_on_dvd_id", using: :btree
  add_index "bookmarks", ["episode_id"], name: "index_bookmarks_on_episode_id", using: :btree

  create_table "dvds", force: :cascade do |t|
    t.string   "title"
    t.integer  "rating"
    t.string   "abstract_txt"
    t.string   "abstract_source"
    t.string   "abstract_url"
    t.string   "file_url"
    t.integer  "playback_time"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "image"
    t.string   "image_uid"
    t.string   "image_name"
  end

  create_table "episodes", force: :cascade do |t|
    t.string   "name"
    t.string   "file_url"
    t.integer  "playback_time"
    t.integer  "dvd_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "episodes", ["dvd_id"], name: "index_episodes_on_dvd_id", using: :btree

  create_table "playings", force: :cascade do |t|
    t.integer  "dvd_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "playings", ["dvd_id"], name: "index_playings_on_dvd_id", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

end
