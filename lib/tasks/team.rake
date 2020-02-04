desc "新增NBA球隊"
namespace :nba do
  task :team => :environment do
    api_teams = Nba.all_teams

    Team.transaction do
      api_teams.each do |team|
        old_team = Team.find_by(api_team_id: team["teamId"])

        if team["isNBAFranchise"] && old_team.nil?
          Team.create(api_team_id: team["teamId"], city: team["city"], full_name: team["fullName"], tricode: team["tricode"], conf_name: team["confName"], div_name: team["divName"])

          puts "create team: " + team["fullName"]
        end
      end
    end

    puts Team.all.count

  end
end
