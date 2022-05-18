# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_18_172632) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "lobbies", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "player_readies", force: :cascade do |t|
    t.bigint "player_id"
    t.bigint "lobby_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["lobby_id"], name: "index_player_readies_on_lobby_id"
    t.index ["player_id"], name: "index_player_readies_on_player_id"
  end

  create_table "player_scores", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.bigint "round_id", null: false
    t.integer "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_player_scores_on_player_id"
    t.index ["round_id"], name: "index_player_scores_on_round_id"
  end

  create_table "players", force: :cascade do |t|
    t.bigint "lobby_id"
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["lobby_id", "name"], name: "index_players_on_lobby_id_and_name", unique: true
    t.index ["lobby_id"], name: "index_players_on_lobby_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.bigint "lobby_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["lobby_id"], name: "index_rounds_on_lobby_id"
  end

  add_foreign_key "player_readies", "lobbies"
  add_foreign_key "player_readies", "players"
  add_foreign_key "player_scores", "players"
  add_foreign_key "player_scores", "rounds"
  add_foreign_key "players", "lobbies"
  add_foreign_key "rounds", "lobbies"
end
