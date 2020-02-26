class AddLeagueIdFromUser < ActiveRecord::Migration[6.0]
  def change
   add_column :users, :league_id, :integer
  end
end
