class Serializer
  def self.serialize(obj, *args)
    new(obj, *args).serialize
  end

  attr_reader :args, :obj

  delegate :decode, :encode, to: :hash_ids

  def initialize(obj, *args)
    @obj = obj
    @args = args
  end

  def serialize
    args.each_with_object({}) do |arg, hash|
      hash[arg] = obj.send(arg)
    end.tap do |hash|
      hash[:id] = encode(obj.id)
    end
  end

  private

  def hash_ids
    @has_ids ||= Hashids.new('this is my salt', 5)
  end
end
