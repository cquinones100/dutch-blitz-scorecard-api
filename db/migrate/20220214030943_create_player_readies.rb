class CreatePlayerReadies < ActiveRecord::Migration[6.0]
  def change
    create_table :player_readies do |t|
      t.references(:player, foreign_key: true) 
      t.references(:lobby, foreign_key: true)

      t.timestamps
    end
  end
end
