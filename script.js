let usedWords = [];
let previousWord = "";
let score = 0;
let timer;
let timeLimit = 60;
let tamilWords = [];

let varisaiGroups = [
  ["க்", "க", "கா", "கி", "கீ", "கு", "கூ", "கெ", "கே", "கை", "கொ", "கோ", "கௌ"],
  ["ச்", "ச", "சா", "சி", "சீ", "சு", "சூ", "செ", "சே", "சை", "சொ", "சோ", "சௌ"],
  ["ட்", "ட", "டா", "டி", "டீ", "டு", "டூ", "டெ", "டே", "டை", "டொ", "டோ", "டௌ"],
  ["த்", "த", "தா", "தி", "தீ", "து", "தூ", "தெ", "தே", "தை", "தொ", "தோ", "தௌ"],
  ["ப்", "ப", "பா", "பி", "பீ", "பு", "பூ", "பெ", "பே", "பை", "பொ", "போ", "பௌ"],
  ["ம்", "ம", "மா", "மி", "மீ", "மு", "மூ", "மெ", "மே", "மை", "மொ", "மோ", "மௌ"],
  ["ய்", "ய", "யா", "யி", "யீ", "யு", "யூ", "யெ", "யே", "யை", "யொ", "யோ", "யௌ"],
  ["ர்", "ர", "ரா", "ரி", "ரீ", "ரு", "ரூ", "ரெ", "ரே", "ரை", "ரொ", "ரோ", "ரௌ"],
  ["ல்", "ல", "லா", "லி", "லீ", "லு", "லூ", "லெ", "லே", "லை", "லொ", "லோ", "லௌ"],
  ["வ்", "வ", "வா", "வி", "வீ", "வு", "வூ", "வெ", "வே", "வை", "வொ", "வோ", "வௌ"],
  ["ழ்", "ழ", "ழா", "ழி", "ழீ", "ழு", "ழூ", "ழெ", "ழே", "ழை", "ழொ", "ழோ", "ழௌ"],
  ["ள்", "ள", "ளா", "ளி", "ளீ", "ளு", "ளூ", "ளெ", "ளே", "ளை", "ளொ", "ளோ", "ளௌ"],
  ["ற்", "ற", "றா", "றி", "றீ", "று", "றூ", "றெ", "றே", "றை", "றொ", "றோ", "றௌ"],
  ["ன்", "ன", "னா", "னி", "னீ", "னு", "னூ", "னெ", "னே", "னை", "னொ", "னோ", "னௌ"],
];

function splitGraphemes(str) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    let segmenter = new Intl.Segmenter('ta', {granularity: 'grapheme'});
    return Array.from(segmenter.segment(str), s => s.segment);
  }
  return [...str]; 
}

function getLastGrapheme(word) {
  let graphemes = splitGraphemes(word);
  return graphemes[graphemes.length - 1];
}

function getFirstGrapheme(word) {
  let graphemes = splitGraphemes(word);
  return graphemes[0];
}

function findVarisaiGroup(letter) {
  for (let group of varisaiGroups) {
    if (group.includes(letter)) return group;
  }
  return null;
}

fetch('tamil.json')
  .then(res => res.json())
  .then(data => tamilWords = data)
  .catch(err => {
    alert("Failed to load Tamil word list.");
    console.error(err);
  });

function startGameWithRandomWord() {
  if (tamilWords.length === 0) {
    alert("Tamil word list not loaded or no words left.");
    return;
  }

  let word = tamilWords[Math.floor(Math.random() * tamilWords.length)];
  previousWord = word;

  tamilWords = tamilWords.filter(w => w !== previousWord);

  beginGame();
}

function startGameManual() {
  let inputWord = prompt("Enter a starting Tamil word:");
  if (!inputWord || inputWord.trim() === "") return;

  inputWord = inputWord.trim();
  if (!validateWord(inputWord)) {
    alert("That word is not in the word list!");
  } else {
    previousWord = inputWord;

    tamilWords = tamilWords.filter(w => w !== previousWord);

    beginGame();
  }
}

function beginGame() {
  usedWords = [previousWord];
  score = 0; 
  document.getElementById("previous-word").innerText = previousWord;
  document.getElementById("start-word-section").style.display = "none";
  document.getElementById("game-section").style.display = "block";
  document.getElementById("chain-list").innerHTML = `<li>${previousWord}</li>`;
  document.getElementById("score").innerText = `Score: ${score}`;
  startTimer();
}


function submitWord() {
  let input = document.getElementById("word-input");
  let newWord = input.value.trim();
  input.value = "";

  if (!newWord) return;

  if (newWord.length < 2) {
    alert("The word must be at least 2 characters long.");
    return;
  }

  if (usedWords.includes(newWord)) {
    alert("This word has already been used!");
    return;
  }

  let lastChar = getLastGrapheme(previousWord);
  let firstChar = getFirstGrapheme(newWord);

  let lastGroup = findVarisaiGroup(lastChar);
  if (!lastGroup) {
    alert("Could not determine letter group of previous word.");
    return;
  }
  if (!lastGroup.includes(firstChar)) {
    alert(`The word must start with a letter from the '${lastGroup[0]}' varisai group.`);
    return;
  }

  if (!validateWord(newWord)) {
    alert("This word is not in the Tamil word list.");
    return;
  }

  usedWords.push(newWord);

  tamilWords = tamilWords.filter(w => w !== newWord);

  previousWord = newWord;
  document.getElementById("previous-word").innerText = newWord;
  document.getElementById("chain-list").innerHTML += `<li>${newWord}</li>`;

  // Score is total length of all used words combined
  score = usedWords.reduce((sum, w) => sum + w.length, 0);
  document.getElementById("score").innerText = `Score: ${score}`;
}

function validateWord(word) {
  return tamilWords.includes(word);
}

function resetGame() {
  usedWords = [];
  previousWord = "";
  score = 0;
  tamilWords = [];

  document.getElementById("previous-word").innerText = "";
  document.getElementById("chain-list").innerHTML = "";
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("timer").innerText = "";

  document.getElementById("start-word-section").style.display = "block";
  document.getElementById("game-section").style.display = "none";

  fetch('tamil.json')
    .then(res => res.json())
    .then(data => tamilWords = data)
    .catch(err => {
      alert("Failed to load Tamil word list.");
      console.error(err);
    });

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startTimer() {
  let time = timeLimit;
  document.getElementById("timer").innerText = `Time left: ${time} seconds`;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = `Time left: ${time} seconds`;
    if (time <= 0) {
      clearInterval(timer);
      alert(`Time’s up! Your score is: ${score}`);
      location.reload();
    }
  }, 1000);
}
