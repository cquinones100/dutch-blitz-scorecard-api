class PlayerScore < ApplicationRecord
  belongs_to :round
  belongs_to :player

  after_update do
    round.increment if round.over?
  end

  def entered?
    value.present?
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:player_name) { player.name }
      attribute(:score) { value }
    end
  end
end
