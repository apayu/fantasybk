module ZScore
  # z-score
  def self.get_zscore(value, league_avg, standard_deviation)
    ((value - league_avg).fdiv(standard_deviation)).round(2)
  end

  # 聯盟標準差 item:比項 condition:場次
  def self.standard_deviation(item, condition)
    sql_query = "WITH cte_st AS(
      WITH cte_customers AS (
      SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
      ROW_NUMBER() OVER(
      PARTITION BY a2.api2_person_id
      ORDER BY api2_game_id DESC)
      row_num FROM players a1, game_logs a2, teams a3
      WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
      ORDER BY a2.api2_person_id)
      SELECT SUM(#{item}) AS #{item}
      FROM cte_customers
      WHERE row_num <= #{condition}
      GROUP BY player_id, api2_person_id, name, pos, inj, tricode)
      SELECT STDDEV_POP(#{item})
      FROM cte_st"
    result = ActiveRecord::Base.connection.execute(sql_query)
    result.first["stddev_pop"].to_f
  end

  # 聯盟標準差(命中率) made:命中 attempt:出手 condition:場次
  def self.standard_deviation_percentage(made, attempt, condition)
    sql_query = "WITH cte_stv_percentage AS(
      WITH cte_customers AS (
      SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
      ROW_NUMBER() OVER(
      PARTITION BY a2.api2_person_id
      ORDER BY api2_game_id DESC)
      row_num FROM players a1, game_logs a2, teams a3
      WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
      ORDER BY a2.api2_person_id)
      SELECT CAST(SUM(#{made}) AS FLOAT)/NULLIF(CAST(SUM(#{attempt}) AS FLOAT), 0) AS league_percentage
      FROM cte_customers
      WHERE row_num <= #{condition}
      GROUP BY player_id, api2_person_id, name, pos, inj, tricode)
      SELECT STDDEV_POP(league_percentage)
      FROM cte_stv_percentage"
    result = ActiveRecord::Base.connection.execute(sql_query)
    result.first["stddev_pop"].to_f
  end

  # 聯盟平均 item:比項 condition:場次
  def self.league_avg(item, condition)
    sql_query = "WITH cte_avg AS (
      WITH cte_customers AS (
      SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
      ROW_NUMBER() OVER(
      PARTITION BY a2.api2_person_id
      ORDER BY api2_game_id DESC)
      row_num FROM players a1, game_logs a2, teams a3
      WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
      ORDER BY a2.api2_person_id)
      SELECT SUM(#{item}) AS #{item}
      FROM cte_customers
      WHERE row_num <= #{condition}
      GROUP BY player_id, api2_person_id, name, pos, inj, tricode)
      SELECT AVG(#{item}) as league_avg
      FROM cte_avg"
    result = ActiveRecord::Base.connection.execute(sql_query)
    result.first["league_avg"].to_f
  end

  # 聯盟平均(命中率) made:命中數 attempt:出手數 condition:場次
  def self.league_percentage_avg(made, attempt, condition)
    sql_query = "WITH cte_percentage AS(
WITH cte_customers AS (
SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
ROW_NUMBER() OVER(
PARTITION BY a2.api2_person_id
ORDER BY api2_game_id DESC)
row_num FROM players a1, game_logs a2, teams a3
WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
ORDER BY a2.api2_person_id)
SELECT name, SUM(#{made}) AS made, SUM(#{attempt}) AS attempt
FROM cte_customers
WHERE row_num <= #{condition}
GROUP BY player_id, api2_person_id, name, pos, inj, tricode)
SELECT CAST(SUM(made) AS FLOAT)/NULLIF(CAST(SUM(attempt) AS FLOAT), 0) AS league_percentage
FROM cte_percentage"
    result = ActiveRecord::Base.connection.execute(sql_query)
    result.first["league_percentage"].to_f
  end

  # 過去x場 球員數值 & 每場平均 condition:場次
  def self.player_value_by_game(condition)
    sql_query = "WITH cte_customers AS (
      SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
      ROW_NUMBER() OVER(
      PARTITION BY a2.api2_person_id
      ORDER BY api2_game_id DESC)
      row_num
      FROM players a1, game_logs a2, teams a3
      WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
      ORDER BY a2.api2_person_id)
      SELECT player_id, api2_person_id, name, pos, inj, tricode, COUNT (row_num) as g, AVG(to_timestamp(min, 'MI:SS')::time) AS min, SUM(points) AS points, CAST(SUM(fgm) AS FLOAT)/NULLIF(CAST(SUM(fga) AS FLOAT), 0) AS       fgp, CAST(SUM(ftm) AS FLOAT)/NULLIF(CAST(SUM(fta) AS FLOAT), 0) AS ftp, SUM(tpm) AS tpm, SUM(off_reb) AS off_reb, SUM(def_reb) AS def_reb, SUM(assists)       AS assists, SUM(steals) AS steals, SUM(blocks) AS blocks, SUM(turnovers) AS turnovers, SUM(p_fouls) AS p_fouls
      ,AVG(points) AS points_per_game, AVG(tpm) AS tpm_per_game, AVG(assists) AS assists_per_game, AVG(steals) AS steals_per_game, AVG(blocks) AS             blocks_per_game, AVG(turnovers) AS turnovers_per_game, AVG(p_fouls) AS p_fouls_per_game, AVG(off_reb) AS off_reb_per_game, AVG(def_reb) AS def_reb_per_game, 0 AS points_value, 0 AS three_point_value, 0 AS assists_value, 0 AS steals_value, 0 AS blocks_value, 0 AS field_goal_value, 0 AS free_throw_value, 0 AS off_reb_value, 0 AS def_reb_value, 0 AS turnovers_value, 0 AS p_fouls_value, 0 AS rank_value
      FROM cte_customers
      WHERE row_num <= #{condition}
      GROUP BY player_id, api2_person_id, name, pos, inj, tricode;"
    result = ActiveRecord::Base.connection.execute(sql_query)
  end

  # # 標準差
  # def self.standard_deviation(item, condition)
  #   stddev = "stddev_pop(#{item})"
  #   result = Stat.select(stddev).where(condition).load
  #   result.first.stddev_pop
  # end

  # # 平均
  # def self.league_avg(item, condition)
  #   Stat.where(condition).average(item).to_f
  # end
end
