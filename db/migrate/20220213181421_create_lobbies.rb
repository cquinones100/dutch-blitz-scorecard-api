class CreateLobbies < ActiveRecord::Migration[6.0]
  def change
    create_table :lobbies do |t|
      t.timestamps
    end
  end
end
