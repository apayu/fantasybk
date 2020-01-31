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

ActiveRecord::Schema.define(version: 2020_01_31_033202) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "players", force: :cascade do |t|
    t.integer "personId"
    t.bigint "team_id", null: false
    t.string "name"
    t.string "pos"
    t.boolean "inj"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id"], name: "index_players_on_team_id"
  end

  create_table "stats", force: :cascade do |t|
    t.bigint "player_id"
    t.integer "seasonYear"
    t.integer "seasonStageId"
    t.integer "assists"
    t.integer "blocks"
    t.integer "steals"
    t.integer "turnovers"
    t.integer "offReb"
    t.integer "defReb"
    t.integer "totReb"
    t.integer "fgm"
    t.integer "fga"
    t.integer "tpm"
    t.integer "tpa"
    t.integer "ftm"
    t.integer "fta"
    t.integer "pFouls"
    t.integer "points"
    t.integer "gamesPlayed"
    t.integer "gamesStarted"
    t.integer "plusMinus"
    t.integer "min"
    t.integer "dd2"
    t.integer "td3"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_stats_on_player_id"
  end

  create_table "teams", force: :cascade do |t|
    t.integer "teamId"
    t.string "city"
    t.string "fullName"
    t.string "tricode"
    t.string "confName"
    t.string "divName"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "players", "teams"
end
