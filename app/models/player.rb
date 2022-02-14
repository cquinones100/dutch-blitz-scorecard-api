class Player < ApplicationRecord
  belongs_to :lobby

  validates :name, uniqueness: { scope: :lobby }
end
