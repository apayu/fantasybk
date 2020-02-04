class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.integer :api_person_id
      t.references :team, null: false, foreign_key: true
      t.string :name
      t.string :pos
      t.boolean :inj

      t.timestamps
    end
  end
end
