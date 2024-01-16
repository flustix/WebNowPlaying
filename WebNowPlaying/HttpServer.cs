using System.Net;
using System.Text;
using Newtonsoft.Json;

namespace WebNowPlaying;

public static class HttpServer {
    private static HttpListener? _listener;
    private static readonly bool Running = true;

    public static void Start(int port) {
        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://localhost:{port}/");
        _listener.Start();

        var thread = new Thread(StartListener);
        thread.Start();
    }

    private static void StartListener(object? o) {
        while (Running) {
            Process();
        }
    }

    private static void Process()
    {
        var res = _listener?.BeginGetContext(res => {
            try {
                Handle(res);
            }
            catch (Exception e) {
                Console.WriteLine(e);
            }
        }, _listener);
        res?.AsyncWaitHandle.WaitOne();
    }

    private static void Handle(IAsyncResult result) {
        var context = _listener?.EndGetContext(result);
        
        if (context == null)
            return;

        var req = context.Request;
        var res = context.Response;
        
        if (req.Url == null)
            return;
        
        var url = req.Url.AbsolutePath;
        
        url = url.Split('&')[0] // remove query string
            .ToLower().TrimStart('/'); // remove leading slash and lowercase
        
        var ext = Path.GetExtension(url);
        
        byte[] data;

        switch (url) {
            case "data.json":
                var json = JsonConvert.SerializeObject(Program.Data);
                data = Encoding.UTF8.GetBytes(json);
                break;
            
            case "": // redirect "/" to "/nowplaying.html"
                data = GetFile("nowplaying.html");
                ext = ".html";
                break;
            
            default:
                data = GetFile(url);
                break;
        }
        
        if (data.Length == 0) {
            res.StatusCode = 404;
            res.Close();
            return;
        }

        res.ContentType = ext switch {
            ".html" => "text/html",
            ".css" => "text/css",
            ".js" => "text/javascript",
            ".json" => "application/json",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
        
        res.ContentLength64 = data.Length;
        res.OutputStream.Write(data, 0, data.Length);
        res.Close();
    }

    private static byte[] GetFile(string url) {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "static", url);
        return !File.Exists(path) ? Array.Empty<byte>() : File.ReadAllBytes(path);
    }
}