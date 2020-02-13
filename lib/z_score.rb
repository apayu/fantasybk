class ZScore
  # 過去x場 球員數值 & 每場平均 game:場次
  def self.player_value_by_game(game, player_id = 0)
    sql_query = "WITH
league_avg_percentage AS(
  WITH game_log_by_player AS(
    SELECT
      ROW_NUMBER() OVER(
      PARTITION BY api2_person_id
      ORDER BY api2_game_id DESC)
      row_num, fgm, fga, ftm, fta, tpm, tpa FROM game_logs
    WHERE min <> '')
  SELECT
    CAST(SUM(fgm) AS FLOAT)/NULLIF(CAST(SUM(fga) AS FLOAT), 0) AS league_fgp, CAST(SUM(ftm) AS FLOAT)/NULLIF(CAST(SUM(fta) AS FLOAT), 0) AS league_ftp,       CAST(SUM(tpm) AS FLOAT)/NULLIF(CAST(SUM(tpa) AS FLOAT), 0) AS league_tpp
  FROM game_log_by_player
  WHERE row_num <=  #{ActiveRecord::Base::connection.quote(game)} ),
league_avg AS(
  WITH player_sum AS (
    WITH each_player AS (
      SELECT
        ROW_NUMBER() OVER(
        PARTITION BY api2_person_id
        ORDER BY api2_game_id DESC)
        row_num, api2_person_id, points, tpm, assists, steals, blocks, off_reb, def_reb, tot_reb, p_fouls, turnovers
      FROM game_logs
      WHERE min <> ''
      ORDER BY api2_person_id)
    SELECT
      SUM(points) AS points, SUM(tpm) AS tpm, SUM(assists) AS assists, SUM(steals) AS steals, SUM(blocks) AS blocks, SUM(off_reb) AS off_reb, SUM(def_reb) AS def_reb,  SUM(tot_reb) AS tot_reb, SUM(p_fouls) AS p_fouls, SUM(turnovers) AS turnovers
    FROM each_player
    WHERE row_num <= #{ActiveRecord::Base::connection.quote(game)}
    GROUP BY api2_person_id)
  SELECT
    AVG(points) AS points_avg, AVG(tpm) AS tpm_avg, AVG(assists) AS assists_avg, AVG(steals) AS steals_avg, AVG(blocks) AS blocks_avg, AVG(off_reb) AS        off_reb_avg, AVG(def_reb) AS def_reb_avg, AVG(tot_reb) AS tot_reb_avg, AVG(p_fouls) AS p_fouls_avg, AVG(turnovers) AS turnovers_avg
  FROM player_sum),
league_std AS (
  WITH player_sum AS (
    WITH each_player AS (
      SELECT
        ROW_NUMBER() OVER(
        PARTITION BY api2_person_id
        ORDER BY api2_game_id DESC)
        row_num, api2_person_id, points, tpm, assists, steals, blocks, off_reb, def_reb, tot_reb, p_fouls, turnovers
      FROM game_logs
      WHERE min <> ''
      ORDER BY api2_person_id)
    SELECT
      SUM(points) AS points, SUM(tpm) AS tpm, SUM(assists) AS assists, SUM(steals) AS steals, SUM(blocks) AS blocks, SUM(off_reb) AS off_reb, SUM(def_reb) AS def_reb,  SUM(tot_reb) AS tot_reb, SUM(p_fouls) AS p_fouls, SUM(turnovers) AS turnovers
    FROM each_player
    WHERE row_num <= #{ActiveRecord::Base::connection.quote(game)}
    GROUP BY api2_person_id)
  SELECT
    STDDEV_POP(points) AS points_std, STDDEV_POP(tpm) AS tpm_std, STDDEV_POP(assists) AS assists_std, STDDEV_POP(steals) AS steals_std, STDDEV_POP(blocks) AS blocks_std, STDDEV_POP(off_reb) AS off_reb_std, STDDEV_POP(def_reb) AS def_reb_std, STDDEV_POP(tot_reb) AS tot_reb_std, STDDEV_POP(p_fouls) AS p_fouls_std, STDDEV_POP(turnovers) AS turnovers_std
  FROM player_sum),
player_info AS (
	WITH each_player AS (
      SELECT a1.name, a1.pos, a1.inj, a3.tricode, a2.*,
      ROW_NUMBER() OVER(
      PARTITION BY a2.api2_person_id
      ORDER BY api2_game_id DESC)
      row_num
      FROM players a1, game_logs a2, teams a3
      WHERE a1.id = a2.player_id AND a1.team_id = a3.id AND a2.min <> ''
      ORDER BY a2.api2_person_id)
      SELECT
	    player_id, api2_person_id, name, pos, inj, tricode, COUNT (row_num) as g, AVG(to_timestamp(min, 'MI:SS')::time) AS min,
	    SUM(points) AS points,   CAST(SUM(fgm) AS FLOAT)/NULLIF(CAST(SUM(fga) AS FLOAT), 0) AS fgp, CAST(SUM(ftm) AS FLOAT)/NULLIF(CAST(SUM(fta) AS FLOAT), 0) AS ftp, SUM(tpm) AS tpm,  SUM(off_reb) AS off_reb, SUM(def_reb) AS def_reb, SUM(tot_reb) AS tot_reb, SUM(assists) AS assists, SUM(steals) AS steals, SUM(blocks) AS blocks, SUM(turnovers) AS turnovers, SUM(p_fouls) AS p_fouls,
        AVG(points) AS points_per_game, AVG(tpm) AS tpm_per_game, AVG(fga) AS fga_per_game, AVG(fta) AS fta_per_game, AVG(tpa) AS tpa_per_game, AVG(assists) AS assists_per_game, AVG(steals) AS steals_per_game, AVG(blocks) AS blocks_per_game, AVG(turnovers) AS turnovers_per_game, AVG(p_fouls) AS p_fouls_per_game, AVG(off_reb) AS off_reb_per_game, AVG(def_reb) AS def_reb_per_game, AVG(tot_reb) AS tot_reb_per_game,
	    0 AS points_value, 0 AS three_point_value, 0 AS assists_value, 0 AS steals_value, 0 AS blocks_value, 0 AS field_goal_value, 0 AS free_throw_value, 0 AS off_reb_value, 0 AS def_reb_value, 0 AS turnovers_value, 0 AS p_fouls_value, 0 AS rank_value
      FROM each_player
      WHERE row_num <= #{ActiveRecord::Base::connection.quote(game)}
      GROUP BY player_id, api2_person_id, name, pos, inj, tricode),
league_impact AS(
  WITH player_percentage AS(
    SELECT
      ROW_NUMBER() OVER(
      PARTITION BY api2_person_id
      ORDER BY api2_game_id DESC)
      row_num, api2_person_id, fgm, fga, ftm, fta, tpm, tpa FROM game_logs
    WHERE min <> '')
  SELECT
    (CAST(SUM(fgm) AS FLOAT)/NULLIF(CAST(SUM(fga) AS FLOAT), 0) - (SELECT league_fgp FROM league_avg_percentage)) * AVG(fga) AS fg_impact,
	(CAST(SUM(ftm) AS FLOAT)/NULLIF(CAST(SUM(fta) AS FLOAT), 0) - (SELECT league_ftp FROM league_avg_percentage)) * AVG(fta) AS ft_impact,
	(CAST(SUM(tpm) AS FLOAT)/NULLIF(CAST(SUM(tpa) AS FLOAT), 0) - (SELECT league_tpp FROM league_avg_percentage)) * AVG(tpa) AS tp_impact
  FROM player_percentage
  WHERE row_num <= #{ActiveRecord::Base::connection.quote(game)}
  GROUP BY api2_person_id)
SELECT
  player_id, api2_person_id, name, pos, inj, tricode, g, min,
  points, fgp, ftp, tpm,  off_reb, def_reb, tot_reb, assists, steals, blocks, turnovers, p_fouls,
  points_per_game, tpm_per_game, assists_per_game, steals_per_game, blocks_per_game, turnovers_per_game, p_fouls_per_game, off_reb_per_game, def_reb_per_game, tot_reb_per_game,
  ((points - (SELECT points_avg FROM league_avg))/(SELECT points_std FROM league_std)) AS points_value,
  ((tpm - (SELECT tpm_avg FROM league_avg))/(SELECT tpm_std FROM league_std)) AS three_point_value,
  ((assists - (SELECT assists_avg FROM league_avg))/(SELECT assists_std FROM league_std)) AS assists_value,
  ((steals - (SELECT steals_avg FROM league_avg))/(SELECT steals_std FROM league_std)) AS steals_value,
  ((blocks - (SELECT blocks_avg FROM league_avg))/(SELECT blocks_std FROM league_std)) AS blocks_value,
  ((((fgp - (SELECT league_fgp FROM league_avg_percentage)) * fga_per_game) - (SELECT AVG(fg_impact) FROM league_impact)) / (SELECT STDDEV_POP(fg_impact) FROM league_impact)) AS field_goal_value,
  ((((ftp - (SELECT league_ftp FROM league_avg_percentage)) * fta_per_game) - (SELECT AVG(ft_impact) FROM league_impact)) / (SELECT STDDEV_POP(ft_impact) FROM league_impact))  AS free_throw_value,
  ((off_reb - (SELECT off_reb_avg FROM league_avg))/(SELECT off_reb_std FROM league_std)) AS off_reb_value,
  ((def_reb - (SELECT def_reb_avg FROM league_avg))/(SELECT def_reb_std FROM league_std)) AS def_reb_value,
  ((tot_reb - (SELECT tot_reb_avg FROM league_avg))/(SELECT tot_reb_std FROM league_std)) AS tot_reb_value,
  ((turnovers - (SELECT turnovers_avg FROM league_avg))/(SELECT turnovers_std FROM league_std)) *-1 AS turnovers_value,
  ((p_fouls - (SELECT p_fouls_avg FROM league_avg))/(SELECT p_fouls_std FROM league_std)) * -1 AS p_fouls_value,
  0 AS rank_value
FROM player_info "
    if player_id != 0
      sql_query += " WHERE player_id = #{ActiveRecord::Base::connection.quote(player_id)}"
    end
    result = ActiveRecord::Base.connection.execute(sql_query)
  end
end
