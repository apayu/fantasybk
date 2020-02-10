require 'uri'
require 'net/http'
require 'openssl'

# rapidapi 專門取得 game log 的資料
class NbaApi

  def self.get_all_teams
    url = URI("https://api-nba-v1.p.rapidapi.com/teams/league/standard")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["x-rapidapi-host"] = 'api-nba-v1.p.rapidapi.com'
    request["x-rapidapi-key"] = 'ee615fb1e2mshbcf338637ebca2ep1ad369jsn801371fbe105'

    response = http.request(request)
    return JSON.parse(response.read_body)["api"]["teams"]
  end

  def self.get_all_players
    url = URI("https://api-nba-v1.p.rapidapi.com/players/league/standard")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["x-rapidapi-host"] = 'api-nba-v1.p.rapidapi.com'
    request["x-rapidapi-key"] = 'ee615fb1e2mshbcf338637ebca2ep1ad369jsn801371fbe105'

    response = http.request(request)
    return JSON.parse(response.read_body)["api"]["players"]
  end
end

