class CreateValues < ActiveRecord::Migration[6.0]
  def change
    create_table :values do |t|
      t.references :player, null: false, foreign_key: true
      t.float :points_value, :null => false, :default => 0
      t.float :three_point_value, :null => false, :default => 0
      t.float :assists_value, :null => false, :default => 0
      t.float :steals_value, :null => false, :default => 0
      t.float :blocks_value, :null => false, :default => 0
      t.float :field_goal_value, :null => false, :default => 0
      t.float :free_throw_value, :null => false, :default => 0
      t.float :off_reb_value, :null => false, :default => 0
      t.float :def_reb_value, :null => false, :default => 0
      t.float :turnovers_value, :null => false, :default => 0
      t.float :p_fouls_value, :null => false, :default => 0

      t.timestamps
    end
  end
end
