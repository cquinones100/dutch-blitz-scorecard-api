class Lobby < ApplicationRecord
  has_many :players
  has_many :rounds, -> { order(created_at: :asc) }

  def ready?
    players.all?(&:ready?)
  end

  def serialize
    Serializer.serialize(self)
  end
end
