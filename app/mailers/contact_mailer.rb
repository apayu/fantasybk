class ContactMailer < ApplicationMailer
  def sent_daily_info
    today = Date.today - 1
    gamelog = GameLog.includes(:player => :team).where("date(game_time + (-6 * interval '1 hour')) = ?", today)
    @user_count = User.count
    @player_eff_array = []
    gamelog.each do |player|
      @player_eff_array << {
        name: player.player.name,
        team: player.player.team.tricode,
        eff: (player.points + player.tot_reb + player.assists + player.steals + player.blocks) - (player.fga - player.fgm) - (player.fta - player.ftm) - player.turnovers
      }
    end
    mail to: "rx836@hotmail.com", subject: "#{Date.today} 報告"

  end
end
