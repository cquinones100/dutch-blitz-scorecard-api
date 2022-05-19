class CreatePlayerScores < ActiveRecord::Migration[6.0]
  def change
    create_table :player_scores do |t|
      t.references :player, foreign_key: true, null: false
      t.references :round, foreign_key: true, null: false

      t.integer :value
      t.timestamps
    end
  end
end
