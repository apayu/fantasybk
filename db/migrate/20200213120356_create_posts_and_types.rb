class CreatePostsAndTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :type, polymorphic: true, index: true
      t.string :title
      t.text :content
      t.integer :total_comment
      t.datetime :deleted_at

      t.timestamps
    end

    create_table :types do |t|
      t.string :name
      t.timestamps
    end
  end
end
