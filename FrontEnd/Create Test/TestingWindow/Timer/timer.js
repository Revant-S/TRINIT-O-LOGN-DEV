const display = document.querySelector(".display");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");

let timer = null;
let startTime = 0;
let endTime = 0;
let elaspedTime = 0;

function updatemessage(res, classname) {
  message.style.opacity = 0;
  setTimeout(function () {
    message.textContent = res;
    message.className = classname;
  }, 250);
  setTimeout(function () {
    message.style.opacity = 1;
  }, 250);
}

function start() {
  endTime = Date.now() + 5000;
  elaspedTime = endTime;
  startTime = Date.now();
  timer = setInterval(update, 10);
}

function stop() {
  clearInterval(timer);
  updatemessage("The test has ended, Your responses have been recorded","updateMessage");
  setTimeout(() => {
    window.location.href = "/Test Report/index.html";
  }, 4000);
}

function update() {
  const currentTime = Date.now();
  elaspedTime = 5000 - (currentTime - startTime);
  if (elaspedTime <= 0) {
    stop();
  }
  let hours = Math.floor(elaspedTime / (1000 * 60 * 60))
    .toString()
    .padStart(2, 0);
  let minutes = Math.floor((elaspedTime / (1000 * 60)) % 60)
    .toString()
    .padStart(2, 0);
  let seconds = Math.floor((elaspedTime / 1000) % 60)
    .toString()
    .padStart(2, 0);
  let displayTime = hours + ":" + minutes + ":" + seconds;
  display.textContent = displayTime;
}

startBtn.addEventListener("click", start);
