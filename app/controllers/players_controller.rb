class PlayersController < ApplicationController
  def index
    @players = Player.all
    @stats = Stat.all
    @point_sum =  @stats.where('points >= 0').sum("points")
    @tpm_sum =  @stats.where('tpm >= 0').sum("tpm")
    @assists_sum = @stats.where('assists >= 0').sum("assists")
    @steals_sum = @stats.where('steals >= 0').sum("steals")
    @blocks_sum = @stats.where('blocks >= 0').sum("blocks")
    @offReb_sum = @stats.where('"offReb" >= 0').sum("offReb")
    @defReb_sum = @stats.where('"defReb" >= 0').sum("defReb")
    @turnovers_sum = @stats.where('turnovers >= 0').sum("turnovers")
    @pFouls_sum = @stats.where('"pFouls" >= 0').sum("pFouls")
  end
end
