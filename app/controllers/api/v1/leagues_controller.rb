class Api::V1::LeaguesController < ApplicationController
  def index
    # 是否登入
    unless  current_user.token.nil?
      league = get_fantasy_league_setting(current_user.token)
      league_name = league["fantasy_content"]["league"]["name"]
      league_num_teams = league["fantasy_content"]["league"]["num_teams"]
      league_scoring_type = league["fantasy_content"]["league"]["scoring_type"]
      league_current_week = league["fantasy_content"]["league"]["current_week"]
      league_start_week = league["fantasy_content"]["league"]["start_week"]
      league_stats = []
      # 聯盟的設定比項
      league["fantasy_content"]["league"]["settings"]["stat_categories"]["stats"]["stat"].each do |s|
        if s["is_only_display_stat"].nil?
          league_stats << {:id => s["stat_id"], :name => s["display_name"], :sort_order => s["sort_order"]}
        end
      end

      scoreboard = get_fantasy_all_matchup(current_user.token, league_stats, league_start_week, league_current_week)
      render json: {
                     league_name: league_name,
                     league_num_teams: league_num_teams,
                     league_start_week: league_start_week,
                     league_current_week: league_current_week,
                     league_stats: league_stats,
                     scoreboard: scoreboard
      }
    else
      render json: []
    end
  end

  private

  def get_fantasy_league_setting(token)
    Hash.from_xml(YahooApi.get_league_setting(token, 5448).gsub("\n", ""))
  end

  def get_fantasy_all_matchup(token, stats, start_week, current_week)

    scoreboard_hash = Hash.from_xml(YahooApi.get_league_scoreboard(token, 5448, start_week.to_i, current_week.to_i).gsub("\n", ""))

    scoreboard = []

    # 聯盟的各組比賽
    scoreboard_hash["fantasy_content"]["league"]["scoreboard"]["matchups"]["matchup"].each do |m|
      # 聯盟的隊伍
      m["teams"]["team"].each do |t|
        team = {
          "week": m["week"],
          "name": t["name"],
          "id": t["team_id"],
          "g": t["team_remaining_games"]["total"]["completed_games"]
        }

        # 比項
        t["team_stats"]["stats"]["stat"].each do |s|
          stats_name = stats.select {|ls| ls[:id].to_s == s["stat_id"].to_s}
          unless stats_name.empty?
            team[stats_name[0][:name]] = s["value"]
          end
        end

        scoreboard << team
      end
    end

    return scoreboard
  end
end
