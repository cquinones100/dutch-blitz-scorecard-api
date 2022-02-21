class Lobby < ApplicationRecord
  has_many :players
  has_many :rounds, -> { order(created_at: :asc) }

  def ready?
    players.size > 1 && players.all?(&:ready?)
  end

  def last_round
    return unless rounds.size > 1

    rounds[-2]
  end

  def serialize
    Serializer.serialize(self) do
      attribute(:rounds)
      attribute(:players) { players.map(&:serialize) }

      attribute(:player_scores_sorted_desc) do
        players.sort_by(&:total_score).reverse.map do |player|
          Serializer.serialize(player) do 
            attribute(:player_name) { name }
            attribute(:score) { total_score }
          end
        end
      end

      attribute(:player_last_scores_sorted_desc) do
        players.sort_by(&:total_score).reverse.map do |player|
          Serializer.serialize(player) do 
            attribute(:player_name) { name }
            attribute(:score) { last_score }
          end
        end
      end

      attribute(:current_round) { rounds.last&.serialize }

      attribute(:player_last_winning_score) do
        attribute(:player_name) do
          last_round.winning_player_score.player.name
        end

        attribute(:score) do
          last_round.winning_player_score.value
        end
      end
    end
  end
end
