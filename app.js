const playBtn = document.querySelector("#play");
const audio = document.querySelector("audio");
const voiceRange = document.querySelector("#voice");
const voiceValue = document.querySelector("#voice-value");
const container = document.querySelector(".container");
const backward = document.querySelector("#backward");
const forward = document.querySelector("#forward");
const cover = document.querySelector("#cover");
const progress = document.querySelector(".progress");
const audioName = document.querySelector(".audio-name");
const speed = document.querySelector("#speed");
const progressContainer = document.querySelector(".progress-container");

const musics = [
  "The Weeknd - Save Your Tears",
  "The Weeknd - Blinding Lights",
  "Shawn Mendes - There s Nothing Holdin  Me Back",
];

let speedLimit = 1;
speed.addEventListener("click", () => {
  if (speedLimit < 2) {
    speedLimit += 0.25;
  } else {
    speedLimit = 1;
    speed.textContent = `${speedLimit}x`;
  }
  speed.textContent = `${speedLimit}x`;
  audio.playbackRate = `${speedLimit}`;
});

let currentMusic = 0;
function changeMusic(currentMusic) {
  cover.src = `./images/${musics[currentMusic]}.jpg`;
  cover.alt = `${musics[currentMusic]}`;
  audio.src = `./music/${musics[currentMusic]}.mp3`;
  audioName.textContent = `${musics[currentMusic]}`;
}
changeMusic(currentMusic);

function play() {
  audio.play();
  container.classList.add("play");
  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}
function pause() {
  audio.pause();
  container.classList.remove("play");
  playBtn.innerHTML =` <i class="fa-solid fa-play"></i>`;
}

function goForward() {
  if (musics.length - 1 > currentMusic) {
    currentMusic++;
  } else {
    currentMusic = 0;
  }

  changeMusic(currentMusic);
  play();
}
forward.addEventListener("click", goForward);

backward.addEventListener("click", () => {
  if (currentMusic != 0) {
    currentMusic--;
  } else {
    currentMusic = musics.length - 1;
  }

  changeMusic(currentMusic);
  play();
});

audio.volume = 0.5;
voiceValue.textContent = 50;

playBtn.addEventListener("click", () => {
  const isPlaying = container.classList.contains("play");

  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

voiceRange.addEventListener("input", () => {
  audio.volume = voiceRange.value / 100;
  voiceValue.textContent = voiceRange.value;
});

audio.addEventListener("timeupdate", () => {
  progress.style.width = ` ${(audio.currentTime / audio.duration) * 100}%`;
});

audio.addEventListener("ended", () => {
  goForward();
});

const currentTimeEl = document.querySelector("#current-time");
const totalTimeEL = document.querySelector("#total-time");

function formatTime(time) {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart("2", "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart("2", "0");
  return ` ${minutes}:${seconds}`;
}
audio.addEventListener("loadedmetadata", () => {
  totalTimeEL.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
});

progressContainer.addEventListener("click", (e) => {
  const totalWidth = progressContainer.offsetWidth;
  const clickedX = e.offsetX;

  const width = (clickedX / totalWidth) * 100;
  progress.style.width = `${width}`;

  audio.currentTime = (audio.duration / 100) * width;
});

voiceValue.style.color = "white";

const bars = document.querySelectorAll(".waveform .bar");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function animate() {
  analyser.getByteFrequencyData(dataArray);
  for (let i = 0; i < bars.length; i++) {
    let value = dataArray[i];
    bars[i].style.height = (value / 255) * 50 + 10 + "px";
  }

  requestAnimationFrame(animate);
}

audio.addEventListener("play", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  animate();
});
