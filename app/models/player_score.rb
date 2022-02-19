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
      attribute(:value)
      attribute(:round_number) do
        round.lobby.rounds.find_index { |lobby_round| lobby_round == round }
      end
    end
  end
end
