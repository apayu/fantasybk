class PlayersController < ApplicationController
  def index
    @players = Player.includes(:value, :team, :stat)
  end
end
