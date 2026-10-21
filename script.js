// ============================================================
// Quiz + schermata Patrizio + finale con video + accordion.
// Nessuna dipendenza esterna.
// ============================================================
(function () {
  "use strict";

  // Percorso del quiz: per modificarlo basta cambiare questo elenco.
  // type "q" = domanda (si va avanti solo con NOI), type "patrizio" = schermata con foto.
  var STEPS = [
    { type: "q", text: "Chi sono i più affidabili?" },
    { type: "q", text: "Chi faceva assemblee l'anno scorso tutti i mesi?" },
    { type: "q", text: "Chi non si droga/fuma?" },
    { type: "patrizio" },
    { type: "q", text: "Quindi, per chi voterai?" }
  ];

  var RIGHT_DELAY = 1000;  // ms prima di passare avanti dopo "BRAVO"
  var WRONG_DELAY = 1100;  // ms prima di tornare alla stessa domanda

  var $ = function (id) { return document.getElementById(id); };

  var quiz = $("quiz");
  var viewQuestion = $("viewQuestion");
  var viewPatrizio = $("viewPatrizio");
  var questionEl = $("question");
  var feedbackEl = $("feedback");
  var qnumEl = $("qnum");
  var progressEl = $("progress");
  var btnYes = $("btnYes");
  var btnNo = $("btnNo");
  var btnContinue = $("btnContinue");
  var finale = $("finale");
  var video = $("video");
  var accBtn = $("accBtn");
  var accPanel = $("accPanel");
  var list = $("motiviList");
  var confettiBox = $("confetti");

  var current = 0;
  var locked = false;

  // Quante sono le domande vere (senza la schermata Patrizio)
  var totalQuestions = STEPS.filter(function (s) { return s.type === "q"; }).length;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // ---------- Elenco dei 100 motivi ----------
  (function buildList() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < MOTIVI.length; i++) {
      var li = document.createElement("li");
      li.textContent = MOTIVI[i];
      frag.appendChild(li);
    }
    list.appendChild(frag);
  })();

  // ---------- Pallini di progresso ----------
  var dots = [];
  (function buildDots() {
    for (var i = 0; i < STEPS.length; i++) {
      var d = document.createElement("span");
      d.className = "dot";
      progressEl.appendChild(d);
      dots.push(d);
    }
  })();

  function updateProgress() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === current);
      dots[i].classList.toggle("done", i < current);
    }
  }

  // ---------- Mostra lo step corrente ----------
  function showStep() {
    var step = STEPS[current];
    updateProgress();
    clearFeedback();
    setLocked(false);

    if (step.type === "patrizio") {
      qnumEl.textContent = "SPECIALE ★";
      viewQuestion.hidden = true;
      viewPatrizio.hidden = false;
      restartAnim(viewPatrizio);
      return;
    }

    // numero della domanda (conta solo le domande, non la schermata Patrizio)
    var n = 0;
    for (var i = 0; i <= current; i++) { if (STEPS[i].type === "q") n++; }
    qnumEl.textContent = "DOMANDA " + pad(n) + " / " + pad(totalQuestions);

    viewPatrizio.hidden = true;
    viewQuestion.hidden = false;
    questionEl.textContent = step.text;
    questionEl.classList.toggle("long", step.text.length > 32);
    questionEl.classList.remove("pop");
    void questionEl.offsetWidth; // riavvia l'animazione
    questionEl.classList.add("pop");
  }

  function restartAnim(el) {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  function setLocked(v) {
    locked = v;
    btnYes.disabled = v;
    btnNo.disabled = v;
  }

  function clearFeedback() {
    feedbackEl.className = "feedback";
    feedbackEl.textContent = "";
  }

  function showFeedback(text, kind) {
    feedbackEl.textContent = text;
    feedbackEl.className = "feedback show " + kind;
  }

  function next() {
    current++;
    if (current >= STEPS.length) {
      showFinale();
    } else {
      showStep();
    }
  }

  // ---------- Risposte ----------
  function onRight() {
    if (locked) return;
    setLocked(true);
    showFeedback("BRAVO! 👑", "good");
    burst(22);
    setTimeout(next, RIGHT_DELAY);
  }

  function onWrong() {
    if (locked) return;
    setLocked(true);
    showFeedback("RISPOSTA SBAGLIATA! ❌", "bad");
    quiz.classList.remove("shake-card");
    void quiz.offsetWidth;
    quiz.classList.add("shake-card");
    setTimeout(function () {
      quiz.classList.remove("shake-card");
      showStep(); // stessa domanda, current non cambia
    }, WRONG_DELAY);
  }

  btnYes.addEventListener("click", onRight);
  btnNo.addEventListener("click", onWrong);

  // Schermata Patrizio: CONTINUA →
  btnContinue.addEventListener("click", function () {
    if (STEPS[current].type !== "patrizio") return;
    next();
  });

  // ---------- Finale ----------
  function showFinale() {
    quiz.hidden = true;
    finale.hidden = false;
    burst(70);
    setTimeout(function () { burst(40); }, 700);
    finale.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Accordion ----------
  accBtn.addEventListener("click", function () {
    var open = accBtn.getAttribute("aria-expanded") === "true";
    accBtn.setAttribute("aria-expanded", open ? "false" : "true");
    accPanel.classList.toggle("open", !open);
  });

  // ---------- Confetti leggeri (poi si rimuovono da soli) ----------
  var COLORS = ["#c1121f", "#0a1a5c", "#ffffff", "#f6e7c1"];
  function burst(n) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < n; i++) {
      var el = document.createElement("i");
      var isStar = Math.random() < 0.3;
      if (isStar) {
        el.className = "star";
        el.textContent = "★";
        el.style.color = Math.random() < 0.5 ? "#c1121f" : "#0a1a5c";
      } else {
        el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.border = "1px solid rgba(10,26,92,.35)";
      }
      el.style.left = Math.random() * 100 + "vw";
      var dur = 1.8 + Math.random() * 1.6;
      el.style.animationDuration = dur + "s";
      el.style.animationDelay = Math.random() * 0.4 + "s";
      confettiBox.appendChild(el);
      (function (node, d) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, (d + 0.6) * 1000);
      })(el, dur);
    }
  }

  // Avvio
  showStep();
})();
