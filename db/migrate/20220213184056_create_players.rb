class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.references :lobby, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
