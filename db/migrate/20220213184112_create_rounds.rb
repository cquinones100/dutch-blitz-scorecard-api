class CreateRounds < ActiveRecord::Migration[6.0]
  def change
    create_table :rounds do |t|
      t.references :lobby, foreign_key: true

      t.timestamps
    end
  end
end
