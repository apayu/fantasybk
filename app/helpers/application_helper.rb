module ApplicationHelper

  def per_game(value, game)
    if game > 0
    value.fdiv(game).round(1)
    else
      0
    end
  end

  def for_value(value, total)
    v = (value.fdiv(total) *100).round(2)
    for_rank_value(v)
    return v
  end

  def for_free_throw(value, total, t_value, t_total)
    v = for_free_field(value, total).fdiv(for_free_field(t_value, t_total)).round(2)
    for_rank_value(v)
    return v
  end

  def for_field_goal(value, total, t_value, t_total)
    v = for_free_field(value, total).fdiv(for_free_field(t_value, t_total)).round(2)
    for_rank_value(v)
    return v
  end

  def for_free_field(value, total)
    (value.fdiv(total) *100).round(2)
  end

  def for_rank_value(value)
    @rank_value += value
  end
end
