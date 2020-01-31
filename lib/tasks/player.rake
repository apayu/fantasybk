desc "新增球員，不重複新增"
namespace :nba do
  task :update_player => :environment do
    api_players = Nba.all_players
    players = Player.all

    Player.transaction do
      api_players.each do |player|

        has_player = Player.find_by(personId: player["personId"])
        team = Team.find_by(teamId: player["teamId"])
        name = "#{player["firstName"]} #{player["lastName"]}"

        if player["isActive"] && has_player.nil?
          Player.create(name: name, personId: player["personId"], team_id: team.id, pos: player["pos"], inj: false)
        elsif player["isActive"]
          has_player.update(name: name, personId: player["personId"], team_id: team.id, pos: player["pos"], inj: false)
        end

      end
    end

    puts players.count
  end
end
