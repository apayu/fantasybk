class PlayersController < ApplicationController

  def index
    @user_filter = { "conditions" => ["points_value", "three_point_value", "assists_value", "steals_value", "blocks_value", "field_goal_value", "free_throw_value", "off_reb_value", "def_reb_value", "turnovers_value", "p_fouls_value"], "game" => 82 }

    # rank value 條件
    if session[:search_conditions].nil?
      session[:search_conditions] = @user_filter
    else
      @user_filter = session[:search_conditions]
    end

    @players = ZScore.player_value_by_game(@user_filter["game"]).to_a

    # # 計算player value
    @players.each do |p|
      p["rank_value"] = get_rank_value(p, @user_filter["conditions"])
    end
  end

  def conditions
    session[:search_conditions] = nil
    session[:search_conditions] = {"conditions" => params[:conditions], "game" => params[:game]}
    redirect_to root_path
  end

  def show
    @player = GameLog.where("player_id = ?", params[:player_id])
    # @player = []
    # # by 場次
    # game = [7, 14, 30]
    # 3.times { |index| @player << ZScore.player_value_by_game(game[index], params[:player_id]).to_a[0] }
  end

  def compare

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
      rank_value += value[condition].to_f
    end

    return rank_value
  end
end
