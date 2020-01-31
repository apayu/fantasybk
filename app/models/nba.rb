class Nba

  include HTTParty

  attr_reader :base_url, :person_id, :name, :pos, :team_id

  BASE_URL = 'http://data.nba.net/'.freeze

  def initialize(person_id, name, pos, team_id)
    @person_id = person_id
    @name = name
    @pos = pos
    @team_id = team_id
  end

  def self.all_players
    res = HTTParty.get(BASE_URL + "10s/prod/v1/2019/players.json",
                       headers: {
                         'user-agent' => 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                         'Dnt' => '1',
                         'Accept-Encoding' => 'gzip, deflate, sdch',
                         'Accept-Language' => 'en',
                         'origin' => 'http://data.nba.net'
                       }
                     )

    res.parsed_response["league"]["standard"]
  end

  def self.all_teams
    res = HTTParty.get(BASE_URL + "10s/prod/v2/2019/teams.json",
                       headers: {
                         'user-agent' => 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                         'Dnt' => '1',
                         'Accept-Encoding' => 'gzip, deflate, sdch',
                         'Accept-Language' => 'en',
                         'origin' => 'http://data.nba.net'
                       }
                     )

    res.parsed_response["league"]["standard"]
  end

  def self.player_stats(year, person_id)
    res = HTTParty.get(BASE_URL + "data/10s/prod/v1/" + year + "/players/" + person_id + "_profile.json",
                       headers: {
                         'user-agent' => 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                         'Dnt' => '1',
                         'Accept-Encoding' => 'gzip, deflate, sdch',
                         'Accept-Language' => 'en',
                         'origin' => 'http://data.nba.net'
                       }
                     )

    res.parsed_response["league"]["standard"]["stats"]["latest"]
  end
end
