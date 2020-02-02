class Player < ApplicationRecord

  belongs_to :team
  has_one :value
  has_one :stat

  def rank_value
    self.value.points_value + self.value.three_point_value + self.value.assists_value + self.value.steals_value + self.value.blocks_value + self.value.field_goal_value + self.value.free_throw_value + self.value.off_reb_value + self.value.def_reb_value - self.value.turnovers_value - self.value.p_fouls_value

  end

end
