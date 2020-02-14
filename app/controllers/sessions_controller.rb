class SessionsController < ApplicationController

  def custom
    @fuck = request.env['omniauth.auth']
    auth = "Bearer " + @fuck["credentials"]["token"]

    # url = URI.parse("https://api.login.yahoo.com/openid/v1/userinfo")
    # url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/game/nba")
    # url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/league/395.l.5448/scoreboard")
    url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/team/395.l.5448.t.1/roster/players")
    req = Net::HTTP::Get.new(url.request_uri)
    # req.set_form_data({'Authorization'=>auth})
    req['authorization'] = auth
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    response = http.request(req)
    @auth = auth
    # @you = JSON.parse(response.read_body)
    @you = Hash.from_xml(response.read_body.gsub("\n", ""))
  end

end
