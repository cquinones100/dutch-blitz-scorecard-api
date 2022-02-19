class Serializer
  def self.serialize(obj, *args, &block)
    new(obj, *args).serialize(&block)
  end

attr_reader :args, :obj, :hoptions, :serialized

  delegate :decode, :encode, to: :hash_ids

  def initialize(obj, *args, **hoptions)
    @obj = obj
    @args = args
    @hoptions = hoptions
    @serialized = {}
  end

  def serialize(&block)
    serialized.tap do |serialized_hash|
      args.each do |arg|
        serialized[arg] = obj.send(arg)
      end

      serialized_hash[:id] = encode(obj.id)
      serialized.merge!(hoptions)

      instance_eval(&block) if block_given?
    end
  end

  private

  def hash_ids
    @has_ids ||= Hashids.new('this is my salt', 5)
  end

  def attribute(arg, &block)
    serialized[arg] = block_given? ? obj.instance_exec(self, &block) : obj.send(arg)
  end
end
