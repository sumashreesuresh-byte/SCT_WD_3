const questions = [
  { q: "Which company uses a bitten apple as its logo?", options: ["Samsung","Apple","Dell","Lenovo"], a: "Apple" },
  { q: "The swoosh logo belongs to which company?", options: ["Adidas","Puma","Nike","Reebok"], a: "Nike" },
  { q: "A logo with four interlinked rings represents which brand?", options: ["BMW","Audi","Mercedes-Benz","Volkswagen"], a: "Audi" },
  { q: "Which company’s logo is a blue bird?", options: ["Facebook","Twitter","LinkedIn","Telegram"], a: "Twitter" },
  { q: "The golden arches logo belongs to:", options: ["Burger King","McDonald’s","KFC","Subway"], a: "McDonald’s" },
  { q: "A green siren/mermaid is the logo of:", options: ["Costa Coffee","Starbucks","Nescafé","Dunkin’"], a: "Starbucks" },
  { q: "Which brand uses a three-pointed star logo?", options: ["Audi","Tesla","Mercedes-Benz","Toyota"], a: "Mercedes-Benz" },
  { q: "A play button inside a rectangle represents:", options: ["Netflix","YouTube","Prime Video","Spotify"], a: "YouTube" },
  { q: "Red and white swirl Pepsi Globe belongs to:", options: ["Coca-Cola","Pepsi","Fanta","Sprite"], a: "Pepsi" },
  { q: "Checkered flag-like F logo belongs to:", options: ["Flipkart","Facebook","Ferrari","Ford"], a: "Flipkart" },
  { q: "The logo with a smiling arrow from A to Z belongs to ______.", a: "Amazon" },
  { q: "The bat symbol is associated with the sports brand ______.", a: "Puma" },
  { q: "A crown logo is used by the luxury watch brand ______.", a: "Rolex" },
  { q: "The logo with two overlapping Cs represents ______.", a: "Chanel" },
  { q: "The red play triangle is the logo of ______.", a: "YouTube" }
];

let index = 0;
let answers = [];
let username = "";

const landing = document.getElementById("landing");
const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");

/* START QUIZ */
function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter your name");

  landing.classList.add("hidden");
  quiz.classList.remove("hidden");
  loadQuestion();
}

/* LOAD QUESTION */
function loadQuestion() {
  const q = questions[index];
  progressEl.textContent = `Q${index + 1} / ${questions.length}`;
  questionEl.textContent = `${index + 1}. ${q.q}`;
  optionsEl.innerHTML = "";

  if (q.options) {
    q.options.forEach(opt => {
      const div = document.createElement("div");
      div.className = "option";
      div.textContent = opt;
      div.onclick = () => {
        document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
        div.classList.add("selected");
      };
      optionsEl.appendChild(div);
    });
  } else {
    const input = document.createElement("input");
    input.id = "fill";
    input.placeholder = "Type your answer here";
    optionsEl.appendChild(input);
  }
}

/* NEXT */
nextBtn.onclick = () => {
  const q = questions[index];
  let userAns = "";

  if (q.options) {
    const sel = document.querySelector(".option.selected");
    if (!sel) return alert("Select an option");
    userAns = sel.textContent;
  } else {
    userAns = document.getElementById("fill").value.trim();
  }

  answers.push({ question: q.q, user: userAns, correct: q.a });
  index++;

  if (index < questions.length) loadQuestion();
  else showResult();
};

/* RESULT + LEADERBOARD */
function showResult() {
  let score = 0;
  answers.forEach(a => {
    if (a.user.toLowerCase() === a.correct.toLowerCase()) score++;
  });

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: username, score });
  leaderboard.sort((a,b) => b.score - a.score);
  leaderboard = leaderboard.slice(0,5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  document.body.innerHTML = `
    <div class="result-container">
      <div class="score-card">
        <h2>📊 Quiz Completed</h2>
        <p>Your Score: ${score} / ${questions.length}</p>
      </div>

      <h3>🏆 Leaderboard</h3>
      <ul id="leaderboard"></ul>
      <div id="details"></div>
    </div>
  `;

  const lb = document.getElementById("leaderboard");
  leaderboard.forEach((p,i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${p.name} — ${p.score}`;
    lb.appendChild(li);
  });

  const details = document.getElementById("details");
  answers.forEach((a,i) => {
    const correct = a.user.toLowerCase() === a.correct.toLowerCase();
    const div = document.createElement("div");
    div.className = `result-item ${correct ? "correct" : "wrong"}`;
    div.innerHTML = `
      <p><strong>Q${i + 1}:</strong> ${a.question}</p>
      <p>Your Answer: ${a.user}</p>
      <p>Correct Answer: ${a.correct}</p>
      <p>${correct ? "✅ Correct" : "❌ Wrong"}</p>
    `;
    details.appendChild(div);
  });
}

/* THEME */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
