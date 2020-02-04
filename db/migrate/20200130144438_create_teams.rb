class CreateTeams < ActiveRecord::Migration[6.0]
  def change
    create_table :teams do |t|
      t.integer :api_team_id
      t.string :city
      t.string :full_name
      t.string :tricode
      t.string :conf_name
      t.string :div_name

      t.timestamps
    end
  end
end
