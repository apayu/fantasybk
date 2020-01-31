desc "更新球員狀態"
namespace :nba do
  task :stats => :environment do

    players = Player.all

    Stat.transaction do

      players.each do |player|

        player_stats = Nba.player_stats("2019",player.personId.to_s)
        player_old_stats = Stat.find_by(player_id: player.id)

        if player_old_stats
          player_old_stats.update(
            seasonYear: player_stats["seasonYear"].to_i,
            seasonStageId: player_stats["seasonStageId"].to_i,
            assists: player_stats["assists"].to_i,
            blocks: player_stats["blocks"].to_i,
            steals: player_stats["steals"].to_i,
            turnovers: player_stats["turnovers"].to_i,
            offReb: player_stats["offReb"].to_i,
            defReb: player_stats["defReb"].to_i,
            totReb: player_stats["totReb"].to_i,
            fgm: player_stats["fgm"].to_i,
            fga: player_stats["fga"].to_i,
            tpm: player_stats["tpm"].to_i,
            tpa: player_stats["tpa"].to_i,
            ftm: player_stats["ftm"].to_i,
            fta: player_stats["fta"].to_i,
            pFouls: player_stats["pFouls"].to_i,
            points: player_stats["points"].to_i,
            gamesPlayed: player_stats["gamesPlayed"].to_i,
            gamesStarted: player_stats["gamesStarted"].to_i,
            plusMinus: player_stats["plusMinus"].to_i,
            min: player_stats["min"].to_i,
            dd2: player_stats["dd2"].to_i,
            td3: player_stats["td3"].to_i
          )
          puts "update stats player id is " + player.id.to_s
        else
         Stat.create(
            player_id: player.id,
            seasonYear: player_stats["seasonYear"].to_i,
            seasonStageId: player_stats["seasonStageId"].to_i,
            assists: player_stats["assists"].to_i,
            blocks: player_stats["blocks"].to_i,
            steals: player_stats["steals"].to_i,
            turnovers: player_stats["turnovers"].to_i,
            offReb: player_stats["offReb"].to_i,
            defReb: player_stats["defReb"].to_i,
            totReb: player_stats["totReb"].to_i,
            fgm: player_stats["fgm"].to_i,
            fga: player_stats["fga"].to_i,
            tpm: player_stats["tpm"].to_i,
            tpa: player_stats["tpa"].to_i,
            ftm: player_stats["ftm"].to_i,
            fta: player_stats["fta"].to_i,
            pFouls: player_stats["pFouls"].to_i,
            points: player_stats["points"].to_i,
            gamesPlayed: player_stats["gamesPlayed"].to_i,
            gamesStarted: player_stats["gamesStarted"].to_i,
            plusMinus: player_stats["plusMinus"].to_i,
            min: player_stats["min"].to_i,
            dd2: player_stats["dd2"].to_i,
            td3: player_stats["td3"].to_i
          )
         puts "create stats player id is " + player.id.to_s
        end
      end

    end
  end
end

