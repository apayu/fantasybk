class CreateStats < ActiveRecord::Migration[6.0]
  def change
    create_table :stats do |t|
      t.references :player, null: false, foreign_key: true
      t.integer :season_year
      t.integer :season_stage_id
      # 總數
      t.integer :assists, :null => false, :default => 0
      t.integer :blocks, :null => false, :default => 0
      t.integer :steals, :null => false, :default => 0
      t.integer :turnovers, :null => false, :default => 0
      t.integer :off_reb, :null => false, :default => 0
      t.integer :def_reb, :null => false, :default => 0
      t.integer :tot_reb, :null => false, :default => 0
      t.integer :fgm, :null => false, :default => 0
      t.integer :fga, :null => false, :default => 0
      t.integer :tpm, :null => false, :default => 0
      t.integer :tpa, :null => false, :default => 0
      t.integer :ftm, :null => false, :default => 0
      t.integer :fta, :null => false, :default => 0
      t.integer :p_fouls, :null => false, :default => 0
      t.integer :points, :null => false, :default => 0
      t.integer :games_played, :null => false, :default => 0
      t.integer :games_started, :null => false, :default => 0
      t.integer :plus_minus, :null => false, :default => 0
      t.integer :min, :null => false, :default => 0
      t.integer :dd2, :null => false, :default => 0
      t.integer :td3, :null => false, :default => 0
      # 平均
      t.float :min_per_game, :null => false, :default => 0
      t.float :points_per_game, :null => false, :default => 0
      t.float :three_per_game, :null => false, :default => 0
      t.float :assists_per_game, :null => false, :default => 0
      t.float :steals_per_game, :null => false, :default => 0
      t.float :blocks_per_game, :null => false, :default => 0
      t.float :field_goal_percentage, :null => false, :default => 0
      t.float :free_throw_percentage, :null => false, :default => 0
      t.float :off_reb_per_game, :null => false, :default => 0
      t.float :def_reb_per_game, :null => false, :default => 0
      t.float :turnovers_per_game, :null => false, :default => 0
      t.float :p_fouls_per_game, :null => false, :default => 0
      t.timestamps
    end
  end
end
