class CreateTeams < ActiveRecord::Migration[6.0]
  def change
    create_table :teams do |t|
      t.integer :teamId
      t.string :city
      t.string :fullName
      t.string :tricode
      t.string :confName
      t.string :divName

      t.timestamps
    end
  end
end
