class AddNullFalseToNameOnPlayers < ActiveRecord::Migration[6.0]
  def change
    change_column_null :players, :name, false
  end
end
