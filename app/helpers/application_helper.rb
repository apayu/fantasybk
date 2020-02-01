module ApplicationHelper

  def per_game(value, game)
    if game > 0
    value.fdiv(game).round(1)
    else
      0
    end
  end

  def for_value(value, total)
    value.fdiv(total).round(4)
  end
end
