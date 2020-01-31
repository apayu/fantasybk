class Player < ApplicationRecord
  belongs_to :team
  has_one :stat
end
