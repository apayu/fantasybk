class PlayersController < ApplicationController
  def index
    @players = Player.includes(:value, :team, :stat).where("stats.games_played > 0").references(:stats)
    # @players = Player.includes(:value, :team, :stat)
  end
end
