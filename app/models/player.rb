class Player

  include HTTParty

  attr_reader :base_url, :person_id, :name, :pos, :team_id

  BASE_URL = 'http://data.nba.net/10s/prod/v1/'.freeze

  def initialize(person_id, name, pos, team_id)
    @person_id = person_id
    @name = name
    @pos = pos
    @team_id = team_id
  end

  def self.all
    res = HTTParty.get(BASE_URL + "2019/players.json",
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
end
