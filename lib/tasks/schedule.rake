require './lib/nba_api'
desc '新增或更新NBA球隊賽程'
namespace :nba do
  task :schedule => :environment do
    api_schedule = NbaApi.get_all_team_schedule(2019)

    Schedule.transaction do
      api_schedule.each do |game|
        game_time_utc = DateTime.parse(game["startTimeUTC"])
        startTimeTW = game_time_utc - 6.hours

        if startTimeTW >= DateTime.new(2019,10,21) && startTimeTW <= DateTime.new(2020,4,16)
          v_team_api_id = game["vTeam"]["teamId"]
          v_team_name =game["vTeam"]["shortName"]
          h_team_api_id = game["hTeam"]["teamId"]
          h_team_name =game["hTeam"]["shortName"]
          game_id = game["gameId"]

          # 客隊
          v_team_schedule = Schedule.where("api2_team_id = ? AND game_id = ?", v_team_api_id, game_id)
          v_team = Team.find_by(api2_team_id: v_team_api_id)
          if v_team_schedule.first.nil? && !v_team.nil?
            Schedule.create(
              team_id: v_team.id,
              game_id: game_id,
              api2_team_id: v_team_api_id,
              game_time: game_time_utc
            )
            puts "---------------------------"
            puts "新增一筆 隊名:#{v_team_name} 時間:#{startTimeTW} game_id:#{game_id}"
            puts "---------------------------"
          end

          # 主隊
          h_team_schedule = Schedule.where("api2_team_id = ? AND game_id = ?", h_team_api_id, game_id)
          h_team = Team.find_by(api2_team_id: h_team_api_id)
          if h_team_schedule.first.nil? && !h_team.nil?
            Schedule.create(
              team_id: h_team.id,
              game_id: game_id,
              api2_team_id: h_team_api_id,
              game_time: game_time_utc
            )
            puts "---------------------------"
            puts "新增一筆 隊名:#{h_team_name} 時間:#{startTimeTW} game_id:#{game_id}"
            puts "---------------------------"
          end
        end
      end
    end
  end
end
