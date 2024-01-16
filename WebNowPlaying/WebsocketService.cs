using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebNowPlaying;

public class WebsocketService : WebSocketBehavior {
    protected override void OnMessage(MessageEventArgs e) {
        var colIdx = e.Data.IndexOf(":", StringComparison.Ordinal);
        
        var key = e.Data[..colIdx].ToLower();
        var value = e.Data[(colIdx + 1)..];

        Program.Data[key] = value;
    }
}