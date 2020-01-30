desc "一個demo任務"
namespace :example do
  task :a => :environment do
    players = Player.all
    puts players.first
  end
end
