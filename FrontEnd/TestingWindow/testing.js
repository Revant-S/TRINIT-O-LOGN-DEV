const QuestionPaper = {
  _id: "65ebc9c7585e1a0f612c7d7d",
  testName: "Physics Test",
  questions: [
    {
      questionText: "What is the formula for force?",
      options: ["F = ma", "E = mc^2", "F = mv", "F = mgh"],
      correctAnswer: 0,
      image: "URL_to_image_1",
      _id: "65ebc9c7585e1a0f612c7d7e",
    },
    {
      questionText: "Which of the following is a vector quantity?",
      options: ["Mass", "Distance", "Time", "Velocity"],
      correctAnswer: 3,
      image: "URL_to_image_2",
      _id: "65ebc9c7585e1a0f612c7d7f",
    },
    {
      questionText: "What is the SI unit of electric current?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctAnswer: 0,
      image: "URL_to_image_3",
      _id: "65ebc9c7585e1a0f612c7d80",
    },
    {
      questionText:
        "Which law states that every action has an equal and opposite reaction?",
      options: [
        "Newton's First Law",
        "Newton's Second Law",
        "Newton's Third Law",
        "Law of Gravitation",
      ],
      correctAnswer: 2,
      image: "URL_to_image_4",
      _id: "65ebc9c7585e1a0f612c7d81",
    },
    {
      questionText: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correctAnswer: 0,
      image: "URL_to_image_5",
      _id: "65ebc9c7585e1a0f612c7d82",
    },
  ],
  access: "Public",
  upvotes: 0,
  downvotes: 0,
  comments: [
    {
      _id: "65ebc9c7585e1a0f612c7d83",
    },
  ],
  __v: 0,
};

const testName = document.getElementById("testName");
const Qno = document.getElementById("QNo");
const quesArray = QuestionPaper.questions;
const quesContainer = document.querySelector(".question");
const content = document.getElementById("content");
const nxtBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const display = document.querySelector(".display");

let userResponse = new Array(quesArray.length).fill(null);
let ind = 0;
let marks = 0,
  totalmarks = 0,
  percentage = 0,
  rank = 0,
  attempted = 0,
  correct = 0,
  negative = 0,
  totalTime = 0,
  accuracy = 0,
  timetaken = 0,
  timeSpent=0;
let analysis = [];
let timer = null;
let startTime = 0;
let endTime = 0;
let elaspedTime = 0;

function evaluate() {
  userResponse.forEach((element) => {
    if (element != null) attempted++;
  });
  totalmarks = quesArray.length * 4;
  userResponse.forEach((element, index) => {
    if (element == quesArray[index].correctAnswer) {
      correct++;
    } else if (element != quesArray[index].correctAnswer && element != null) {
      negative++;
    }
  });
  totalTime = 2;
  timeSpent = elaspedTime / (1000 * 60);
  if(timeSpent<0)timeSpent=0;
  timetaken=totalTime-timeSpent;
  accuracy = (correct / attempted) * 100;
  marks = 4 * correct - negative;
  percentage = (marks / totalmarks) * 100;
  analysis = [
    marks,
    totalmarks,
    percentage,
    rank,
    attempted,
    correct,
    negative,
    totalTime,
    timetaken,
    accuracy,
  ];
}

function start() {
  endTime = Date.now() + 120000;
  elaspedTime = endTime;
  startTime = Date.now();
  timer = setInterval(update, 10);
}

function stop() {
  clearInterval(timer);
  console.log(userResponse);
  evaluate();
  console.log(analysis);
  content.innerHTML = "";
  const message = document.createElement("h1");
  message.classList.add("message");
  message.textContent =
    "Your test has been submited and your responses have been recorded";
  content.appendChild(message);
  setTimeout(() => {
    window.location.href = "/Test Report/index.html";
  }, 4000);
}

function update() {
  const currentTime = Date.now();
  elaspedTime = 120000 - (currentTime - startTime);
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

function nextQustion() {
  if (ind >= quesArray.length) {
    ind = quesArray.length - 1;
    submitBtn.classList.add("end");
  } else {
    submitBtn.classList.remove("end");
  }
  clearHTML();
  Qno.textContent = "Q" + (ind + 1);
  const ques = document.createElement("p");
  ques.textContent = quesArray[ind].questionText;
  const image = document.createElement("img");
  image.src = quesArray[ind].image;
  image.alt = "";
  content.appendChild(ques);
  content.appendChild(image);
  quesArray[ind].options.forEach((element, index) => {
    const options = document.createElement("input");
    options.type = "radio";
    options.id = element;
    options.name = "Q" + (ind + 1);
    options.value = index;
    options.addEventListener("change", () => {
      userResponse[ind - 1] = index;
    });
    const label = document.createElement("label");
    label.htmlFor = element;
    label.textContent = element;
    const brek = document.createElement("br");
    content.appendChild(options);
    content.appendChild(label);
    content.appendChild(brek);
  });

  quesContainer.appendChild(content);
  ind++;
  console.log(ind + " inside the nextQuestion");
}

function prevQustion() {
  if (ind <= 1) {
    ind = 1;
  }
  submitBtn.classList.remove("end");
  clearHTML();
  const ques = document.createElement("p");
  ques.textContent = quesArray[ind - 1].questionText;
  const image = document.createElement("img");
  image.src = quesArray[ind - 1].image;
  image.alt = "";
  content.appendChild(ques);
  content.appendChild(image);
  quesArray[ind - 1].options.forEach((element, index) => {
    const options = document.createElement("input");
    options.type = "radio";
    options.id = element;
    options.name = "Q" + (ind - 1);
    options.value = index;
    options.addEventListener("change", () => {
      userResponse[ind] = index;
    });
    const label = document.createElement("label");
    label.textContent = element;
    label.htmlFor = element;
    const brek = document.createElement("br");
    content.appendChild(options);
    content.appendChild(label);
    content.appendChild(brek);
  });
  quesContainer.appendChild(content);
  ind--;
  Qno.textContent = "Q" + (ind + 1);
  console.log(ind + " inside the prevQuestion");
}

function clearHTML() {
  content.innerHTML = "";
}

testName.textContent = QuestionPaper.testName;
nextQustion();
start();

nxtBtn.addEventListener("click", nextQustion);

prevBtn.addEventListener("click", prevQustion);

submitBtn.addEventListener("click", stop);

export {analysis};
