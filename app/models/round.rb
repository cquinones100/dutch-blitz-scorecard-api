class Round < ApplicationRecord
  belongs_to :lobby
  has_many :player_scores

  after_create do
    lobby.players.each do |player|
      PlayerScore.create(player: player, round: self)
    end
  end

  def over?
    player_scores.all?(&:entered?)
  end

  def increment
    Round.create(lobby: lobby)
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:player_scores) { player_scores.map(&:serialize) }
    end
  end
end
