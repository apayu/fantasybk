class YahooApi
  class << self
    def get_game_info(token)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/game/nba")
      http_get_req(url, token)
    end

    def get_league_setting(token, league_id)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/league/395.l.#{league_id}/settings")
      http_get_req(url, token)
    end

    def get_league_standings(token, league_id)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/league/395.l.#{league_id}/standings")
      http_get_req(url, token)
    end

    def get_league_scoreboard(token, league_id, start_week, current_week)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/league/395.l.#{league_id}/scoreboard;week=#{(start_week..current_week).to_a.join(",")}")
      http_get_req(url, token)
    end

    def get_team_matchups(token, league_id, team_id)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/team/395.l.#{league_id}.t.#{team_id}/matchups")
      http_get_req(url, token)
    end

    # team key = game_id.l.league_id.t.teamd_id
    def get_team_roster(token, team_key)
      url = URI.parse("https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=#{team_key}/players")
      http_get_req(url, token)
    end

    def get_new_token(refresh_token)
      url = URI.parse("https://api.login.yahoo.com/oauth2/get_token")
      http_post_req(url, refresh_token)
    end

    private
    def http_get_req(url, token)
      req = Net::HTTP::Get.new(url.request_uri)
      req['authorization'] = "Bearer #{token}"

      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == "https")

      http.request(req).read_body
    end

    def http_post_req(url, refresh_token)
      str = "#{Rails.application.credentials.yahoo[:client_id]}:#{Rails.application.credentials.yahoo[:client_secret]}"
      encode_str = Base64.encode64(str).gsub("\n", "")

      req = Net::HTTP::Post.new(url.request_uri)
      req["authorization"] = "Basic #{encode_str}"
      req.set_form_data("grant_type" => "refresh_token", "refresh_token" => refresh_token)

      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == "https")

      http.request(req).read_body
    end
  end
end
