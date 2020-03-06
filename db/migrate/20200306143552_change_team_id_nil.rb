class ChangeTeamIdNil < ActiveRecord::Migration[6.0]
  def change
    change_column_null(:players, :team_id, true)
  end
end
