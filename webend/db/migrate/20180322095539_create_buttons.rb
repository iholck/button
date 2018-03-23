class CreateButtons < ActiveRecord::Migration[5.1]
  def change
    create_table :buttons do |t|
      t.string :name
      t.string :mac
      t.string :regexp
      t.boolean :configured
      t.integer :customer

      t.timestamps
    end
  end
end
