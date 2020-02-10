class AddApiId < ActiveRecord::Migration[6.0]
  def change
    add_column :teams, :api2_team_id, :integer
    add_column :players, :api2_person_id, :integer
    add_column :players, :first_name, :string
    add_column :players, :last_name, :string
    add_column :players, :api2_team_id, :integer
  end
end
