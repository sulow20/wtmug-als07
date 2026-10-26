"use strict";

(() => {
  const $ = (id) => document.getElementById(id);

  const screens = {
    welcome: $("welcome"),
    test: $("testScreen"),
    result: $("resultScreen")
  };

  const state = {
    questions: [],
    index: 0,
    answers: [],
    locked: false,
    current: null
  };

  // Canlı ve doygun renkler.
  const PALETTES = {
    redGreen: {
      name: "Kırmızı-yeşil renk grubu",
      background: [
        "#FF3B30", "#FF5A36", "#E92F48",
        "#FF7043", "#F44336"
      ],
      foreground: [
        "#00E676", "#39FF14", "#00C853",
        "#76FF03", "#00FF87"
      ],
      target: [
        "#00E676", "#39FF14", "#00C853", "#76FF03"
      ]
    },

    blueYellow: {
      name: "Mavi-sarı renk grubu",
      background: [
        "#1769FF", "#2979FF", "#448AFF",
        "#0057FF", "#304FFE"
      ],
      foreground: [
        "#FFEA00", "#FFD600", "#FFAB00",
        "#FFFF00", "#FFC400"
      ],
      target: [
        "#FFEA00", "#FFD600", "#FFAB00", "#FFFF00"
      ]
    },

    achromatic: {
      name: "Renk doygunluğu grubu",
      background: [
        "#FFFFFF", "#E0E0E0", "#BDBDBD",
        "#F5F5F5", "#D6D6D6"
      ],
      foreground: [
        "#212121", "#424242", "#616161",
        "#303030", "#000000"
      ],
      target: [
        "#212121", "#424242", "#303030"
      ]
    }
  };

  const rand = (min, max) =>
    Math.random() * (max - min) + min;

  const randInt = (min, max) =>
    Math.floor(rand(min, max + 1));

  const pick = (items) =>
    items[randInt(0, items.length - 1)];

  function shuffle(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function showScreen(name) {
    Object.values(screens).forEach((screen) => {
      screen.classList.add("hidden");
    });

    screens[name].classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  function makeQuestions() {
    const palettes = shuffle([
      "redGreen", "redGreen", "redGreen", "redGreen",
      "blueYellow", "blueYellow", "blueYellow",
      "achromatic", "achromatic", "achromatic"
    ]);

    const modes = shuffle([
      "tap", "tap", "tap", "tap", "tap",
      "number", "number", "number", "number", "number"
    ]);

    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      mode: modes[index],
      palette: palettes[index],
      number: randInt(1, 99),
      target: {
        x: randInt(110, 290),
        y: randInt(110, 290),
        r: randInt(36, 53),
        shape: Math.random() < 0.5 ? "circle" : "square"
      }
    }));
  }

  function escapeXml(value) {
    return String(value).replace(/[<>&'"]/g, (char) => ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;"
    })[char]);
  }

  function distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  function insideTarget(x, y, target) {
    if (target.shape === "circle") {
      return distance(x, y, target.x, target.y) <= target.r;
    }

    return (
      Math.abs(x - target.x) <= target.r &&
      Math.abs(y - target.y) <= target.r
    );
  }

  function randomPointInPlate() {
    for (let tries = 0; tries < 100; tries++) {
      const x = rand(15, 385);
      const y = rand(15, 385);

      if (distance(x, y, 200, 200) < 180) {
        return { x, y };
      }
    }

    return { x: 200, y: 200 };
  }

  function createDot(x, y, color, radius, extra = "") {
    return `<circle
      cx="${x.toFixed(2)}"
      cy="${y.toFixed(2)}"
      r="${radius.toFixed(2)}"
      fill="${escapeXml(color)}"
      ${extra}
    />`;
  }

  function generatePlate(question) {
    const palette = PALETTES[question.palette];
    const target = question.target;
    const dots = [];

    // Beyaz plaka üzerinde canlı renkli arka plan noktaları.
    for (let i = 0; i < 540; i++) {
      const point = randomPointInPlate();

      dots.push(createDot(
        point.x,
        point.y,
        pick(palette.background),
        rand(3.5, 8),
        `opacity="${rand(0.9, 1).toFixed(2)}"`
      ));
    }

    if (question.mode === "tap") {
      // Dokunma sorusu için farklı renkte bir alan.
      for (let i = 0; i < 190; i++) {
        let x;
        let y;

        if (target.shape === "circle") {
          const angle = rand(0, Math.PI * 2);
          const radius = Math.sqrt(Math.random()) * target.r;

          x = target.x + Math.cos(angle) * radius;
          y = target.y + Math.sin(angle) * radius;
        } else {
          x = rand(target.x - target.r, target.x + target.r);
          y = rand(target.y - target.r, target.y + target.r);
        }

        dots.push(createDot(
          x,
          y,
          pick(palette.target),
          rand(3.5, 7.2)
        ));
      }
    } else {
      // Sayıyı SVG yazısı yerine renkli noktalardan oluştur.
      const digitSegments = {
        0: ["a", "b", "c", "d", "e", "f"],
        1: ["b", "c"],
        2: ["a", "b", "g", "e", "d"],
        3: ["a", "b", "g", "c", "d"],
        4: ["f", "g", "b", "c"],
        5: ["a", "f", "g", "c", "d"],
        6: ["a", "f", "g", "e", "c", "d"],
        7: ["a", "b", "c"],
        8: ["a", "b", "c", "d", "e", "f", "g"],
        9: ["a", "b", "c", "d", "f", "g"]
      };

      const segments = {
        a: [0, 0, 34, 0],
        b: [34, 0, 34, 40],
        c: [34, 40, 34, 80],
        d: [0, 80, 34, 80],
        e: [0, 40, 0, 80],
        f: [0, 0, 0, 40],
        g: [0, 40, 34, 40]
      };

      const text = String(question.number);
      const digitWidth = 34;
      const digitGap = 13;

      const totalWidth =
        text.length * digitWidth +
        (text.length - 1) * digitGap;

      const startX = 200 - totalWidth / 2;
      const startY = 160;

      [...text].forEach((character, digitIndex) => {
        const digit = Number(character);

        const offsetX =
          startX + digitIndex * (digitWidth + digitGap);

        digitSegments[digit].forEach((segmentName) => {
          const [x1, y1, x2, y2] = segments[segmentName];
          const length = distance(x1, y1, x2, y2);
          const steps = Math.max(1, Math.ceil(length / 7));

          for (let step = 0; step <= steps; step++) {
            const t = step / steps;

            const x =
              offsetX + x1 + (x2 - x1) * t + rand(-2, 2);

            const y =
              startY + y1 + (y2 - y1) * t + rand(-2, 2);

            for (let repeat = 0; repeat < 2; repeat++) {
              dots.push(createDot(
                x + rand(-2, 2),
                y + rand(-2, 2),
                pick(palette.foreground),
                rand(2.5, 5)
              ));
            }
          }
        });
      });
    }

    // Sabit beyaz zemin ve otomatik tema dönüşümüne karşı SVG ayarları.
    return `
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Dinamik renkli nokta plakası"
        style="color-scheme: only light; forced-color-adjust: none;"
      >
        <defs>
          <clipPath id="plateClip">
            <circle cx="200" cy="200" r="180"/>
          </clipPath>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="182"
          fill="#FFFFFF"
        />

        <g clip-path="url(#plateClip)">
          ${dots.join("")}
        </g>
      </svg>
    `;
  }

  function renderQuestion() {
    const question = state.questions[state.index];

    state.current = question;
    state.locked = false;

    $("stageLabel").textContent =
      `Aşama ${state.index + 1} / 10`;

    $("progressPercent").textContent =
      `${Math.round((state.index / 10) * 100)}%`;

    $("progressBar").style.width =
      `${(state.index / 10) * 100}%`;

    $("progressTrack").setAttribute(
      "aria-valuenow",
      String(state.index)
    );

    $("questionType").textContent =
      question.mode === "tap"
        ? "DOKUNMA AŞAMASI"
        : "SAYI TANIMA AŞAMASI";

    $("questionTitle").textContent =
      question.mode === "tap"
        ? "Farklı alanı bul"
        : "Gizli sayıyı bul";

    $("questionDescription").textContent =
      question.mode === "tap"
        ? "Nokta plakasında farklı renkte görünen alanın üzerine dokun."
        : "Noktaların arasına gizlenmiş sayıyı bul ve aşağıya yaz.";

    $("plate").innerHTML = generatePlate(question);

    $("tapArea").classList.toggle(
      "hidden",
      question.mode !== "tap"
    );

    $("numberForm").classList.toggle(
      "hidden",
      question.mode !== "number"
    );

    $("nextBtn").classList.add("hidden");
    $("feedback").textContent = "";
    $("numberInput").value = "";
    $("numberInput").disabled = false;

    if (question.mode === "number") {
      setTimeout(() => $("numberInput").focus(), 100);
    }
  }

  function recordAnswer(correct, response) {
    if (state.locked) return;

    state.locked = true;

    state.answers.push({
      questionId: state.current.id,
      mode: state.current.mode,
      palette: state.current.palette,
      correct,
      response,
      expected: state.current.mode === "number"
        ? state.current.number
        : "Farklı alan"
    });

    $("feedback").textContent = correct
      ? "Yanıt kaydedildi."
      : "Yanıt kaydedildi. Bu aşamada farklı bir yanıt verildi.";

    $("numberInput").disabled = true;

    $("nextBtn").textContent =
      state.index === 9
        ? "Sonuçları Gör"
        : "Sonraki Aşama";

    $("nextBtn").classList.remove("hidden");
  }

  function handlePlateClick(event) {
    if (
      state.locked ||
      !state.current ||
      state.current.mode !== "tap"
    ) {
      return;
    }

    const svg = $("plate").querySelector("svg");
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 400;
    const y = ((event.clientY - rect.top) / rect.height) * 400;

    const correct = insideTarget(
      x,
      y,
      state.current.target
    );

    recordAnswer(correct, {
      x: Math.round(x),
      y: Math.round(y)
    });
  }

  function handleNumberSubmit(event) {
    event.preventDefault();

    if (state.locked || state.current.mode !== "number") {
      return;
    }

    const raw = $("numberInput").value.trim();

    if (!/^\d{1,2}$/.test(raw)) {
      $("feedback").textContent =
        "Lütfen 1 ile 99 arasında bir tam sayı gir.";
      return;
    }

    const value = Number(raw);

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      $("feedback").textContent =
        "Geçerli aralık 1–99'dur.";
      return;
    }

    recordAnswer(value === state.current.number, value);
  }

  function metricCard(title, correct, total, description) {
    const percent = total
      ? Math.round((correct / total) * 100)
      : 0;

    return `
      <div class="metric">
        <div class="metric-header">
          <span>${title}</span>
          <span>${correct}/${total} doğru</span>
        </div>

        <div
          class="progress-track"
          role="progressbar"
          aria-label="${title}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percent}"
        >
          <div
            class="progress-bar"
            style="width:${percent}%"
          ></div>
        </div>

        <p>${description}</p>
      </div>
    `;
  }

  function finishTest() {
    const total = state.answers.length;
    const correct = state.answers.filter((a) => a.correct).length;
    const wrong = total - correct;

    const percent = total
      ? Math.round((correct / total) * 100)
      : 0;

    $("scoreText").textContent = `${percent}%`;
    $("scoreBar").style.width = `${percent}%`;

    $("scoreSummary").textContent =
      `${total} yanıt değerlendirildi; ${correct} doğru, ${wrong} hatalı yanıt.`;

    const tapAnswers = state.answers.filter(
      (a) => a.mode === "tap"
    );

    const numberAnswers = state.answers.filter(
      (a) => a.mode === "number"
    );

    $("metricList").innerHTML =
      metricCard(
        "Tüm aşamalar",
        correct,
        total,
        "Toplam doğru yanıt sayısı."
      ) +
      metricCard(
        "Dokunma aşamaları",
        tapAnswers.filter((a) => a.correct).length,
        tapAnswers.length,
        "Farklı renkli alanı bulma performansı."
      ) +
      metricCard(
        "Sayı tanıma aşamaları",
        numberAnswers.filter((a) => a.correct).length,
        numberAnswers.length,
        "Noktalı yapıdaki sayıyı tanıma performansı."
      );

    const labels = {
      redGreen: "Kırmızı-yeşil paleti",
      blueYellow: "Mavi-sarı paleti",
      achromatic: "Renk doygunluğu paleti"
    };

    $("typeResults").innerHTML =
      Object.keys(PALETTES).map((key) => {
        const group = state.answers.filter(
          (a) => a.palette === key
        );

        const groupCorrect = group.filter(
          (a) => a.correct
        ).length;

        return metricCard(
          labels[key],
          groupCorrect,
          group.length,
          "Bu paletle oluşturulan soruların özeti. Tek başına klinik tanı anlamına gelmez."
        );
      }).join("");

    showScreen("result");
  }

  function startTest() {
    state.questions = makeQuestions();
    state.index = 0;
    state.answers = [];
    state.locked = false;
    state.current = null;

    showScreen("test");
    renderQuestion();
  }

  $("startBtn").addEventListener("click", startTest);

  $("plate").addEventListener("click", handlePlateClick);

  $("numberForm").addEventListener(
    "submit",
    handleNumberSubmit
  );

  $("nextBtn").addEventListener("click", () => {
    if (!state.locked) return;

    state.index++;

    if (state.index >= 10) {
      finishTest();
    } else {
      renderQuestion();
    }
  });

  $("quitBtn").addEventListener("click", () => {
    if (state.answers.length === 0) {
      showScreen("welcome");
      return;
    }

    finishTest();
  });

  $("restartBtn").addEventListener("click", startTest);

  // Çoklu dokunmayla yakınlaştırmayı sınırlama.
  document.addEventListener("touchmove", (event) => {
    if (event.touches && event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener("gesturestart", (event) => {
    event.preventDefault();
  }, { passive: false });

  // Çevrimdışı PWA desteği.
  if (
    "serviceWorker" in navigator &&
    location.protocol !== "file:"
  ) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js")
        .catch((error) => {
          console.error(
            "Service Worker kaydedilemedi:",
            error
          );
        });
    });
  }
})();
