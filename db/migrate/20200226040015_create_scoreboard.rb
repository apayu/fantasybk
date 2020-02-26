class CreateScoreboard < ActiveRecord::Migration[6.0]
  def change
    create_table :scoreboards do |t|
      t.references :user, null: false, foreign_key: true
      # 存過去幾週的scoreboard
      t.text :post_scoreboard, null: false
      # 當下的週數
      t.string :current_week, null: false

      t.timestamps
    end
  end
end
