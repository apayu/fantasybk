require './lib/nba_api'
desc "新增NBA api2_team_id"
namespace :nba_api do
  task :team => :environment do
    api_teams = NbaApi.get_all_teams

    Team.transaction do
      api_teams.each do |team|
        has_team = Team.find_by(tricode: team["shortName"])

        unless  has_team.nil?
          has_team.update(api2_team_id: team["teamId"])
          puts "update api2_team_id team " + team["fullName"]

        end
      end
    end

    puts Team.all.count

  end
end
