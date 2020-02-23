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

    while current_week < DateTime.now.utc.to_date && current_week <= game_end do
      week_start = current_week.strftime("%F")
      week_end = (current_week + 7).strftime("%F")
      player << {
        "week": week + 1,
        "data": ZScore.player_value_by_week(82, week_start, week_end, params[:player_id]).to_a[0]
      }
      current_week += 7
      week += 1
    end

    if player
      render json: player
    else
      render json: player.errors
    end
  end

  private
end
