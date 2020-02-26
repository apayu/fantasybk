class Api::V1::LeaguesController < ApplicationController
  def index
    # 是否登入
    unless  current_user.token.nil?
      token = current_user.token

      # 過期要更新toke
      if current_user.expires_at - Time.now.utc < 0
        new_token = JSON.parse(YahooApi.get_new_token(current_user.refresh_token))
        user = User.find(current_user.id)
        user.token = new_token["access_token"]
        user.expires_at = Time.now.utc + new_token["expires_in"].to_i
        user.refresh_token = new_token["refresh_token"]
        user.save
        token = new_token["access_token"]
      end

      league = get_fantasy_league_setting(token)
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

      user_scoreboard = Scoreboard.find_by(user_id: current_user.id)

      if user_scoreboard
        # user 目前取得的week
        user_current_week = user_scoreboard.current_week
        # user 目前有的socreboard
        post_scoreboard = user_scoreboard.post_scoreboard
        # 新的 socreboard
        new_scoreboard = get_fantasy_all_matchup(token, league_stats, user_current_week, league_current_week)
        # 新舊合併
        scoreboards = post_scoreboard + new_scoreboard

        # post_scoreboard 有新的 scoreboard 就更新
        if user_current_week != league_current_week
          post_scoreboard = scoreboards.select { |s| s[:week] != league_current_week }
          user_scoreboard.update(post_scoreboard: post_scoreboard, current_week: league_current_week)
        end
      else
        scoreboards = get_fantasy_all_matchup(token, league_stats, league_start_week, league_current_week)
        # 將非當週的scoreboard取出
        post_scoreboard = scoreboards.select { |s| s[:week] != league_current_week }
        Scoreboard.create(user_id: current_user.id, post_scoreboard: post_scoreboard, current_week: league_current_week)
      end

      render json: {

                     league_name: league_name,
                     league_num_teams: league_num_teams,
                     league_start_week: league_start_week,
                     league_current_week: league_current_week,
                     league_stats: league_stats,
                     scoreboard: scoreboards
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
