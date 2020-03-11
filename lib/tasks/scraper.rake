require './lib/scraper'

desc 'nba reference scraper'
namespace :scraper do
  task :game_log => :environment do

    check_update_player

    start_date = Date.today
    end_date = start_date - 3

    (end_date..start_date).each do |game_date|
      total_game_box = Scraper.new("boxscores/?month=#{game_date.month}&day=#{game_date.day}&year=#{game_date.year}")
      game_summary_array = total_game_box.scrape.css("div.game_summary")

      # total game summary
      game_summary_array.each do |game_summary|
        game_link = game_summary.css("table.teams > tbody > tr > td.gamelink > a").attr("href").value
        visit_team_name = game_summary.css("table.teams > tbody > tr:first-child > td:first-child > a").attr("href").value.split("/")[2]
        home_team_name = game_summary.css("table.teams > tbody > tr:last-child > td:first-child > a").attr("href").value.split("/")[2]

        game_box = Scraper.new(game_link)

        #  tr:not(:nth-child(6n)) is only find player <tr>
        visit_team_box = game_box.scrape.css("table#box-#{visit_team_name}-game-basic > tbody > tr:not(:nth-child(6n))")
        home_team_box = game_box.scrape.css("table#box-#{home_team_name}-game-basic > tbody > tr:not(:nth-child(6n))")
        versus = {
          home: fix_team_name(home_team_name),
          visit: fix_team_name(visit_team_name)
        }

        handle_player_state(visit_team_name, visit_team_box, game_date, versus)
        handle_player_state(home_team_name, home_team_box, game_date, versus)
      end
    end

    ContactMailer.sent_daily_info.deliver_now
  end

  def fix_team_name(team_name)
    case team_name.downcase
    when "brk"
      "bkn"
    when "cho"
      "cha"
    when "pho"
      "phx"
    when "pho"
      "phx"
    else
      team_name
    end
  end

  def fix_player_name(name)
    name_array = name.downcase.split(" ")
    case name_array.last
    when "i"
      name_array.pop
    when "ii"
      name_array.pop
    when "iii"
      name_array.pop
    when "iv"
      name_array.pop
    when "v"
      name_array.pop
    end
    name_array.join.gsub(/[^a-zA-Z]/,"")
  end

  def check_update_player
    # get new player from api
    api_players = Nba.all_players
    players = Player.all

    api_players.each do |player|
      has_player = Player.find_by(api_person_id: player["personId"])
      team = Team.find_by(api_team_id: player["teamId"])

      api2_team_id = team.nil? ? nil : team.api2_team_id
      team_id = team.nil? ? nil : team.id

      name = "#{player["firstName"]} #{player["lastName"]}"

      if has_player.nil?
        Player.create(
          name: name,
          first_name: player["firstName"],
          last_name: player["lastName"],
          api2_team_id: api2_team_id,
          api_person_id: player["personId"],
          api2_person_id: 0,
          team_id: team_id,
          pos: player["pos"],
          inj: false)
        puts "create player name: " + name
      else
        has_player.update(
          name: name,
          first_name: player["firstName"],
          last_name: player["lastName"],
          api2_team_id: api2_team_id,
          api_person_id: player["personId"],
          team_id: team_id,
          pos: player["pos"],
          inj: false)
        puts "update player name: " + name
      end
    end
  end

  def handle_player_state(team_name, game_box, game_time, versus)
    puts "============"
    puts "==  #{team_name}   =="
    puts "============"

    game_box.each do |player_tr|
      # must be player <tr>
      if player_tr.css("td:first").attr("data-stat").value != "reason"
        player_name = ActiveSupport::Inflector.transliterate(player_tr.css("th > a").text).to_s
        player_id = get_player_id(player_name, fix_team_name(team_name))

        if !player_id.nil?
          save_player_state(game_time, player_id, player_tr, versus)
          print_player_info(player_name, player_id, player_tr)
        else
          logger = Logger.new("log/scraper.log")
          logger.warn("can't not find this player #{player_name}")
          logger.close
        end
      end
    end
  end

  def print_player_info(player_name, player_id, player_tr)
    str = ""
    player_tr.css("td").each do |state|
      str += "#{state.attr("data-stat")}:#{state.text} "
    end
    puts "#{player_name}"
    puts "#{player_id || "the table [payers] can't find this player"}"
    puts "state:#{str}"
    puts "==="
    logger = Logger.new("log/scraper.log")
    logger.info("player") {"player name:#{player_name}, player id: #{player_id}, state: #{str}"}
    logger.close
  end

  def get_player_id(player_name, team_tricode)
    all_player = Player.all
    all_player_name = all_player.map {|player| player.name }
    match_name = FuzzyMatch.new(all_player_name).find(player_name) || ""

    player = all_player.select do |player|
      fix_player_name(player.name) == fix_player_name(match_name) && player.team.tricode.downcase == team_tricode.downcase
    end

    player.empty? ? nil : player[0].id
  end

  def save_player_state(game_time, player_id, player_tr, versus)
    has_log = GameLog.where("DATE(game_time + (-6 * interval '1 hour')) = ? AND player_id = ?", game_time, player_id)

    if has_log.empty?
      GameLog.create(
        player_id: player_id,
        api2_person_id: 0,
        api2_game_id: 0,
        points: player_tr.css("td")[18].text,
        min: player_tr.css("td")[0].text,
        fgm: player_tr.css("td")[1].text.to_i,
        fga: player_tr.css("td")[2].text.to_i,
        fgp: player_tr.css("td")[3].text == "" ? 0 : player_tr.css("td")[3].text.to_f * 100,
        ftm: player_tr.css("td")[7].text.to_i,
        fta: player_tr.css("td")[8].text.to_i,
        ftp: player_tr.css("td")[9].text == "" ? 0 : player_tr.css("td")[9].text.to_f * 100,
        tpm: player_tr.css("td")[4].text.to_i,
        tpa: player_tr.css("td")[5].text.to_i,
        tpp: player_tr.css("td")[6].text == "" ? 0 : player_tr.css("td")[6].text.to_f * 100,
        off_reb: player_tr.css("td")[10].text.to_i,
        def_reb: player_tr.css("td")[11].text.to_i,
        tot_reb: player_tr.css("td")[12].text.to_i,
        assists: player_tr.css("td")[13].text.to_i,
        steals: player_tr.css("td")[14].text.to_i,
        blocks: player_tr.css("td")[15].text.to_i,
        turnovers: player_tr.css("td")[16].text.to_i,
        p_fouls: player_tr.css("td")[17].text.to_i,
        game_time: Time.parse("#{game_time.year}-#{game_time.month}-#{game_time.day}T22:00:00.000Z"),
        h_team: versus[:home].upcase,
        v_team: versus[:visit].upcase
      )
      puts "create player id: #{player_id} game log"
      logger = Logger.new("log/scraper.log")
      logger.info("player") {"create player id: #{player_id} game log"}
      logger.close
    else
      has_log.update(
        api2_person_id: 0,
        api2_game_id: 0,
        points: player_tr.css("td")[18].text,
        min: player_tr.css("td")[0].text,
        fgm: player_tr.css("td")[1].text.to_i,
        fga: player_tr.css("td")[2].text.to_i,
        fgp: player_tr.css("td")[3].text == "" ? 0 : player_tr.css("td")[3].text.to_f * 100,
        ftm: player_tr.css("td")[7].text.to_i,
        fta: player_tr.css("td")[8].text.to_i,
        ftp: player_tr.css("td")[9].text == "" ? 0 : player_tr.css("td")[9].text.to_f * 100,
        tpm: player_tr.css("td")[4].text.to_i,
        tpa: player_tr.css("td")[5].text.to_i,
        tpp: player_tr.css("td")[6].text == "" ? 0 : player_tr.css("td")[6].text.to_f * 100,
        off_reb: player_tr.css("td")[10].text.to_i,
        def_reb: player_tr.css("td")[11].text.to_i,
        tot_reb: player_tr.css("td")[12].text.to_i,
        assists: player_tr.css("td")[13].text.to_i,
        steals: player_tr.css("td")[14].text.to_i,
        blocks: player_tr.css("td")[15].text.to_i,
        turnovers: player_tr.css("td")[16].text.to_i,
        p_fouls: player_tr.css("td")[17].text.to_i,
        game_time: Time.parse("#{game_time.year}-#{game_time.month}-#{game_time.day}T22:00:00.000Z"),
        h_team: versus[:home].upcase,
        v_team: versus[:visit].upcase
      )
      puts "update player id: #{player_id} game log"
      logger = Logger.new("log/scraper.log")
      logger.info("player") {"update player id: #{player_id} game log"}
      logger.close
    end
  end
end
