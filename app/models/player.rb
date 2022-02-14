class Player < ApplicationRecord
  belongs_to :lobby
  has_one :player_ready

  validates :name, uniqueness: { scope: :lobby }

  def serialize
    Serializer.serialize(self, :name).merge!(ready: player_ready.present?)
  end
end
