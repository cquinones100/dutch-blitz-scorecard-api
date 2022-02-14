class LobbyChannel < ApplicationCable::Channel
  def subscribed
    stream_from "lobby_#{params[:lobby_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  class << self
    delegate :decode, :encode, to: :hash_ids

    def broadcast(lobby)
      ActionCable.server.broadcast("lobby_#{encode(lobby.id)}", {
        data: {
          players: lobby.players.map { |player| serialize(player, :name) },
          lobby: serialize(lobby, :id).merge!(id: enccode(lobby.id))
        }
      })
    end

    private

    def hash_ids
      @has_ids ||= Hashids.new('this is my salt', 5)
    end

    def serialize(obj, *args)
      args.each_with_object({}) do |arg, hash|
        hash[arg] = obj.send(arg)
      end.tap do |hash|
        hash[:id] = encode(obj.id)
      end
    end
  end
end
  