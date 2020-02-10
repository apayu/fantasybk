require './lib/nba_api'
desc "更新球員 api2_person_id"
namespace :nba_api do
  task :player => :environment do
    # api抓球員資料
    api_players = NbaApi.get_all_players

    count = 0
    Player.transaction do

      api_players.each do |player|
        # 透過api球員last_name first_name team_id尋找球員
        has_player = Player.where("last_name = ? AND first_name = ? AND api2_team_id = ?", player["lastName"] , player["firstName"], player["teamId"])

        #有球員資料就更新 api2_person_id
        unless has_player.first.nil?
          has_player.update(api2_person_id: player["playerId"])
          puts "update player name: " + has_player.first["name"]
          count += 1
        end
      end
    end

    puts Player.all.count
    puts count
  end
end
