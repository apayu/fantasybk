class Api::V1::PlayersController < ApplicationController
  def show
    player = []
    # by week
    # 賽季開始日期
    game_start = Date.parse("2019-10-22")
    # 賽季結束日期
    game_end = Date.parse("2020-04-15")
    # 目前週數
    current_week = Date.parse("2019-10-22")
    week = 0

    conditions = ["points", "three_point", "assists", "steals", "blocks", "field_goal", "free_throw", "off_reb", "def_reb", "turnovers", "p_fouls"]

    while current_week < DateTime.now.utc.to_date && current_week <= game_end do
      week_start = current_week.strftime("%F")
      week_end = (current_week + 7).strftime("%F")
      player << {
        "week": week + 1,
        # "data": ZScore.player_value_by_week(82, week_start, week_end, params[:player_id]).to_a[0]
        "value": get_rank_value(ZScore.player_value_by_week(82, week_start, week_end, params[:player_id]).to_a[0], conditions)
      }
      current_week += 7
      week += 1
    end

    if player
      render json: { playerWeekValue: player }
    else
      render json: player.errors
    end
  end

  private
  def get_rank_value(value, conditions)
    rank_value = 0

    unless value.nil?
        conditions.each do |condition|

        case condition
        when "points"
          rank_value += value["points_value"].to_f
        when "three_point"
          rank_value += value["three_point_value"].to_f
        when "assists"
          rank_value += value["assists_value"].to_f
        when "steals"
          rank_value += value["steals_value"].to_f
        when "blocks"
          rank_value += value["blocks_value"].to_f
        when "field_goal"
          rank_value += value["field_goal_value"].to_f
        when "free_throw"
          rank_value += value["free_throw_value"].to_f
        when "off_reb"
          rank_value += value["off_reb_value"].to_f
        when "def_reb"
          rank_value += value["def_reb_value"].to_f
        when "turnovers"
          rank_value += value["turnovers_value"].to_f
        when "p_fouls"
          rank_value += value["p_fouls_value"].to_f
        end
      end
    end

    return rank_value
  end
end
