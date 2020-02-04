require './lib/z_score'
desc "更新球員價值"
namespace :nba do
  task :value => :environment do
    condition = "games_played > 40"

    points_avg = ZScore.league_avg(:points, condition)
    points_standard_deviation = ZScore.standard_deviation("points", condition)

    three_point_avg = ZScore.league_avg(:tpa, condition)
    three_point_standard_deviation = ZScore.standard_deviation("tpa", condition)

    assists_avg = ZScore.league_avg(:assists, condition)
    assists_standard_deviation = ZScore.standard_deviation("assists", condition)

    steals_avg = ZScore.league_avg(:steals, condition)
    steals_standard_deviation = ZScore.standard_deviation("steals", condition)

    steals_avg = ZScore.league_avg(:steals, condition)
    steals_standard_deviation = ZScore.standard_deviation("steals", condition)

    blocks_avg = ZScore.league_avg(:blocks, condition)
    blocks_standard_deviation = ZScore.standard_deviation("blocks", condition)

    field_goal_percentage_avg = ZScore.league_avg(:field_goal_percentage, condition)
    field_goal_percentage_standard_deviation = ZScore.standard_deviation("field_goal_percentage", condition)

    free_throw_percentage_avg = ZScore.league_avg(:free_throw_percentage, condition)
    free_throw_percentage_standard_deviation = ZScore.standard_deviation("free_throw_percentage", condition)

    off_reb_avg = ZScore.league_avg(:off_reb, condition)
    off_reb_standard_deviation = ZScore.standard_deviation("off_reb", condition)

    def_reb_avg = ZScore.league_avg(:def_reb, condition)
    def_reb_standard_deviation = ZScore.standard_deviation("def_reb", condition)

    turnovers_avg = ZScore.league_avg(:turnovers, condition)
    turnovers_standard_deviation = ZScore.standard_deviation("turnovers", condition)

    p_fouls_avg = ZScore.league_avg(:p_fouls, condition)
    p_fouls_standard_deviation = ZScore.standard_deviation("p_fouls", condition)

    players = Player.all

    Value.transaction do
      players.each do |player|
        player_old_value = Value.find_by(player_id: player.id)

        points_value = ZScore.get_zscore(player.stat.points, points_avg, points_standard_deviation)
        three_point_value = ZScore.get_zscore(player.stat.tpa, three_point_avg, three_point_standard_deviation)
        assists_value = ZScore.get_zscore(player.stat.assists, assists_avg, assists_standard_deviation)
        steals_value = ZScore.get_zscore(player.stat.steals, steals_avg, steals_standard_deviation)
        blocks_value = ZScore.get_zscore(player.stat.blocks, blocks_avg, blocks_standard_deviation)
        field_goal_value = ZScore.get_zscore(player.stat.field_goal_percentage, field_goal_percentage_avg, field_goal_percentage_standard_deviation)
        free_throw_value = ZScore.get_zscore(player.stat.free_throw_percentage, free_throw_percentage_avg, free_throw_percentage_standard_deviation)
        off_reb_value = ZScore.get_zscore(player.stat.off_reb, off_reb_avg, off_reb_standard_deviation)
        def_reb_value = ZScore.get_zscore(player.stat.def_reb, def_reb_avg, def_reb_standard_deviation)
        turnovers_value = ZScore.get_zscore(player.stat.turnovers, turnovers_avg, turnovers_standard_deviation)
        p_fouls_value = ZScore.get_zscore(player.stat.p_fouls, p_fouls_avg, p_fouls_standard_deviation)

        if player_old_value
          player_old_value.update(
            points_value: points_value,
            three_point_value: three_point_value,
            assists_value: assists_value,
            steals_value: steals_value,
            blocks_value: blocks_value,
            field_goal_value: field_goal_value,
            free_throw_value: free_throw_value,
            off_reb_value: off_reb_value,
            def_reb_value: def_reb_value,
            turnovers_value: (turnovers_value * -1),
            p_fouls_value: (p_fouls_value * -1)
          )
          puts "update player name: " + player.name
        else
          Value.create(
            player_id: player.id,
            points_value: points_value,
            three_point_value: three_point_value,
            assists_value: assists_value,
            steals_value: steals_value,
            blocks_value: blocks_value,
            field_goal_value: field_goal_value,
            free_throw_value: free_throw_value,
            off_reb_value: off_reb_value,
            def_reb_value: def_reb_value,
            turnovers_value: (turnovers_value * -1),
            p_fouls_value: (p_fouls_value * -1)
          )

          puts "create player name: " + player.name
        end
      end
    end
  end

end
