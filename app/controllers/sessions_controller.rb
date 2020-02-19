class SessionsController < ApplicationController

  def custom
    @oauth = request.env['omniauth.auth']
    # auth = "Bearer " + @fuck["credentials"]["token"]

    # url = URI.parse("https://api.login.yahoo.com/openid/v1/userinfo")
    # url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/game/nba")
    # url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/league/395.l.5448/scoreboard")
    # req = Net::HTTP::Get.new(url.request_uri)
    # # req.set_form_data({'Authorization'=>auth})
    # req['authorization'] = auth
    # http = Net::HTTP.new(url.host, url.port)
    # http.use_ssl = (url.scheme == "https")
    # response = http.request(req)
    @game = Hash.from_xml(YahooApi.get_game_info(@oauth["credentials"]["token"]).gsub("\n", ""))
    @league = Hash.from_xml(YahooApi.get_league_setting(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    @standings = Hash.from_xml(YahooApi.get_league_standings(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    @scoreboard = Hash.from_xml(YahooApi.get_league_scoreboard(@oauth["credentials"]["token"], 5448).gsub("\n", ""))
    @matchups = Hash.from_xml(YahooApi.get_team_matchups(@oauth["credentials"]["token"], 5448, 1, 1).gsub("\n", ""))
    # @you = JSON.parse(response.read_body)
    # @you = Hash.from_xml(response.read_body.gsub("\n", ""))
  end

end
