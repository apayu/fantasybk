desc "新增NBA球隊"
namespace :nba do
  task :create_team => :environment do
    api_teams = Nba.all_teams
    teams = Team.all

    Team.transaction do
      api_teams.each do |team|
        if team["isNBAFranchise"]
          Team.create(teamId: team["teamId"], city: team["city"], fullName: team["fullName"], tricode: team["tricode"], confName: team["confName"], divName: team["divName"])
        end
      end
    end

    puts teams.count
  end
end
