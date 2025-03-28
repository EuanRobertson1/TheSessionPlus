# Session+ – Traditional Music Companion App

**Session+** is a mobile-focused Progressive Web App (PWA) designed to help traditional musicians search for tunes, find upcoming music sessions, and record ideas quickly on the go. 

Created for the module CS52001 - Mobile Application Development whilst undertaking MSc Advanced Computer Science at the University of Dundee

---

## Features

- Search Tunes – Look up tunes by name using [The Session](https://thesession.org)'s API.
- Find Sessions – Browse a list of upcoming music sessions sourced from The Session.
- Record Ideas – Use your device microphone to record and play back audio clips.
- Save Tunes – Save links to tunes for quick access later.
- Mobile-First Design – Built as a single-page PWA with offline capability and responsive layout.

---

## Technologies Used

- Vanilla JavaScript (modular)
- HTML/CSS
- MediaRecorder API
- GitHub Pages (PWA hosting)
- The Session API (for tunes and events)

---

## Using the APP

 Access the app via [GitHub Pages](https://euanrobertson1.github.io/TheSessionPlus/), ideally on mobile!

---

## Known Issues / Limitations

- Disclaimer Screen Bug: The disclaimer screen works correctly on mobile, but may not behave as expected on some desktop browsers 
- Recording Format Compatibility: Audio is recorded using the MediaRecorder API. iOS requires `audio/mp4` for playback; the app includes a MIME type fallback check to address this.

---

## Future Improvements

- Implement reliable tune recognition using audio analysis or backend support.
- Add the ability to download or export recordings.
- Introduce user authentication to allow users to sync tune and recording collections across devices.

---

## Credits

- All tune, session, and event data is provided by [The Session](https://thesession.org).
- Icons provided by Tabler Icons.

---

## Author

**Euan Robertson**  

