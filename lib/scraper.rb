class Scraper
  attr_reader :url, :make, :model
  def initialize(parameter)
    @url = "https://www.basketball-reference.com/#{parameter}"
  end

  def parse_url(url)
    unparsed_page = HTTParty.get(url)
    Nokogiri::HTML(unparsed_page)
  end

  def scrape
    parsed_page = parse_url(@url)
  end
end
