class Api::V1::PlayersController < ApplicationController

  def info
    player = GameLog.where("player_id = ?", params[:player_id])
    league = GameLog.all
    name = player[0].player.name
    team_name = player[0].player.team.full_name
    pos = player[0].player.pos

    points = player.average(:points).round(1)
    league_points = league.average(:points).round(1)

    tpm = player.average(:tpm).round(1)
    league_tpm = league.average(:tpm).round(1)

    tot_reb = player.average(:tot_reb).round(1)
    league_tot_reb = league.average(:tot_reb).round(1)

    assists = player.average(:assists).round(1)
    league_assists = league.average(:assists).round(1)

    steals = player.average(:steals).round(1)
    league_steals = league.average(:steals).round(1)

    blocks = player.average(:blocks).round(1)
    league_blocks = league.average(:blocks).round(1)

    if player
      render json: {
        playerInfo: {
          name: name,
          team_name: team_name,
          pos: pos,
          points: points,
          tpm: tpm,
          tot_reb: tot_reb,
          assists: assists,
          steals: steals,
          blocks: blocks
        },
        leagueInfo: {
          points: league_points,
          tpm: league_tpm,
          tot_reb: league_tot_reb,
          assists: league_assists,
          steals: league_steals,
          blocks: league_blocks
        }
      }
    else
      render json: player.errors
    end
  end

  def show
    player = Player.find(params[:player_id])

    if player
      player_data = []
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
        player_data << {
          "week": week + 1,
          "name": player.name,
          "value": get_rank_value(ZScore.player_value_by_week(82, week_start, week_end, params[:player_id]).to_a[0], conditions),
          "league_value": get_rank_value(ZScore.league_value_by_week(82, week_start, week_end).to_a[0], conditions)
        }
        current_week += 7
        week += 1
      end

      if player_data
        render json: { playerWeekValue: player_data }
      else
        render json: player_data.errors
      end
    else
      render json: player.errors
    end
  end

  def log
    player_game_log = GameLog.where("player_id = ?", params[:player_id]).order(game_time: :desc).limit(10)
    if player_game_log
      render json: { game_log: player_game_log }
    else
      render json: player_game_log.errors
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
