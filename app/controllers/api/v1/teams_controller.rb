class Api::V1::TeamsController < ApplicationController
  def schedule
    game_start = Date.parse("2019-10-22")
    game_end = Date.parse("2020-04-15")
    start_week = 41
    total_week = 26

    schedules = Schedule.includes(:team)
    team_array = []

    schedules.each do |s|
      has_team = team_array.select { |t| t.has_value?(s.team.tricode) }
      if has_team.empty?
        week_array = Array.new(26, 0)
        week_array[0] += 1
        team_array << { tricode: s.team.tricode, game_week: week_array }
      else
        week = get_week((s.game_time - 6.hours), start_week)
        has_team[0][:game_week][week-1] += 1
      end
    end

    render json: {
      teamSchedule: team_array
    }
  end

  private

  def get_week(date, start_week)
    Date.beginning_of_week = :monday
    week = date.strftime("%W").to_i
    if week >= start_week && week <= 52
      week - start_week
    else
      week + 11
    end
  end
end
