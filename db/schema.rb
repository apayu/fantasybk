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

ActiveRecord::Schema.define(version: 2020_02_01_143423) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "leagues", force: :cascade do |t|
    t.integer "point_total"
    t.integer "three_point_total"
    t.integer "assists_total"
    t.integer "steals_total"
    t.integer "blocks_total"
    t.float "field_goal_avg"
    t.float "free_throw_avg"
    t.integer "off_reb_total"
    t.integer "def_reb_total"
    t.integer "turnovers_total"
    t.integer "p_fouls_total"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "players", force: :cascade do |t|
    t.integer "api_person_id"
    t.bigint "team_id", null: false
    t.string "name"
    t.string "pos"
    t.boolean "inj"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id"], name: "index_players_on_team_id"
  end

  create_table "stats", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.integer "season_year"
    t.integer "season_stage_id"
    t.integer "assists", default: 0, null: false
    t.integer "blocks", default: 0, null: false
    t.integer "steals", default: 0, null: false
    t.integer "turnovers", default: 0, null: false
    t.integer "off_reb", default: 0, null: false
    t.integer "def_reb", default: 0, null: false
    t.integer "tot_reb", default: 0, null: false
    t.integer "fgm", default: 0, null: false
    t.integer "fga", default: 0, null: false
    t.integer "tpm", default: 0, null: false
    t.integer "tpa", default: 0, null: false
    t.integer "ftm", default: 0, null: false
    t.integer "fta", default: 0, null: false
    t.integer "p_fouls", default: 0, null: false
    t.integer "points", default: 0, null: false
    t.integer "games_played", default: 0, null: false
    t.integer "games_started", default: 0, null: false
    t.integer "plus_minus", default: 0, null: false
    t.integer "min", default: 0, null: false
    t.integer "dd2", default: 0, null: false
    t.integer "td3", default: 0, null: false
    t.float "min_per_game", default: 0.0, null: false
    t.float "points_per_game", default: 0.0, null: false
    t.float "three_per_game", default: 0.0, null: false
    t.float "assists_per_game", default: 0.0, null: false
    t.float "steals_per_game", default: 0.0, null: false
    t.float "blocks_per_game", default: 0.0, null: false
    t.float "field_goal_percentage", default: 0.0, null: false
    t.float "free_throw_percentage", default: 0.0, null: false
    t.float "off_reb_per_game", default: 0.0, null: false
    t.float "def_reb_per_game", default: 0.0, null: false
    t.float "turnovers_per_game", default: 0.0, null: false
    t.float "p_fouls_per_game", default: 0.0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_stats_on_player_id"
  end

  create_table "teams", force: :cascade do |t|
    t.integer "api_team_id"
    t.string "city"
    t.string "full_name"
    t.string "tricode"
    t.string "conf_name"
    t.string "div_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "values", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.float "points_value", default: 0.0, null: false
    t.float "three_point_value", default: 0.0, null: false
    t.float "assists_value", default: 0.0, null: false
    t.float "steals_value", default: 0.0, null: false
    t.float "blocks_value", default: 0.0, null: false
    t.float "field_goal_value", default: 0.0, null: false
    t.float "free_throw_value", default: 0.0, null: false
    t.float "off_reb_value", default: 0.0, null: false
    t.float "def_reb_value", default: 0.0, null: false
    t.float "turnovers_value", default: 0.0, null: false
    t.float "p_fouls_value", default: 0.0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_values_on_player_id"
  end

  add_foreign_key "players", "teams"
  add_foreign_key "stats", "players"
  add_foreign_key "values", "players"
end
