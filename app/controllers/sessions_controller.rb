class SessionsController < ApplicationController

  def custom
    @oauth = request.env['omniauth.auth']

    # 將toke資訊存起來
    user = User.find(current_user.id)
    user.token = @oauth["credentials"]["token"]
    user.refresh_token = @oauth["credentials"]["refresh_token"]
    user.expires_at = DateTime.strptime(@oauth["credentials"]["expires_at"].to_s,'%s')

    # 跳轉到聯盟頁
    if user.save
      redirect_to leagues_path
    else
      redirect_to root_path
    end

    # # 測試頁
    # @game = Hash.from_xml(YahooApi.get_game_info(@oauth["credentials"]["token"]).gsub("\n", ""))
    # @league = Hash.from_xml(YahooApi.get_league_setting(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    # e = @league["fantasy_content"]["league"]["current_week"]
    # s = @league["fantasy_content"]["league"]["start_week"]
    # @standings = Hash.from_xml(YahooApi.get_league_standings(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    # @scoreboard = Hash.from_xml(YahooApi.get_league_scoreboard(@oauth["credentials"]["token"], 5448, s.to_i, e.to_i).gsub("\n", ""))
    # @matchups = Hash.from_xml(YahooApi.get_team_matchups(@oauth["credentials"]["token"], 5448, 1).gsub("\n", ""))
    #
    # @player =  Hash.from_xml(YahooApi.get_team_roster(@oauth["credentials"]["token"], 5448, 1).gsub("\n", ""))
  end
end
