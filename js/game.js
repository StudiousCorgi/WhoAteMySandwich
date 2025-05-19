const suspects = ['Chase', 'Alicia', 'Mike', 'Matt', 'Sarah'];
let currentSuspect = 0;
let guiltyIndex = Math.floor(Math.random() * suspects.length);
const questioned = new Set();

const questionData = [
  {
    question: "Ok, Chase, ...",
    choices: [
      { text: "Where were you 3 minutes ago?", innocent: "Just working!", guilty: "Uh... probably by the fridge.", },
      { text: "What lunch did you bring?", innocent: "Skipped lunch and grabbed a coffee.", guilty: "I was just getting coffee...", },
      { text: "Why are you in a rush to leave?", innocent: "I have a meeting with a client in 5 minutes.", guilty: "Pretty sure I should be on a call? I'm not sure.", },
      { text: "Did you eat my lunch?", innocent: "I didn't eat anything, but maybe I should after this.", guilty: "No buddy, of course not!", },
    ]
  },
  {
    question: "Did you see anyone near my sandwich?",
    choices: [
      { text: "No one at all", innocent: "Nobody came in.", guilty: "No idea... maybe someone.", },
      { text: "Yes, Mike", innocent: "He walked by a bit ago.", guilty: "He? I don't know.", },
      { text: "Yes, Sarah", innocent: "She was here earlier.", guilty: "Sarah? Can't recall.", },
      { text: "Not sure", innocent: "I wasn't paying attention.", guilty: "I'm not sure...", },
    ]
  },
  {
    question: "Did you have lunch today?",
    choices: [
      { text: "Yes, my own sandwich", innocent: "A turkey sandwich.", guilty: "I had lunch? Maybe.", },
      { text: "No, not yet", innocent: "I'll eat soon.", guilty: "No...not yet.", },
      { text: "Grabbed a salad", innocent: "Healthy choice!", guilty: "Salad? No...", },
      { text: "I share food", innocent: "I share with coworkers.", guilty: "Me? share? Not really.", },
    ]
  },
  {
    question: "Can I trust you?",
    choices: [
      { text: "Absolutely", innocent: "You can.", guilty: "Trust me... maybe.", },
      { text: "Depends", innocent: "On the situation.", guilty: "Depends? Yes.", },
      { text: "Not really", innocent: "I'm honest.", guilty: "Well... no.", },
      { text: "I don't know", innocent: "I believe so.", guilty: "I don't know.", },
    ]
  }
];

// --- Helpers & Elements ---
const el = id => document.getElementById(id);
const show = elem => elem.classList.remove('d-none');
const hide = elem => elem.classList.add('d-none');
const modal = new bootstrap.Modal('#question-modal');

// Build checklist
const checklistEl = el('check-items');
suspects.forEach(name => {
  const cb = document.createElement('input');
  cb.type = 'checkbox'; cb.className = 'form-check-input me-1';
  cb.id = `check-${name}`;
  const lbl = document.createElement('label');
  lbl.className = 'form-check-label';
  lbl.htmlFor = cb.id;
  lbl.textContent = name;
  const wrapper = document.createElement('div');
  wrapper.className = 'form-check';
  wrapper.append(cb, lbl);
  checklistEl.append(wrapper);
});

// Load suspect card
function loadSuspect() {
  el('suspect-name').textContent = suspects[current];
  el('suspect-img').src = `images/${suspects[current].toLowerCase()}.jpg`;
  el('question-btn').disabled = questioned.has(current);
}

// Ask questions
function ask() {
  qIdx = 0;
  showQuestion();
  modal.show();
}

function showQuestion() {
  const data = questions[qIdx];
  el('question-title').textContent = data.q;
  const choices = el('choices');
  choices.innerHTML = '';
  data.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-light';
    btn.textContent = c.t;
    btn.onclick = () => answer(c);
    choices.append(btn);
  });
  el('response-text').textContent = '';
  hide(el('next-question-btn'));
}

function answer(choice) {
  const resp = current === guilty ? choice.g : choice.i;
  el('response-text').textContent = resp;
  show(el('next-question-btn'));
}

el('next-question-btn').onclick = () => {
  qIdx++;
  if (qIdx < questions.length) {
    showQuestion();
  } else {
    endQuestions();
  }
};

function endQuestions() {
  questioned.add(current);
  modal.hide();
  loadSuspect();
  if (questioned.size === suspects.length) startAccusation();
}

// Accusation
function startAccusation() {
  hide(el('suspect-nav'));
  hide(el('question-btn'));
  show(el('accusation-screen'));
  const list = el('accuse-list');
  suspects.forEach((s, i) => {
    const item = document.createElement('button');
    item.className = 'list-group-item list-group-item-action';
    item.textContent = s;
    item.onclick = () => makeAccusation(i);
    list.append(item);
  });
}

function makeAccusation(idx) {
  hide(el('accusation-screen'));
  show(el('result-screen'));
  el('result-text').textContent =
    idx === guilty
      ? 'You caught the sandwich thief!'
      : "Yeah, HR is going to hear about this...";
}

// Restart & navigation
el('restart-btn').onclick = () => location.reload();
el('prev-btn').onclick = () => {
  current = (current + suspects.length - 1) % suspects.length;
  loadSuspect();
};
el('next-btn').onclick = () => {
  current = (current + 1) % suspects.length;
  loadSuspect();
};
el('question-btn').onclick = ask;

// Initialize
loadSuspect();