class Api::V1::LeaguesController < ApplicationController
  def index
    token = "Q0Pkb02b7ww5mI9pBX5H007H9u3rkasP.LQdWfqbhUPsggpvThWOkWZMnqYW3u_NDWGoQLXahQ_oX71ruCUYst_49Zl5dFa3lWignFyrqsBAH0a5opizYjXInbsrnBubo91WBOzuaFhKqWj0OhhNTgQK.S.S6ocieuYXfsNCK8XoKzIptSc6gZ.B5CExvibKDqOVkwxAe.f3N0GG.skc2V9kEDEQYhlLC6Sbu1BRDgcddFmHd1xViyDhV26sA6uFe8uvV2402aNBjZtHGl5G34gXNJiJZsE9pgJmoqAEZCsOzHkQqKIyCbYPTV93mVs6N_WIH8OhezE1GTEiFuvuLCuEH8gZXf2iy2oHjD8ROK1iaPBR6q_oZTcYxoSRja1bkRzrPTttREH_b_A0kBSKb0BsHryxcY3SfBYeXxaYiAxvjs2RVj0gduHrWEUv.6CeVtf7tsJjCgSklqgDX.tmcBsgLWIb3OaN9eFoMn8AoKDDerbzwegRAUf3mZtb0D4ZjVhf40IHHNRIvj_ZyKctIAWwbQzfCgPKVQEWzyZIBzpm4oucaz2Q8MbFUbcHVkRNCDbYaHJOtobE86ruQybVpQoNHi9R_VOGJk1bdW.QjF3TE_eRWUCvhxgZSNJevziONtzAyizkVGLjCqJ1irDU6G9f5hech7vsrWOzWl5p8A0aNr3HFWJR5g_31I2Y23xVThJ_GV1SZopn_Oj9hhGQfpb0aysiCA_75Z8n1KEhLCX2NpowBxyiPOYAZPT9gbyRYa1AueGvG8KWGTbpaUxIjmwKf9BiipbaBw1rePtEX8FkIMI2I0hLClLg8.3hGnTB45.9Lm3TN5q4kJZc4d76h8v6CcDK.qPGQVCMW2iHe.ktkqPwKzUTJhfvXsXcanNtioCiG6FGfblzwYNe5K0d_zg9nGHWOe.5FfSBMOw4LoerZUIovQyLoJYyFpX1Z4zsO6J_bECqtbeIsmqngLfhKDl6hms1EYxqjb5f5TC7NgfhFQlP92zwwwvXqQmpDNFYsO3FV8ISLCFYhx5poG_Qko6R4mHKSWtizVL8HwB3gu0e9kKBYmzq9W_bQGXoQnczRBBpWfCaBpFmXg--"

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

    render json: scoreboard
  end
end
