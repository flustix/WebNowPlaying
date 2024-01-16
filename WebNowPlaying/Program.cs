using Newtonsoft.Json;
using WebSocketSharp.Server;

namespace WebNowPlaying;

public static class Program {
    public static Dictionary<string, string> Data { get; } = new();

    public static async Task Main() {
        const int port = 8974;
        
        var ws = new WebSocketServer($"ws://127.0.0.1:{port}");
        ws.AddWebSocketService<WebsocketService>("/");
        ws.Start();
        
        HttpServer.Start(port + 1);
        
        Console.WriteLine($"Websocket started on port {port}!");
        Console.WriteLine($"HTTP server started at http://localhost:{port + 1}");
        
        Console.WriteLine("Ready!");
        await Task.Delay(-1);
    }
}