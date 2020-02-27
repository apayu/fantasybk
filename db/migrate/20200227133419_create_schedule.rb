class CreateSchedule < ActiveRecord::Migration[6.0]
  def change
    create_table :schedules do |t|
      t.references :team, null: false, foreign_key: true
      t.integer :game_id
      t.integer :api2_team_id
      t.datetime :game_time

      t.timestamps
    end
  end
end
