class ApplicationController < ActionController::API
  delegate :decode, :encode, to: :hash_ids

  private

  def hash_ids
    @has_ids ||= Hashids.new('this is my salt', 5)
  end
end
