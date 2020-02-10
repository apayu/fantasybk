class Player < ApplicationRecord

  belongs_to :team
  has_one :value
  has_one :stat

  attr_accessor :rank_value

  def initialize
    @rank_value = 0
  end

end
