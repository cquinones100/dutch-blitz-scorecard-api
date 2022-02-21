class Lobby < ApplicationRecord
  has_many :players
  has_many :rounds, -> { order(created_at: :asc) }

  def ready?
    players.size > 1 && players.all?(&:ready?)
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:player_scores_sorted_desc) do
        players.sort_by(&:total_score).reverse.map do |player|
          Serializer.serialize(player) do 
            attribute(:player_name) { name }
            attribute(:score) { total_score }
          end
        end
      end
    end
  end
end
