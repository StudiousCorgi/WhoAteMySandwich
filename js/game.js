// Data & State
const suspects = [
  { name: 'Chase', img: '../suspects/Suspect_Chase.png' },
  { name: 'Alicia', img: '../suspects/Suspect_Alicia.png' },
  { name: 'Mike', img: '../suspects/Suspect_Mike.png' },
  { name: 'Matt', img: '../suspects/Suspect_Matt.png' },
  { name: 'Sarah', img: '../suspects/Suspect_Sarah.png' }
];
let current = 0;
const guiltyIndex = Math.floor(Math.random() * suspects.length);
const questioned = new Set();
let qIdx = 0;

// Questions
const questionData = [
  { q: 'Where were you at noon today?', choices: [
      { t: 'At my desk', i: 'Just working.', g: 'Probably by the fridge.' },
      { t: 'Breakroom',   i: 'Grabbing coffee.', g: 'Getting coffee...' },
      { t: 'On a call',   i: 'With client.',    g: 'Call? Not sure.' },
      { t: 'In a meeting',i: 'Team sync-up.',   g: 'Meeting? I forgot.' }
    ]
  },
  { q: 'Did you see anyone near my sandwich?', choices: [
      { t: 'No one',     i: 'Nope.',           g: 'Maybe someone.' },
      { t: 'Mike',       i: 'He walked by.',   g: 'He? I don\'t know.' },
      { t: 'Sarah',      i: 'She was here.',   g: 'Sarah? Eh.' },
      { t: 'Not sure',   i: 'Didn\'t watch.', g: 'No clue.' }
    ]
  },
  { q: 'Did you have lunch today?', choices: [
      { t: 'My sandwich', i: 'Turkey.',       g: 'Lunch? Maybe.' },
      { t: 'Not yet',     i: 'Soon.',         g: 'No...' },
      { t: 'A salad',     i: 'Healthy!',      g: 'Salad? No.' },
      { t: 'Shared food', i: 'Yes.',          g: 'Not really.' }
    ]
  },
  { q: 'Can I trust you?', choices: [
      { t: 'Absolutely',   i: 'Of course.',    g: 'Maybe.' },
      { t: 'Depends',      i: 'Situation.',     g: 'Depends.' },
      { t: 'Not really',   i: 'I\'m honest.',  g: 'No.' },
      { t: 'I don\'t know', i: 'I believe so.', g: 'No idea.' }
    ]
  }
];

// Elements
const carouselInner = document.querySelector('#suspect-carousel .carousel-inner');
const modal = new bootstrap.Modal('#question-modal');
const choicesEl = document.getElementById('choices');
const responseText = document.getElementById('response-text');
const nextQBtn = document.getElementById('next-question-btn');
const accuseList = document.getElementById('accuse-list');
const restartBtn = document.getElementById('restart-btn');

// Build carousel items
suspects.forEach((sus, idx) => {
  const item = document.createElement('div');
  item.className = 'carousel-item';
  if (idx === 0) item.classList.add('active');
  item.dataset.index = idx;
  item.innerHTML = `
    <img src="${sus.img}" alt="${sus.name}">
    <h4 class="text-white mt-2">${sus.name}</h4>
    <button class="btn btn-primary ask-btn mt-2" ${questioned.has(idx)?'disabled':''}>
      Ask Questions
    </button>
  `;
  carouselInner.append(item);
});

// Checklist
const checklistEl = document.getElementById('check-items');
suspects.forEach(s => {
  const cb = document.createElement('input');
  cb.type = 'checkbox'; cb.className = 'form-check-input me-1'; cb.id = `check-${s.name}`;
  const lbl = document.createElement('label'); lbl.className = 'form-check-label'; lbl.htmlFor = cb.id; lbl.textContent = s.name;
  const wrapper = document.createElement('div'); wrapper.className = 'form-check'; wrapper.append(cb, lbl);
  checklistEl.append(wrapper);
});

// Update current on slide
function updateCurrent() {
  const active = document.querySelector('.carousel-item.active');
  current = parseInt(active.dataset.index, 10);
}
document.getElementById('suspect-carousel').addEventListener('slid.bs.carousel', updateCurrent);

// Ask questions
function showQuestion() {
  const data = questionData[qIdx];
  document.getElementById('question-title').textContent = data.q;
  choicesEl.innerHTML = '';
  data.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-light';
    btn.textContent = c.t;
    btn.onclick = () => {
      responseText.textContent = current===guiltyIndex ? c.g : c.i;
      nextQBtn.style.display = 'inline-block';
    };
    choicesEl.append(btn);
  });
  responseText.textContent = '';
  nextQBtn.style.display = 'none';
}

// Listen ask-button clicks
document.addEventListener('click', e => {
  if (e.target.matches('.ask-btn')) {
    qIdx = 0;
    showQuestion();
    modal.show();
  }
});

// Next question
nextQBtn.addEventListener('click', () => {
  qIdx++;
  if (qIdx < questionData.length) {
    showQuestion();
  } else {
    questioned.add(current);
    modal.hide();
    document.querySelector(`.carousel-item[data-index="${current}"] .ask-btn`).disabled = true;
    if (questioned.size === suspects.length) startAccusation();
  }
});

// Accusation
function startAccusation() {
  document.getElementById('suspect-carousel').classList.add('d-none');
  document.getElementById('accusation-screen').classList.remove('d-none');
  suspects.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'list-group-item list-group-item-action';
    btn.textContent = s.name;
    btn.onclick = () => {
      document.getElementById('accusation-screen').classList.add('d-none');
      document.getElementById('result-screen').classList.remove('d-none');
      document.getElementById('result-text').textContent = i===guiltyIndex
        ? 'You caught the sandwich thief!'
        : "Yeah, HR is going to hear about this...";
    };
    accuseList.append(btn);
  });
}

// Restart
restartBtn.addEventListener('click', () => location.reload());

// Initialize
updateCurrent();
