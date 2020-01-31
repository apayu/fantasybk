class CreateStats < ActiveRecord::Migration[6.0]
  def change
    create_table :stats do |t|
      t.references :player
      t.integer :seasonYear
      t.integer :seasonStageId
      t.integer :assists
      t.integer :blocks
      t.integer :steals
      t.integer :turnovers
      t.integer :offReb
      t.integer :defReb
      t.integer :totReb
      t.integer :fgm
      t.integer :fga
      t.integer :tpm
      t.integer :tpa
      t.integer :ftm
      t.integer :fta
      t.integer :pFouls
      t.integer :points
      t.integer :gamesPlayed
      t.integer :gamesStarted
      t.integer :plusMinus
      t.integer :min
      t.integer :dd2
      t.integer :td3

      t.timestamps
    end
  end
end
