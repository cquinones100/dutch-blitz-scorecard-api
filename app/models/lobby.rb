class Lobby < ApplicationRecord
  has_many :players
  has_many :rounds, -> { order(created_at: :asc) }

  def serialize
    Serializer.serialize(self)
  end
end
