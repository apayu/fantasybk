class CreateLeagues < ActiveRecord::Migration[6.0]
  def change
    create_table :leagues do |t|
      t.integer :point_total
      t.integer :three_point_total
      t.integer :assists_total
      t.integer :steals_total
      t.integer :blocks_total
      t.float :field_goal_avg
      t.float :free_throw_avg
      t.integer :off_reb_total
      t.integer :def_reb_total
      t.integer :turnovers_total
      t.integer :p_fouls_total

      t.timestamps
    end
  end
end
