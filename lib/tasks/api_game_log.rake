require './lib/nba_api'
desc "新增NBA game log"
namespace :nba_api do
  task :game_log => :environment do
    # 依據日期尋找比賽
    # api_game_log = NbaApi.get_day_game_log(DateTime.yesterday.strftime("%F"))

    # 查詢過去xx天
    d = Date.today
    30.times do |day|
      api_game_log = NbaApi.get_day_game_log((d - (day + 1)).strftime("%F"))

      GameLog.transaction do
        api_game_log.each do |game|
          # 依據比賽尋找當天出賽球員
          players_stats = NbaApi.get_player_game_log(game["gameId"])

          puts "比賽: #{game["gameId"]}"

          players_stats.each do |player|
            puts "球員: #{player["playerId"]}"

            has_player = Player.find_by(api2_person_id: player["playerId"])

            # 資料庫有球員且有上場紀錄才存入
            if !has_player.nil? && player["min"] != "0:00"
              has_game_log = GameLog.where("api2_person_id = ? AND api2_game_id = ?", player["playerId"], player["gameId"])

              if has_game_log.first.nil?
                GameLog.create(
                  player_id: has_player.id,
                  api2_person_id: player["playerId"].to_i,
                  api2_game_id: game["gameId"].to_i,
                  points: player["points"].to_i,
                  min: player["min"],
                  fgm: player["fgm"].to_i,
                  fga: player["fga"].to_i,
                  fgp: player["fgp"].to_i,
                  ftm: player["ftm"].to_i,
                  fta: player["fta"].to_i,
                  ftp: player["ftp"].to_i,
                  tpm: player["tpm"].to_i,
                  tpa: player["tpa"].to_i,
                  tpp: player["tpp"].to_i,
                  off_reb: player["offReb"].to_i,
                  def_reb: player["defReb"].to_i,
                  tot_reb: player["totReb"].to_i,
                  assists: player["assists"].to_i,
                  steals: player["steals"].to_i,
                  blocks: player["blocks"].to_i,
                  turnovers: player["turnovers"].to_i,
                  p_fouls: player["pFouls"].to_i,
                  game_time: Time.parse(game["startTimeUTC"]),
                  h_team: game["hTeam"]["shortName"],
                  v_team: game["vTeam"]["shortName"]
                )
              else
                has_game_log.update(
                  points: player["points"].to_i,
                  min: player["min"],
                  fgm: player["fgm"].to_i,
                  fga: player["fga"].to_i,
                  fgp: player["fgp"].to_i,
                  ftm: player["ftm"].to_i,
                  fta: player["fta"].to_i,
                  ftp: player["ftp"].to_i,
                  tpm: player["tpm"].to_i,
                  tpa: player["tpa"].to_i,
                  tpp: player["tpp"].to_i,
                  off_reb: player["offReb"].to_i,
                  def_reb: player["defReb"].to_i,
                  tot_reb: player["totReb"].to_i,
                  assists: player["assists"].to_i,
                  steals: player["steals"].to_i,
                  blocks: player["blocks"].to_i,
                  turnovers: player["turnovers"].to_i,
                  p_fouls: player["pFouls"].to_i,
                  game_time: Time.parse(game["startTimeUTC"]),
                  h_team: game["hTeam"]["shortName"],
                  v_team: game["vTeam"]["shortName"]
                )
              end
            end
          end
        end
      end
    end
  end
end
