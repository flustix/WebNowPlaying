<h1 align="center">Flux' Music Overlay</h1>
<p align="center">
    <img src="https://github.com/flustix/music-overlay/blob/master/docs/preview.png"/>
</p>
<p align="center">
    A little program that communicates with the WebNowPlaying extension to show the current song in a browser.
</p>

<p align="center">
<a href="https://github.com/flustix/music-overlay/releases"><img src="https://img.shields.io/github/v/release/flustix/music-overlay"></a>
<a href="https://github.com/flustix/music-overlay/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/flustix/music-overlay"></a>

</p>

## Installation
### Installing the browser extension
1. Follow the installation instructions for the [WebNowPlaying browser extension](https://github.com/keifufu/WebNowPlaying).
2. Open the extension settings and make sure the `Rainmeter` adapter is enabled.

### The program itself
1. Download the latest release from [here](https://github.com/flustix/music-overlay/releases).
2. Extract the zip file.
3. Run the `WebNowPlaying.exe` file.
> This starts in the background, if it seems to do nothing, that's normal.
> 
> You can close it again using task manager.

You can now open the overlay by opening `http://localhost:8975/` in your browser or add it as a browser source in OBS.

### Configuration
You can change the settings of the web-view by adding query parameters to the url.

| Parameter  | Description                                    | Values          | Default  |
|------------|------------------------------------------------|-----------------|----------|
| `album`    | Display the album name                         | `0`, `1`        | `1`      |
| `progress` | Display the progress bar                       | `0`, `1`        | `1`      |
| `bg`       | Display the background                         | `0`, `1`        | `1`      |
| `v`        | The vertical position of the overlay           | `top`, `bottom` | `bottom` |
| `h`        | The horizontal position of the overlay         | `left`, `right` | `right`  |
| `box-bg`   | Shows a transparent background behind the text | `0`, `1`        | `0`      |

For example: `http://localhost:8975/?progress=0&bg=0` will disable the progress bar and the background.