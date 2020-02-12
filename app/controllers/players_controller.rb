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
    points_avg = ZScore.league_avg("points", condition)
    points_standard_deviation = ZScore.standard_deviation("points", condition)

    three_point_avg = ZScore.league_avg("tpm", condition)
    three_point_standard_deviation = ZScore.standard_deviation("tpm", condition)

    assists_avg = ZScore.league_avg("assists", condition)
    assists_standard_deviation = ZScore.standard_deviation("assists", condition)

    steals_avg = ZScore.league_avg("steals", condition)
    steals_standard_deviation = ZScore.standard_deviation("steals", condition)

    steals_avg = ZScore.league_avg("steals", condition)
    steals_standard_deviation = ZScore.standard_deviation("steals", condition)

    blocks_avg = ZScore.league_avg("blocks", condition)
    blocks_standard_deviation = ZScore.standard_deviation("blocks", condition)

    field_goal_percentage_avg = ZScore.league_percentage_avg("fgm", "fga", condition)
    field_goal_percentage_standard_deviation = ZScore.standard_deviation_percentage("fgm", "fga", condition)

    free_throw_percentage_avg = ZScore.league_percentage_avg("ftm", "fta", condition)
    free_throw_percentage_standard_deviation = ZScore.standard_deviation_percentage("ftm", "fta", condition)

    off_reb_avg = ZScore.league_avg("off_reb", condition)
    off_reb_standard_deviation = ZScore.standard_deviation("off_reb", condition)

    def_reb_avg = ZScore.league_avg("def_reb", condition)
    def_reb_standard_deviation = ZScore.standard_deviation("def_reb", condition)

    turnovers_avg = ZScore.league_avg("turnovers", condition)
    turnovers_standard_deviation = ZScore.standard_deviation("turnovers", condition)

    p_fouls_avg = ZScore.league_avg("p_fouls", condition)
    p_fouls_standard_deviation = ZScore.standard_deviation("p_fouls", condition)

    @players = ZScore.player_value_by_game(condition).to_a

    # # 計算player value
    @players.each do |p|
      p["points_value"] = ZScore.get_zscore(p["points"].to_f, points_avg, points_standard_deviation)
      p["three_point_value"] = ZScore.get_zscore(p["tpm"].to_f, three_point_avg, three_point_standard_deviation)
      p["assists_value"] = ZScore.get_zscore(p["assists"].to_f, assists_avg, assists_standard_deviation)
      p["steals_value"] = ZScore.get_zscore(p["steals"].to_f, steals_avg, steals_standard_deviation)
      p["blocks_value"] = ZScore.get_zscore(p["blocks"].to_f, blocks_avg, blocks_standard_deviation)
      p["field_goal_value"] = ZScore.get_zscore(p["fgp"].to_f, field_goal_percentage_avg, field_goal_percentage_standard_deviation)
      p["free_throw_value"] = ZScore.get_zscore(p["ftp"].to_f, free_throw_percentage_avg, free_throw_percentage_standard_deviation)
      p["off_reb_value"] = ZScore.get_zscore(p["off_reb"].to_f, off_reb_avg, off_reb_standard_deviation)
      p["def_reb_value"] = ZScore.get_zscore(p["def_reb"].to_f, def_reb_avg, def_reb_standard_deviation)
      p["turnovers_value"] = ZScore.get_zscore(p["turnovers"].to_f, turnovers_avg, turnovers_standard_deviation) * -1
      p["p_fouls_value"] = ZScore.get_zscore(p["p_fouls"].to_f, p_fouls_avg, p_fouls_standard_deviation) * -1
      p["rank_value"] = get_rank_value(p, @value_item)
    end
  end

  def conditions
    session[:search_conditions] = nil
    session[:search_conditions] = params[:conditions]

    redirect_to root_path
  end

  def show
    @player = Player.find_by(api_person_id:params[:api_person_id])
  end

  def search
    if params[:search].blank?
      redirect_to root_path
    else
      player = Player.find_by(name: params[:search])
      redirect_to player_path(player.api_person_id)
    end
  end

  private
  def get_rank_value(value, conditions)

    rank_value = 0

    conditions.each do |condition|
      case condition
      when "points"
        rank_value += value["points_value"]
      when "three_point"
        rank_value += value["three_point_value"]
      when "assists"
        rank_value += value["assists_value"]
      when "steals"
        rank_value += value["steals_value"]
      when "blocks"
        rank_value += value["blocks_value"]
      when "field_goal"
        rank_value += value["field_goal_value"]
      when "free_throw"
        rank_value += value["free_throw_value"]
      when "off_reb"
        rank_value += value["off_reb_value"]
      when "def_reb"
        rank_value += value["def_reb_value"]
      when "turnovers"
        rank_value += value["turnovers_value"]
      when "p_fouls"
        rank_value += value["p_fouls_value"]
      end
    end

    return rank_value
  end
end
