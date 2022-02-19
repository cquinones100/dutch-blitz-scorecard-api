class Player < ApplicationRecord
  belongs_to :lobby
  has_many :player_scores
  has_one :player_ready

  validates :name, uniqueness: { scope: :lobby }

  def ready?
    player_ready.present?
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:name)
      attribute(:ready) { ready? }
      attribute(:score) do
        player_scores.map(&:value).reduce(0) do |acc, value|
          if value.nil?
            acc + 0
          else
            acc + value
          end
        end
      end
      attribute(:player_scores) { player_scores.map(&:serialize) }

      attribute(:lobby_id) do |serializer|
        serializer.encode(lobby_id)
      end
    end
  end
end
