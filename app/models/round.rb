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

  def winning_player_score
    player_scores.order(value: :desc).first
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:players) { player_scores.map(&:player) }
      attribute(:player_scores) { player_scores.map(&:serialize) }

      attribute(:player_scores_sorted_desc) do
        player_scores.order(value: :desc).map(&:serialize)
      end
    end
  end
end
