class Serializer
  def self.serialize(obj, *args)
    new(obj, *args).serialize
  end

  attr_reader :args, :obj, :hoptions

  delegate :decode, :encode, to: :hash_ids

  def initialize(obj, *args, **hoptions)
    @obj = obj
    @args = args
    @hoptions = hoptions
  end

  def serialize
    args.each_with_object({}) do |arg, hash|
      if Proc === arg
        arg.(obj)
      else
        hash[arg] = obj.send(arg)
      end
    end.tap do |hash|
      hash[:id] = encode(obj.id)
    end.merge(hoptions)
  end

  private

  def hash_ids
    @has_ids ||= Hashids.new('this is my salt', 5)
  end
end
