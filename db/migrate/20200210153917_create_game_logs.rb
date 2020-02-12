class CreateGameLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :game_logs do |t|
      t.references :player, null: false, foreign_key: true
      t.integer :api2_person_id
      t.integer :api2_game_id
      t.integer :points
      t.string :min
      t.integer :fgm
      t.integer :fga
      t.float :fgp
      t.integer :ftm
      t.integer :fta
      t.float :ftp
      t.integer :tpm
      t.integer :tpa
      t.float :tpp
      t.integer :off_reb
      t.integer :def_reb
      t.integer :tot_reb
      t.integer :assists
      t.integer :steals
      t.integer :blocks
      t.integer :turnovers
      t.integer :p_fouls
      t.string :h_team
      t.string :v_team
      t.datetime :game_time

      t.timestamps
    end
  end
end
