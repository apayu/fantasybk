desc "新增NBA球隊"
namespace :nba do
  task :team => :environment do
    api_teams = Nba.all_teams

    Team.transaction do
      api_teams.each do |team|
        old_team = Team.find_by(teamId: team["teamId"])

        if team["isNBAFranchise"] && old_team.nil?
          Team.create(teamId: team["teamId"], city: team["city"], fullName: team["fullName"], tricode: team["tricode"], confName: team["confName"], divName: team["divName"])

          puts "create team: " + team["fullName"]
        end
      end
    end

    puts Team.all.count

  end
end
