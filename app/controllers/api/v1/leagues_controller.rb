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

      league_id = current_user.league_id
      league = get_fantasy_league_setting(token, league_id)
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
        new_scoreboard = get_fantasy_all_matchup(token, league_id, league_stats, user_current_week, league_current_week)
        # 新舊合併
        scoreboards = post_scoreboard + new_scoreboard

        # post_scoreboard 有新的 scoreboard 就更新
        if user_current_week != league_current_week
          post_scoreboard = scoreboards.select { |s| s[:week] != league_current_week }
          user_scoreboard.update(post_scoreboard: post_scoreboard, current_week: league_current_week)
        end
      else
        scoreboards = get_fantasy_all_matchup(token, league_id, league_stats, league_start_week, league_current_week)
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

  def roster
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

      user_filter = session[:search_conditions]

      league_id = current_user.league_id
      team_key = params["team_id"].split(",").map{ |team_id, index| "395.l.#{league_id}.t.#{team_id}"}
      team_key = team_key.join(",")
      result = get_fantasy_team_roster(token, team_key)

      players = ZScore.player_value_by_game(82).to_a

      # 計算player value
      players.each do |p|
        p["rank_value"] = get_rank_value(p, user_filter["conditions"])
      end

      # 排序
      new_players = players.sort { |a, b| b["rank_value"] <=> a["rank_value"] }


      team_list = []
      result["fantasy_content"]["teams"]["team"].map do |t|
        player_list =  t["players"]["player"].map do |p|
          # 找出球員數據
          p2 = new_players.select { |player_with_value| player_with_value["name"] == p["name"]["full"] }
          # 算出rank
          rank = new_players.index { |player_with_value| player_with_value["name"] == p["name"]["full"] }
          p2[0]["rank"] = rank
          if p["status"].to_s.downcase == "inj"
            p2[0]["inj"] = true
            p2[0]
          else
            p2[0]
          end
        end

        team_list << {
          teamName: t["name"],
          teamRoster: player_list
        }
      end

      render json: {
                     teamRosters: team_list
      }
    end
  end

  private

  def get_rank_value(value, conditions)
    rank_value = 0

    conditions.each do |condition|

      case condition
      when "points"
        rank_value += value["points_value"].to_f
      when "three_point"
        rank_value += value["three_point_value"].to_f
      when "assists"
        rank_value += value["assists_value"].to_f
      when "steals"
        rank_value += value["steals_value"].to_f
      when "blocks"
        rank_value += value["blocks_value"].to_f
      when "field_goal"
        rank_value += value["field_goal_value"].to_f
      when "free_throw"
        rank_value += value["free_throw_value"].to_f
      when "off_reb"
        rank_value += value["off_reb_value"].to_f
      when "def_reb"
        rank_value += value["def_reb_value"].to_f
      when "turnovers"
        rank_value += value["turnovers_value"].to_f
      when "p_fouls"
        rank_value += value["p_fouls_value"].to_f
      end
    end

    return rank_value
  end

  def get_fantasy_team_roster(token, team_key)
    Hash.from_xml(YahooApi.get_team_roster(token, team_key).gsub("\n", ""))
  end

  def get_fantasy_league_setting(token, league_id)
    Hash.from_xml(YahooApi.get_league_setting(token, league_id).gsub("\n", ""))
  end

  def get_fantasy_all_matchup(token, league_id, stats, start_week, current_week)

    scoreboard_hash = Hash.from_xml(YahooApi.get_league_scoreboard(token, league_id, start_week.to_i, current_week.to_i).gsub("\n", ""))

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
