'use strict'

/* global localStorage */
/* global FileReader */
/* global DOMParser */

function Theme (client) {
  this.el = document.createElement('style')
  this.el.type = 'text/css'

  this.active = {}
  this.default = {
    background: '#000000',
    f_high: '#fff',
    f_med: '#fff',
    f_low: '#fff',
    f_inv: '#fff',
    b_high: '#000',
    b_med: '#000',
    b_low: '#000',
    b_inv: '#000'
  }

  // Callbacks
  this.onLoad = () => {}

  this.install = (host = document.body) => {
    window.addEventListener('dragover', this.drag)
    window.addEventListener('drop', this.drop)
    host.appendChild(this.el)
  }

  this.start = () => {
    console.log('Theme', 'Starting..')
    if (isJson(localStorage.theme)) {
      const storage = JSON.parse(localStorage.theme)
      if (isValid(storage)) {
        console.log('Theme', 'Loading theme in localStorage..')
        this.load(storage)
        return
      }
    }
    this.load(this.default)
  }

  this.open = () => {
    console.log('Theme', 'Open theme..')
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      this.read(e.target.files[0], this.load)
    }
    input.click()
  }

  this.load = (data) => {
    const theme = this.parse(data)
    if (!isValid(theme)) { console.warn('Theme', 'Invalid format'); return }
    console.log('Theme', 'Loaded theme!')
    this.el.innerHTML = `:root { 
      --background: ${theme.background}; 
      --f_high: ${theme.f_high}; 
      --f_med: ${theme.f_med}; 
      --f_low: ${theme.f_low}; 
      --f_inv: ${theme.f_inv}; 
      --b_high: ${theme.b_high}; 
      --b_med: ${theme.b_med}; 
      --b_low: ${theme.b_low}; 
      --b_inv: ${theme.b_inv};
    }`
    localStorage.setItem('theme', JSON.stringify(theme))
    this.active = theme
    if (this.onLoad) {
      this.onLoad(data)
    }
  }

  this.reset = () => {
    this.load(this.default)
  }

  this.set = (key, val) => {
    if (!val) { return }
    const hex = (`${val}`.substr(0, 1) !== '#' ? '#' : '') + `${val}`
    if (!isColor(hex)) { console.warn('Theme', `${hex} is not a valid color.`); return }
    this.active[key] = hex
  }

  this.get = (key) => {
    return this.active[key]
  }

  this.parse = (any) => {
    if (isValid(any)) { return any }
    if (isJson(any)) { return JSON.parse(any) }
    if (isHtml(any)) { return extract(any) }
  }

  // Drag

  this.drag = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  this.drop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file.name.indexOf('.svg') > -1) {
      this.read(file, this.load)
    }
    e.stopPropagation()
  }

  this.read = (file, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      callback(event.target.result)
    }
    reader.readAsText(file, 'UTF-8')
  }

  // Helpers

  function extract (xml) {
    const svg = new DOMParser().parseFromString(xml, 'text/xml')
    try {
      return {
        background: svg.getElementById('background').getAttribute('fill'),
        f_high: svg.getElementById('f_high').getAttribute('fill'),
        f_med: svg.getElementById('f_med').getAttribute('fill'),
        f_low: svg.getElementById('f_low').getAttribute('fill'),
        f_inv: svg.getElementById('f_inv').getAttribute('fill'),
        b_high: svg.getElementById('b_high').getAttribute('fill'),
        b_med: svg.getElementById('b_med').getAttribute('fill'),
        b_low: svg.getElementById('b_low').getAttribute('fill'),
        b_inv: svg.getElementById('b_inv').getAttribute('fill')
      }
    } catch (err) {
      console.warn('Theme', 'Incomplete SVG Theme', err)
    }
  }

  function isValid (json) {
    if (!json) { return false }
    if (!json.background || !isColor(json.background)) { return false }
    if (!json.f_high || !isColor(json.f_high)) { return false }
    if (!json.f_med || !isColor(json.f_med)) { return false }
    if (!json.f_low || !isColor(json.f_low)) { return false }
    if (!json.f_inv || !isColor(json.f_inv)) { return false }
    if (!json.b_high || !isColor(json.b_high)) { return false }
    if (!json.b_med || !isColor(json.b_med)) { return false }
    if (!json.b_low || !isColor(json.b_low)) { return false }
    if (!json.b_inv || !isColor(json.b_inv)) { return false }
    return true
  }

  function isColor (hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex)
  }

  function isJson (text) {
    try { JSON.parse(text); return true } catch (error) { return false }
  }

  function isHtml (text) {
    try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
  }
}

        let player;
        let currentTrackIndex = 0;
        let isExpanded = false;

        // List of music tracks (Video IDs and Titles)
        const tracks = [
            { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up - Rick Astley' },
            { id: '3JZ_D3ELwOQ', title: 'Bohemian Rhapsody - Queen' },
            { id: 'y6120QOlsfU', title: 'Darude - Sandstorm' }
        ];

        // When YouTube API is ready, initialize the player
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '0', // Hide video
                width: '0',  // Hide video
                videoId: tracks[currentTrackIndex].id, // Load the first track
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        // Update the displayed title when the player is ready
        function onPlayerReady(event) {
            updateTrackTitle();
        }

        // Update track title based on the current track
        function updateTrackTitle() {
            document.getElementById('musicTitle').innerText = tracks[currentTrackIndex].title;
        }

        // Play the current track
        document.getElementById('playButton').addEventListener('click', function() {
            player.playVideo();
        });

        // Pause the current track
        document.getElementById('pauseButton').addEventListener('click', function() {
            player.pauseVideo();
        });

        // Move to the next track in the list
        document.getElementById('nextButton').addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // Loop back to start
            loadTrack();
        });

        // Move to the previous track in the list
        document.getElementById('prevButton').addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // Loop to end
            loadTrack();
        });

        // Load and play the selected track
        function loadTrack() {
            player.loadVideoById(tracks[currentTrackIndex].id);
            updateTrackTitle();  // Update the title display
            player.playVideo();  // Auto-play the track
        }

        // Handle state changes (optional, can be extended)
        function onPlayerStateChange(event) {
            // Example: Automatically play next track when the current one ends
            if (event.data === YT.PlayerState.ENDED) {
                currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
                loadTrack();
            }
        }

        // Toggle the music capsule between button and expanded state
        document.getElementById('musicCapsule').addEventListener('click', function() {
            let capsule = document.getElementById('musicCapsule');
            let title = document.getElementById('musicTitle');
            let controls = document.getElementById('controls');

            if (isExpanded) {
                // Collapse to button state
                capsule.classList.remove('expanded');
                title.classList.remove('visible');
                controls.classList.remove('visible');
            } else {
                // Expand to full music capsule
                capsule.classList.add('expanded');
                title.classList.add('visible');
                controls.classList.add('visible');
            }

            isExpanded = !isExpanded; // Toggle the state
        });
