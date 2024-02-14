const bgStack = document.getElementById("background-stack");
const backgrounds = document.getElementById("backgrounds");

const coverStack = document.getElementById("cover-stack");

const songTitle = document.getElementById("title");
const songArtist = document.getElementById("artist");
const songAlbum = document.getElementById("album");
const songProgress = document.getElementById("progress");
const songPosition = document.getElementById("progress-position");
const songDuration = document.getElementById("progress-duration");
const songProgressFill = document.getElementById("progress-fill");

const connectOverlay = document.getElementById("connecting-overlay");

// query settings
const query = new URLSearchParams(window.location.search);

const hideAlbum = getParam(query, "album", "0", false);
const bg = getParam(query, "bg", "1", true);
const positionTop = getParam(query, "v", "top", false);
const positionRight = getParam(query, "h", "right", false);
const boxBackground = getParam(query, "box-bg", "1", false);

const progress = getParam(query, "progress", "1", true);
const progressFullSize = getParam(query, "progress-size", "full", false);

let lastData = {
    player: "",
    position: "0:00",
    duration: "0:00",
    title: "Title",
    artist: "Artist",
    album: "",
    cover: "",
    background: ""
};

let lastBackground = null;

if (positionTop)
    document.body.classList.add("top");
if (positionRight)
    document.body.classList.add("right");
if (boxBackground)
    document.body.classList.add("box-background");
if (progressFullSize)
    songProgress.classList.add("progress-full");

start().then(() => console.log("Started"));

async function start() {
    let json = await fetch('https://share.flux.moe/wnp/overrides.json').then(response => response.json());

    update(json.id, json.cover);
    setInterval(function () {
        update(json.id, json.cover);
    }, 200)
}

function switchCover(img) {
    let index = coverStack.children.length - 1;
    let prev = coverStack.children[index - 1];

    if (prev) {
        prev.classList.add("hide");
        setTimeout(function () {
            coverStack.removeChild(prev);
        }, 1000);
    }

    img.classList.add("show");
}

function update(overrides, coverOverrides) {
    fetch("data.json")
        .then(response => response.json())
        .then(json => {
            // default data
            let data = {
                player: "",
                position: "0:00",
                duration: "0:00",
                title: "Title",
                artist: "Artist",
                album: "",
                cover: "",
                background: ""
            };
            
            // assign data to defaults
            Object.assign(data, json);

            // replace data by id
            if (data.cover.startsWith("https://i.ytimg.com/vi/") || data.cover.startsWith("https://i.ytimg.com/vi_webp/")) {
                let id = data.cover.split("/")[4];

                if (id.includes("?")) id = id.split("?")[0];
                if (id.includes("&")) id = id.split("&")[0];
                if (id.includes("#")) id = id.split("#")[0];

                // data.cover = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
                
                if (overrides[id]) {
                    data = Object.assign(data, overrides[id]);
                }
            }

            // replace data by cover url
            if (coverOverrides[data.cover]) {
                data = Object.assign(data, coverOverrides[data.cover]);
            }

            if (data.cover !== lastData.cover) {
                let img = document.createElement("img");
                img.src = data.cover;
                img.onload = function () {
                    switchCover(img);
                }

                coverStack.appendChild(img);
                lastData.cover = data.cover;
            }
            
            if (bg) {
                if (!data.background)
                    data.background = data.cover;

                if (data.background !== lastData.background) {
                    changeBg(data.background);
                    lastData.background = data.background;
                }
            }
            else {
                backgrounds.style.display = "none";
            }
            
            if (lastData.title !== data.title && data.title) {
                songTitle.textContent = data.title;
                lastData.title = data.title;
            }
            
            if (lastData.artist !== data.artist && data.artist) {
                songArtist.textContent = data.artist;
                lastData.artist = data.artist;
            }
            
            if (data.album && !hideAlbum) {
                if (lastData.album !== data.album) {
                    songAlbum.textContent = 'from ' + unescape(JSON.parse('"' + data.album + '"'));
                    lastData.album = data.album;
                }
            }
            else 
                songAlbum.textContent = "";

            if (progress) {
                let position = parseTime(data.position);
                let duration = parseTime(data.duration);

                songPosition.textContent = data.position;
                songDuration.textContent = data.duration;

                let percent = position / duration;
                songProgressFill.style.width = percent * 100 + "%";
            }
            else {
                songProgress.style.display = "none";
            }
            
            if (lastData.player !== data.player) {
                if (data.player)
                    connectOverlay.style.opacity = "0";
                else
                    connectOverlay.style.opacity = "1";
                
                lastData.player = data.player;
            }
        })
}

let first = true;

function changeBg(url) {
    let bg = document.createElement("img");
    bg.className = "bg";
    bg.src = url;
    bgStack.appendChild(bg);

    bg.onload = function () {
        bg.classList.add("show");

        if (bgStack.children.length > 1) {
            setTimeout(function () {
                bgStack.removeChild(bgStack.children[0]);
            }, 2000);
        }

        lastBackground = bg;
    }

    if (!first) {
    } else {
        first = false;
    }
}

function parseTime(time) {
    let split = time.split(":");

    if (split.length === 1) return parseInt(time);
    
    if (split.length === 2) {
        let min = split[0];
        let sec = split[1];

        let minInt = parseInt(min);
        let secInt = parseInt(sec);

        return minInt * 60 + secInt;
    }

    if (split.length === 3) {
        let hour = split[0];
        let min = split[1];
        let sec = split[2];

        let hourInt = parseInt(hour);
        let minInt = parseInt(min);
        let secInt = parseInt(sec);

        return hourInt * 3600 + minInt * 60 + secInt;
    }

    return parseInt(time);
}

function getParam(query, name, equals, defaultValue) {
    let value = query.get(name);
    if (value === null) return defaultValue;
    return value === equals;
}