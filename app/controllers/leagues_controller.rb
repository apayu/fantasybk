class LeaguesController < ApplicationController
  def index
    # 是否登入
    unless user_signed_in?
      redirect_to new_user_session_path
    else
      # 是否有授權
      if current_user.token.nil?
        redirect_to "/auth/yahoo_auth"
      end
    end
  end
end
