class SessionsController < ApplicationController

  def custom
    @oauth = request.env['omniauth.auth']

    user = User.find(current_user.id)
    user.token = @oauth["credentials"]["token"]
    user.refresh_token = @oauth["credentials"]["refresh_token"]
    if user.save
      redirect_to leagues_path
    else
      redirect_to root_path
    end
    # @game = Hash.from_xml(YahooApi.get_game_info(@oauth["credentials"]["token"]).gsub("\n", ""))
    # @league = Hash.from_xml(YahooApi.get_league_setting(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    # @standings = Hash.from_xml(YahooApi.get_league_standings(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    # @scoreboard = Hash.from_xml(YahooApi.get_league_scoreboard(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    # @matchups = Hash.from_xml(YahooApi.get_team_matchups(@oauth["credentials"]["token"], 5448, 1, 1).gsub("\n", ""))
  end
end
