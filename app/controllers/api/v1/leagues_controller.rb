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

      # 比項設定
      # todo
      # 需要改成讀取使用者設定
      # user_filter = session[:search_conditions]
      user_filter = ["points_value", "three_point_value", "assists_value", "steals_value", "blocks_value", "field_goal_value", "free_throw_value", "off_reb_value", "def_reb_value", "turnovers_value", "p_fouls_value"]


      league_id = current_user.league_id

      # 尋找聯盟team id
      league_team = Hash.from_xml(YahooApi.get_league_team(token, league_id).gsub("\n", ""))
      team_id_list = league_team["fantasy_content"]["league"]["teams"]["team"].map { |t| t["team_id"] }

      team_key = team_id_list.map{ |team_id, index| "395.l.#{league_id}.t.#{team_id}"}
      team_key = team_key.join(",")
      result = get_fantasy_team_roster(token, team_key)

      players = ZScore.player_value_by_game(82).to_a

      # 計算player value
      players.each do |p|
        p["rank_value"] = get_rank_value(p, user_filter)
      end

      # 排序
      new_players = players.sort { |a, b| b["rank_value"] <=> a["rank_value"] }


      team_list = []
      result["fantasy_content"]["teams"]["team"].map do |t|
        player_list =  t["players"]["player"].map do |p|
          # 找出球員數據
          p2 = new_players.select do |player_with_value|
            player_a = player_with_value["name"].to_s + player_with_value["tricode"].to_s
            player_b = p["name"]["full"].to_s + fix_team_name(p["editorial_team_abbr"].to_s)
            player_a.to_s.downcase.gsub(/[^a-zA-Z]/,"") == player_b.to_s.downcase.gsub(/[^a-zA-Z]/,"")
          end

          # 算出rank
          rank = new_players.index do |player_with_value|
            player_a = player_with_value["name"].to_s + player_with_value["tricode"].to_s
            player_b = p["name"]["full"].to_s + fix_team_name(p["editorial_team_abbr"].to_s)
            player_a.to_s.downcase.gsub(/[^a-zA-Z]/,"") == player_b.to_s.downcase.gsub(/[^a-zA-Z]/,"")
          end

          byebug
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
          teamId: t["team_id"],
          teamRoster: player_list
        }
      end

      render json: {
              leagueTeamInfo:{
                teamRosters: team_list,
                itemSetting: user_filter
              }
            }
    end
  end

  private

  def fix_team_name(team_name)
    case team_name.downcase
    when "sa"
      "sas"
    when "ny"
      "nyk"
    when "no"
      "nop"
    when "pho"
      "phx"
    when "gs"
      "gsw"
    else
      team_name
    end
  end

  def get_rank_value(value, conditions)
    rank_value = 0

    conditions.each do |condition|
      rank_value += value[condition].to_f
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
