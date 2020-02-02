class PlayersController < ApplicationController
  def index
    # @players = Player.includes(:value, :team, :stat).where("stat.games_played > 0")
    @players = Player.includes(:value, :team, :stat)
  end
end
