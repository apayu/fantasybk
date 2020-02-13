class Post < ApplicationRecord
  belongs_to :user
  belongs_to :type

  default_scope { where(deleted_at: nil) }

  def destroy
    update(delete_at: Time.now)
  end
end
