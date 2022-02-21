class Player < ApplicationRecord
  belongs_to :lobby
  has_many :player_scores
  has_one :player_ready

  validates :name, uniqueness: { scope: :lobby }

  def ready?
    player_ready.present?
  end

  def total_score
    player_scores.map(&:value).reduce(0) do |acc, value|
      if value.nil?
        acc + 0
      else
        acc + value
      end
    end
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:name)
      attribute(:ready) { ready? }
      attribute(:score) { total_score }
      attribute(:player_scores) { player_scores.map(&:serialize) }

      attribute(:lobby_id) do |serializer|
        serializer.encode(lobby_id)
      end

      attribute(:last_score) do
        player_scores.order(created_at: :desc)[0]&.value ||
        player_scores.order(created_at: :desc)[1]&.value
      end
    end
  end
end
