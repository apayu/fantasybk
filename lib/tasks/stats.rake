desc "更新球員狀態"
namespace :nba do
  task :stats => :environment do

    players = Player.all

    # for leagues
    point_total = 0
    three_point_total = 0
    assists_total = 0
    steals_total = 0
    blocks_total = 0
    field_goal_m = 0
    field_goal_a = 0
    free_throw_m = 0
    free_throw_a = 0
    off_reb_total = 0
    def_reb_total = 0
    turnovers_total = 0
    p_fouls_total = 0

    # for player
    Stat.transaction do
      players.each do |player|

        player_stats = Nba.player_stats("2019",player.api_person_id.to_s)
        player_old_stats = Stat.find_by(player_id: player.id)

        #處理負數問題
        if player_stats["points"].to_i >= 0
          point_total += player_stats["points"].to_i
          three_point_total += player_stats["tpm"].to_i
          assists_total += player_stats["assists"].to_i
          steals_total += player_stats["steals"].to_i
          blocks_total += player_stats["blocks"].to_i
          field_goal_m += player_stats["fgm"].to_i
          field_goal_a += player_stats["fga"].to_i
          free_throw_m += player_stats["ftm"].to_i
          free_throw_a += player_stats["fta"].to_i
          off_reb_total += player_stats["offReb"].to_i
          def_reb_total += player_stats["defReb"].to_i
          turnovers_total += player_stats["turnovers"].to_i
          p_fouls_total += player_stats["pFouls"].to_i
        end

        three_per_game = (player_stats["tpm"].to_f / player_stats["gamesPlayed"].to_f).round(1)
        off_reb_per_game = (player_stats["offReb"].to_f / player_stats["gamesPlayed"].to_f).round(1)
        def_reb_per_game = (player_stats["defReb"].to_f / player_stats["gamesPlayed"].to_f).round(1)
        p_fouls_per_game = (player_stats["pFouls"].to_f / player_stats["gamesPlayed"].to_f).round(1)

       if player_old_stats
          player_old_stats.update(
            season_year: player_stats["seasonYear"].to_i,
            season_stage_id: player_stats["seasonStageId"].to_i,
            assists: player_stats["assists"].to_i,
            blocks: player_stats["blocks"].to_i,
            steals: player_stats["steals"].to_i,
            turnovers: player_stats["turnovers"].to_i,
            off_reb: player_stats["offReb"].to_i,
            def_reb: player_stats["defReb"].to_i,
            tot_reb: player_stats["totReb"].to_i,
            fgm: player_stats["fgm"].to_i,
            fga: player_stats["fga"].to_i,
            tpm: player_stats["tpm"].to_i,
            tpa: player_stats["tpa"].to_i,
            ftm: player_stats["ftm"].to_i,
            fta: player_stats["fta"].to_i,
            p_fouls: player_stats["pFouls"].to_i,
            points: player_stats["points"].to_i,
            games_played: player_stats["gamesPlayed"].to_i,
            games_started: player_stats["gamesStarted"].to_i,
            plus_minus: player_stats["plusMinus"].to_i,
            min: player_stats["min"].to_i,
            dd2: player_stats["dd2"].to_i,
            td3: player_stats["td3"].to_i,
            min_per_game: player_stats["mpg"].to_f,
            points_per_game: player_stats["ppg"].to_f,
            three_per_game: three_per_game,
            assists_per_game: player_stats["apg"].to_f,
            steals_per_game: player_stats["spg"].to_f,
            blocks_per_game: player_stats["bpg"].to_f,
            field_goal_percentage: player_stats["fgp"].to_f,
            free_throw_percentage: player_stats["ftp"].to_f,
            off_reb_per_game: off_reb_per_game,
            def_reb_per_game: def_reb_per_game,
            turnovers_per_game: player_stats["topg"].to_f,
            p_fouls_per_game: p_fouls_per_game
          )
          puts "update stats player name: " + player.name
        else
         Stat.create(
            player_id: player.id,
            season_year: player_stats["seasonYear"].to_i,
            season_stage_id: player_stats["seasonStageId"].to_i,
            assists: player_stats["assists"].to_i,
            blocks: player_stats["blocks"].to_i,
            steals: player_stats["steals"].to_i,
            turnovers: player_stats["turnovers"].to_i,
            off_reb: player_stats["offReb"].to_i,
            def_reb: player_stats["defReb"].to_i,
            tot_reb: player_stats["totReb"].to_i,
            fgm: player_stats["fgm"].to_i,
            fga: player_stats["fga"].to_i,
            tpm: player_stats["tpm"].to_i,
            tpa: player_stats["tpa"].to_i,
            ftm: player_stats["ftm"].to_i,
            fta: player_stats["fta"].to_i,
            p_fouls: player_stats["pFouls"].to_i,
            points: player_stats["points"].to_i,
            games_played: player_stats["gamesPlayed"].to_i,
            games_started: player_stats["gamesStarted"].to_i,
            plus_minus: player_stats["plusMinus"].to_i,
            min: player_stats["min"].to_i,
            dd2: player_stats["dd2"].to_i,
            td3: player_stats["td3"].to_i,
            min_per_game: player_stats["mpg"].to_f,
            points_per_game: player_stats["ppg"].to_f,
            three_per_game: three_per_game,
            assists_per_game: player_stats["apg"].to_f,
            steals_per_game: player_stats["spg"].to_f,
            blocks_per_game: player_stats["bpg"].to_f,
            field_goal_percentage: player_stats["fgp"].to_f,
            free_throw_percentage: player_stats["ftp"].to_f,
            off_reb_per_game: off_reb_per_game,
            def_reb_per_game: def_reb_per_game,
            turnovers_per_game: player_stats["topg"].to_f,
            p_fouls_per_game: p_fouls_per_game
          )

          puts "create stats player name: " + player.name
        end
      end
    end

    field_goal_percentage = (field_goal_m.fdiv(field_goal_a)*100).round(1)
    free_throw_percentage = (free_throw_m.fdiv(free_throw_a)*100).round(1)

    if League.all.count == 0
      League.create(
        point_total: point_total,
        three_point_total: three_point_total,
        assists_total: assists_total,
        steals_total: steals_total,
        blocks_total: blocks_total,
        field_goal_avg: field_goal_percentage,
        free_throw_avg: free_throw_percentage,
        off_reb_total: off_reb_total,
        def_reb_total: def_reb_total,
        turnovers_total: turnovers_total,
        p_fouls_total: p_fouls_total
      )
    else
      League.update(
        point_total: point_total,
        three_point_total: three_point_total,
        assists_total: assists_total,
        steals_total: steals_total,
        blocks_total: blocks_total,
        field_goal_avg: field_goal_percentage,
        free_throw_avg: free_throw_percentage,
        off_reb_total: off_reb_total,
        def_reb_total: def_reb_total,
        turnovers_total: turnovers_total,
        p_fouls_total: p_fouls_total
      )
    end

      puts "point_total: #{point_total}"
      puts "three_point_total: #{three_point_total}"
      puts "assists_total: #{assists_total}"
      puts "steals_total: #{steals_total}"
      puts "blocks_total: #{blocks_total}"
      puts "field_goal_percentage: #{field_goal_percentage}"
      puts "free_throw_percentage: #{free_throw_percentage}"
      puts "off_reb_total: #{off_reb_total}"
      puts "def_reb_total: #{def_reb_total}"
      puts "turnovers_total: #{turnovers_total}"
      puts "p_fouls_total: #{p_fouls_total}"

  end
end

