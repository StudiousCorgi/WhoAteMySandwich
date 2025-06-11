const suspects = [
    {
        name: "Matt",
        img: "Suspect_Matt.png",
        isGuilty: false,
        questions: ["I was microwaving Ramen.", "Nope, just the vending machine guy.", "Only if it’s toasted.", "Nope, forgot it again."],
        guiltyAnswers: ["Why are you asking me that again?", "You're obsessed with this fridge!", "What? Who told you that?", "Why are you interrogating me?"],
        sarcastic: ["Asked that already, Sherlock.", "Fridge questions again? Wow.", "Seriously? You need help.", "Get new material."],
        hints: ["sniffs you back weirdly", "laughs nervously", "wipes mouth discreetly"]
    },
    {
        name: "Mike",
        img: "Suspect_Mike.png",
        isGuilty: false,
        questions: ["I ate at my desk.", "I saw Chase go in.", "Not a fan.", "I had tacos."],
        guiltyAnswers: ["No comment.", "Maybe I did… so what?", "I only eat Organic", "You got proof? Thought not."],
        sarcastic: ["Still on this, huh?", "You ever do real work?", "Come on dude.", "Find another hobby."],
        hints: ["burps... suspiciously", "rubs belly and grins", "has crumbs on his shirt"]
    },
    {
        name: "Sarah",
        img: "Suspect_Sarah.png",
        isGuilty: false,
        questions: ["I was tutoring a student.", "No, sorry!", "Sure! But turkey is better.", "I packed leftovers."],
        guiltyAnswers: ["You think it was me!?", "Why would I know that?", "Stop asking weird questions.", "Ugh, fine. It was me."],
        sarcastic: ["Déjà vu?", "This again?", "You’re really bored, huh?", "Try using your brain."],
        hints: ["smiles nervously", "hides something behind her", "mustard on her sleeve"]
    },
    {
        name: "Alicia",
        img: "Suspect_Alicia.png",
        isGuilty: false,
        questions: ["Out getting coffee.", "Maybe Sarah?", "Ew, no thanks.", "Nope. Was planning to DoorDash."],
        guiltyAnswers: ["That's… not important.", "I didn’t see anyone, okay?!", "What makes you think that?", "You’re out of line."],
        sarcastic: ["You asked that already!", "Move on!", "Fridge again? LOL", "Repeating won’t help."],
        hints: ["looks at you suspiciously", "fidgets with her watch", "has crumbs on her blazer"]
    },
    {
        name: "Chase",
        img: "Suspect_Chase.png",
        isGuilty: false,
        questions: ["Golf call with my dad.", "Only the janitor.", "Absolutely not.", "Private chef sent it late."],
        guiltyAnswers: ["*visibly sweating*", "I don’t *need* to steal!", "Preposterous!", "This is beneath me."],
        sarcastic: ["Unoriginal.", "Try harder.", "Yawn.", "Again? Really?"],
        hints: ["*blushes*", "has a food in teeth", "wipes mustard off his lip"]
    }
];

const imgEl = document.getElementById("suspect-img");
const nameEl = document.getElementById("suspect-name");
const responseBox = document.getElementById("response-box");
const checklistEl = document.getElementById("checklist");
const askedTracker = suspects.map(() => [false, false, false, false]);
const hintedTracker = suspects.map(() => false);

// Randomly select a guilty suspect
let currentIndex = 0;
let guiltyIndex = Math.floor(Math.random() * suspects.length);
suspects[guiltyIndex].isGuilty = true;

// Initialize the suspect image and name
function updateSuspects() {
    const currentSuspect = suspects[currentIndex];
    imgEl.src = currentSuspect.img;
    nameEl.textContent = currentSuspect.name;
    document.querySelectorAll(".question-btn").forEach(btn => {
        const i = btn.getAttribute("data-index");
        btn.disabled = askedTracker[currentIndex][i];
    });
    responseBox.classList.add("d-none");
}

function handleQuestion(index) {
    const currentSuspect = suspects[currentIndex];
    const alreadyAsked = askedTracker[currentIndex][index];

    let response = "";
    if (alreadyAsked) {
        response = currentSuspect.sarcastic[index % currentSuspect.sarcastic.length];
    } else {
        response = currentSuspect.isGuilty
            ? currentSuspect.guiltyAnswers[index % currentSuspect.guiltyAnswers.length]
            : currentSuspect.questions[index % currentSuspect.questions.length];
        askedTracker[currentIndex][index] = true;
    }

    document.querySelectorAll(".question-btn")[index].disabled = true;
    showResponse(response);
}

function showResponse(text) {
    responseBox.textContent = text;
    responseBox.classList.remove("d-none");
}

function addToChecklist(name) {
    if (!Array.from(checklistEl.children).some(li => li.textContent === name)) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = name;
        checklistEl.appendChild(li);
    }
}

function handleHint() {
    if (hintedTracker[currentIndex]) {
        showResponse("You’ve already searched here.");
        return;
    }

    const actions = ["Sniff for roast beef", "Check for crumbs", "Look for mustard stains"];
    const action = actions[Math.floor(Math.random() * actions.length)];

    const currentSuspect = suspects[currentIndex];
    let response = "You found nothing unusual.";
    if (currentSuspect.isGuilty) {
        response = `${action}: ${currentSuspect.hints ? currentSuspect.hints[Math.floor(Math.random() * currentSuspect.hints.length)] : "Something feels off..."}`;
    } else {
        response = `${action}: ${currentSuspect.name} looks confused.`;
    }

    hintedTracker[currentIndex] = true;
    showResponse(response);
}

function accuseCurrentSuspect() {
    const currentSuspect = suspects[currentIndex];
    addToChecklist(currentSuspect.name);
    if (currentSuspect.isGuilty) {
        alert("🎉 You caught the sandwich thief!");
    } else {
        alert("😬 Yeah, HR is going to hear about this...");
    }
}

document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + suspects.length) % suspects.length;
    updateSuspects();
});
document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % suspects.length;
    updateSuspects();
});
document.querySelectorAll(".question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        handleQuestion(index);
    });
});
document.getElementById("hint-btn").addEventListener("click", handleHint);
document.getElementById("accuse-btn").addEventListener("click", accuseCurrentSuspect);

// Initiate the game by updating suspects
updateSuspects();
function questionHandler(i) { handleQuestion(i)};