class Scoreboard < ApplicationRecord
  belongs_to :user
  serialize :post_scoreboard
end
