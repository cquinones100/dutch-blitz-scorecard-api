class Player < ApplicationRecord
  belongs_to :lobby
  has_one :player_ready

  validates :name, uniqueness: { scope: :lobby }

  def serialize
    Serializer.serialize(self) do
      attribute(:name)

      attribute(:lobby_id) do |serializer|
        serializer.encode(lobby_id)
      end

      attribute(:ready) { player_ready.present? }
    end
  end
end
