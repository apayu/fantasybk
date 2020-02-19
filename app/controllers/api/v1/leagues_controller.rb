class Api::V1::LeaguesController < ApplicationController
  def index
    unless  current_user.token.nil?
      scoreboard = get_fantasy_current_matchup(current_user.token)
      render json: scoreboard
    else
      render json: []
    end
  end

  private
  def get_fantasy_current_matchup(token)

    scoreboard_hash = Hash.from_xml(YahooApi.get_league_scoreboard(token, 5448).gsub("\n", ""))
    league = Hash.from_xml(YahooApi.get_league_setting(token, 5448).gsub("\n", ""))

    stats = []
    scoreboard = []

    # 聯盟的設定值
    league["fantasy_content"]["league"]["settings"]["stat_categories"]["stats"]["stat"].each do |s|
      stats << {:id => s["stat_id"], :name => s["display_name"]}
    end

    # 聯盟的各組比賽
    scoreboard_hash["fantasy_content"]["league"]["scoreboard"]["matchups"]["matchup"].each do |m|
      # 聯盟的隊伍
      m["teams"]["team"].each do |t|
        team = FantasyTeam.new
        team.name = t["name"]
        team.id = t["team_id"]

        # 比項
        t["team_stats"]["stats"]["stat"].each do |s|
          stats_name = stats.select {|ls| ls[:id].to_s == s["stat_id"].to_s}

          case stats_name[0][:name]
          when "FG%"
            team.fg = s["value"]
          when "FT%"
            team.ft = s["value"]
          when "3PTM"
            team.tpm = s["value"]
          when "PTS"
            team.pts = s["value"]
          when "OREB"
            team.oreb = s["value"]
          when "DREB"
            team.dreb = s["value"]
          when "AST"
            team.ast = s["value"]
          when "ST"
            team.st = s["value"]
          when "BLK"
            team.blk = s["value"]
          when "TO"
            team.to = s["value"]
          when "PF"
            team.pf = s["value"]
          end
        end

        scoreboard << team

      end
    end

    return scoreboard
  end
end
