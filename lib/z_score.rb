module ZScore
  # z-score
  def self.get_zscore(value, league_avg, standard_deviation)
    ((value - league_avg).fdiv(standard_deviation)).round(2)
  end

  # 標準差
  def self.standard_deviation(item, condition)
    stddev = "stddev_pop(#{item})"
    result = Stat.select(stddev).where(condition).load
    result.first.stddev_pop
  end

  # 平均
  def self.league_avg(item, condition)
    Stat.where(condition).average(item).to_f
  end

end
