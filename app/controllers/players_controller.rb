class PlayersController < ApplicationController

  def index
    @value_item = ["points", "three_point", "assists", "steals", "blocks", "field_goal", "free_throw", "off_reb", "def_reb", "turnovers", "p_fouls"]

    # rank value 條件
    if session[:search_conditions].nil?
      session[:search_conditions] = @value_item
    else
      @value_item = session[:search_conditions]
    end

    condition = 20

    @players = ZScore.player_value_by_game(condition).to_a

    # # 計算player value
    @players.each do |p|
      p["rank_value"] = get_rank_value(p, @value_item)
    end
  end

  def conditions
    session[:search_conditions] = nil
    session[:search_conditions] = params[:conditions]

    redirect_to root_path
  end

  def show
    @player = Player.find_by(id: params[:player_id])
  end

  def search
    if params[:search].blank?
      redirect_to root_path
    else
      player = Player.find_by(name: params[:search])
      redirect_to player_path(player.id)
    end
  end

  private
  def get_rank_value(value, conditions)

    rank_value = 0

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

    return rank_value
  end
end
