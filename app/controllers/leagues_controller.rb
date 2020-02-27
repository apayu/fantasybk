class LeaguesController < ApplicationController
  def index
    # 是否登入
    unless user_signed_in?
      redirect_to new_user_session_path
    else
      # 是否有授權
      if current_user.token.nil?
        redirect_to "/auth/yahoo_auth"
      else
        # 是否有設定聯盟ID
        if current_user.league_id.nil?
          flash[:notice] = "請設定Yahoo Fantasy League ID"
          redirect_to "/users/edit"
        end
      end
    end
  end
end
