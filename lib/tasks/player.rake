desc "新增球員，不重複新增"
namespace :nba do
  task :player => :environment do
    # api抓球員資料
    api_players = Nba.all_players
    # 資料庫球員資料
    players = Player.all

    Player.transaction do

      api_players.each do |player|
        # 透過api球員id尋找球員
        has_player = Player.find_by(api_person_id: player["personId"])
        # 透過api球隊id尋找球隊
        team = Team.find_by(api_team_id: player["teamId"])
        name = "#{player["firstName"]} #{player["lastName"]}"

        #有球員資料就更新，沒有就新增
        if player["isActive"] && has_player.nil?
          Player.create(name: name, first_name: player["firstName"], last_name: player["lastName"], api2_team_id: team.api2_team_id, api_person_id: player["personId"], team_id: team.id, pos: player["pos"], inj: false)

          puts "create player name: " + name
        elsif player["isActive"]
          has_player.update(name: name, first_name: player["firstName"], last_name: player["lastName"], api2_team_id:team.api2_team_id, api_person_id: player["personId"], team_id: team.id, pos: player["pos"], inj: false)

          puts "update player name: " + name
        end

      end
    end

    puts players.count
  end
end
