desc "更新球員價值"
namespace :nba do
  task :value => :environment do
    players = Player.all

    point_total = League.first.point_total
    three_point_total = League.first.three_point_total
    assists_total = League.first.assists_total
    steals_total = League.first.steals_total
    blocks_total = League.first.blocks_total
    field_goal_avg = League.first.field_goal_avg
    free_throw_avg = League.first.free_throw_avg
    off_reb_total = League.first.off_reb_total
    def_reb_total = League.first.def_reb_total
    turnovers_total = League.first.turnovers_total
    p_fouls_total = League.first.p_fouls_total

    Value.transaction do
      players.each do |player|
        player_old_value = Value.find_by(player_id: player.id)

        points_value = (player.stat.points.fdiv(point_total) *100).round(2)
        three_point_value = (player.stat.tpa.fdiv(three_point_total) *100).round(2)
        assists_value = (player.stat.assists.fdiv(assists_total) *100).round(2)
        steals_value = (player.stat.steals.fdiv(steals_total) *100).round(2)
        blocks_value = (player.stat.blocks.fdiv(blocks_total) *100).round(2)
        field_goal_value = player.stat.field_goal_percentage.fdiv(field_goal_avg).round(2)
        free_throw_value = player.stat.free_throw_percentage.fdiv(free_throw_avg).round(2)
        off_reb_value = (player.stat.off_reb.fdiv(off_reb_total) *100).round(2)
        def_reb_value = (player.stat.def_reb.fdiv(def_reb_total) *100).round(2)
        turnovers_value = (player.stat.turnovers.fdiv(turnovers_total) *100).round(2)
        p_fouls_value = (player.stat.p_fouls.fdiv(p_fouls_total) *100).round(2)


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
            turnovers_value: turnovers_value,
            p_fouls_value: p_fouls_value
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
            turnovers_value: turnovers_value,
            p_fouls_value: p_fouls_value
          )

          puts "create player name: " + player.name
        end
      end
    end
  end

end
