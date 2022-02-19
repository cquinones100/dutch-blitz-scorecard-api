class PlayerReady < ApplicationRecord
  belongs_to :player
  belongs_to :lobby

  after_create do
    Round.create(lobby: lobby) if lobby.ready?
  end
end
