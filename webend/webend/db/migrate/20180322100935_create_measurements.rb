class CreateMeasurements < ActiveRecord::Migration[5.1]
  def change
    create_table :measurements do |t|
      t.timestamp :timestamp
      t.references :button, foreign_key: true
      t.integer :value

      t.timestamps
    end
  end
end
