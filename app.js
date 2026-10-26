Oturum aç
Ücretsiz kaydol

    Şunu dedin:

    yaptığımız renk körü testini hatırılıyomusun
    ChatGPT:

    Şu an önceki yaptığımız renk körlüğü testinin detaylarını bu konuşmada göremiyorum, o yüzden tam olarak hatırlıyorum diyemem. 😅

    Ama istersen kaldığımız yerden devam edebiliriz!

    Bana küçük bir ipucu ver: Ishihara testi gibi, içinde renkli noktalarla sayıların gizlendiği bir test mi yapmıştık, yoksa sana renkler gösterip hangisi olduğunu mu sormuştum? 🎨
    Şunu dedin:

    sana sıra sıra kodları atayım
    ChatGPT:

    Tamamdır 😄🎨 Kodları bana sırayla at, ben de her birine tek tek bakayım.

    Hepsini gönderirken sırayı koruyalım. Sonunda birlikte değerlendirelim.

    İlk kodu gönder bakalım! 👀
    Şunu dedin:

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
    ChatGPT:

    Heh şimdi kodu görünce testin mantığını hatırladım! 😄🎨 Bu, renk körlüğünü taramak için hazırladığımız, rastgele renkli nokta plakaları oluşturan 10 aşamalı testin JavaScript kodu.

    Kodu inceledim. Önemli noktaları şöyle:

        🔴🟢 Kırmızı-yeşil paleti: Kırmızı ve yeşil tonları arasındaki farkları değerlendirmeyi amaçlıyor.

        🔵🟡 Mavi-sarı paleti: Mavi ve sarı tonları arasındaki farkları değerlendiriyor.

        ⚫⚪ Gri tonları: Renk doygunluğundan bağımsız sayı ve alan tanımayı karşılaştırıyor.

        👆 Dokunma aşamaları: Farklı renkteki alanı bulmanı istiyor.

        🔢 Sayı tanıma aşamaları: Renkli noktalarla oluşturulmuş gizli sayıyı bulmanı istiyor.

        📊 Sonuç ekranı: Genel başarı oranını ve paletlere göre doğru cevaplarını gösteriyor.
    Ama kodda önemli bir sorun var

    Bu testin sonuçları, tek başına renk körlüğün olup olmadığını güvenilir biçimde belirleyemez. Özellikle:

        Renkler rastgele seçiliyor; standart bir klinik renk körlüğü testi uygulanmıyor.

        Dokunma aşamasında farklı renkli alanın konumu rastgele belirleniyor. Ancak dokunma hedefinin doğru değerlendirilmesi, renk algısından çok alanı bulup bulamadığını da ölçüyor.

        Sayı aşamalarında sayı, renkli noktaların geometrik dizilimiyle oluşturuluyor. Bu nedenle sonuçlar standart Ishihara plakalarının yerine geçmiyor.

    Yani bu kod, renk algısı farklılıklarını keşfetmeye yönelik deneysel bir test olarak kullanılabilir; tıbbi tanı koyamaz.

    Şimdi diğer kodları da sırayla gönder. Hepsini birlikte inceleyelim; özellikle HTML ve CSS kodlarını da görürsem testin görsel sunumunu ve çalışma mantığını daha doğru değerlendirebilirim. 👀
    Bu da ilgini çekebilir.
    Mixdive
    Your data stays yours
    Track product usage on your own servers
    Reklam
    Şunu dedin:

    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
      <meta name="theme-color" content="#101827">
      <meta name="description" content="Dinamik renk görme ön tarama uygulaması.">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
      <meta name="color-scheme" content="light">
      <title>Renk Körlüğü Testi</title>

      <link rel="manifest" href="./manifest.json">
      <link rel="stylesheet" href="./style.css">
      <meta name="color-scheme" content="light">
    </head>
    <body>
      <main class="app">
        <header class="topbar">
          <div class="brand">RENK TESTİ</div>
          <div class="top-caption">10 AŞAMALI ÖN TARAMA</div>
        </header>

        <section id="welcome" class="panel">
          <p class="eyebrow">RENK GÖRME DEĞERLENDİRMESİ</p>
          <h1>Renkleri nasıl görüyorsun?</h1>
          <p class="muted">
            Farklı renklerde oluşturulan nokta plakalarıyla 10 aşamalı
            bir ön tarama gerçekleştir.
          </p>

          <div class="info-grid">
            <div class="info-card">
              <strong>10</strong>
              <span>Aşama</span>
            </div>
            <div class="info-card">
              <strong>5 + 5</strong>
              <span>İki soru türü</span>
            </div>
            <div class="info-card">
              <strong>Ücretsiz</strong>
              <span>Çevrimdışı kullanım</span>
            </div>
          </div>

          <div class="notice">
            Bu uygulama tıbbi tanı koymaz. Ekran özellikleri, parlaklık
            ve görüntüleme koşulları sonucu etkileyebilir.
          </div>

          <button id="startBtn" class="primary-btn">
            Teste Başla
          </button>
        </section>

        <section id="testScreen" class="panel hidden">
          <div class="progress-heading">
            <span id="stageLabel">Aşama 1 / 10</span>
            <span id="progressPercent">10%</span>
          </div>

          <div
            class="progress-track"
            role="progressbar"
            aria-label="Test ilerlemesi"
            aria-valuemin="0"
            aria-valuemax="10"
            aria-valuenow="0"
            id="progressTrack"
          >
            <div id="progressBar" class="progress-bar"></div>
          </div>

          <p id="questionType" class="eyebrow"></p>
          <h2 id="questionTitle">Plakayı incele</h2>
          <p id="questionDescription" class="muted"></p>

          <div id="plateFrame" class="plate-frame">
            <div id="plate" aria-label="Dinamik renkli nokta plakası"></div>
          </div>

          <div id="tapArea" class="answer-area hidden">
            <p class="instruction">Farklı renkteki alanın üzerine dokun.</p>
          </div>

          <form id="numberForm" class="answer-area hidden">
            <label for="numberInput">Gördüğün sayıyı yaz (1–99)</label>
            <input
              id="numberInput"
              type="number"
              inputmode="numeric"
              min="1"
              max="99"
              step="1"
              autocomplete="off"
              placeholder="Örn. 42"
              required
            >
            <button type="submit" class="primary-btn">Cevabı Gönder</button>
          </form>

          <p id="feedback" class="feedback" aria-live="polite"></p>

          <button id="nextBtn" class="primary-btn hidden">
            Sonraki Aşama
          </button>

          <button id="quitBtn" class="text-btn" type="button">
            Testi Bitir
          </button>
        </section>

        <section id="resultScreen" class="panel hidden">
          <p class="eyebrow">TEST TAMAMLANDI</p>
          <h1>Sonuçların</h1>

          <div class="score-card">
            <span class="muted">Genel başarı</span>
            <strong id="scoreText">0%</strong>
            <div class="progress-track">
              <div id="scoreBar" class="progress-bar"></div>
            </div>
            <p id="scoreSummary" class="muted"></p>
          </div>

          <h2>Hata metrikleri</h2>
          <div id="metricList" class="metric-list"></div>

          <h2>Renk grubu değerlendirmesi</h2>
          <div id="typeResults" class="metric-list"></div>

          <div class="notice">
            <strong>Tıbbi uyarı:</strong> Bu kısa, rastgele oluşturulmuş
            tarama testi doğrulanmış bir Ishihara veya klinik renk görme
            testi değildir. Sonuçlar tanı veya hastalık olasılığına ilişkin
            doğrulanmış bir ölçüm olarak yorumlanmamalıdır. Şüphe varsa
            göz hekimine başvur.
          </div>

          <button id="restartBtn" class="primary-btn">
            Yeni Test Başlat
          </button>
        </section>

        <footer class="footer">
          <p>Renk Körlüğü Testi</p>
          <p>Bilgilendirme ve ön tarama amacıyla hazırlanmıştır.</p>
        </footer>
      </main>

      <script src="./app.js" defer></script>
    </body>
    </html>
    ChatGPT:

    Tamam, HTML kodunu da aldım. 👌 Şimdi elimizde testin hem JavaScript tarafı (app.js) hem de HTML arayüzü (index.html) var.

    HTML tarafında dikkatimi çekenler:

        10 aşamalı test: Karşılama, test ve sonuç ekranları ayrı ayrı hazırlanmış.

        İki soru türü: Renkli alanı dokunarak bulma ve gizli sayıyı yazma.

        Sonuç ekranı: Genel başarı yüzdesi ve renk gruplarına göre performans gösteriliyor.

        Mobil uyumluluk: Telefon ekranları ve çevrimdışı kullanım düşünülmüş.

        Tıbbi uyarılar: Uygulamanın tanı koymadığı açıkça belirtilmiş; bu iyi bir yaklaşım.
    Şimdiden gördüğüm iki önemli ayrıntı

        HTML'de başlangıçta ilerleme yüzdesi 0% olması gerekirken app.js ilk soruda 0% gösteriyor; bu kısım tutarlı.

        HTML'deki 5 + 5 soru dağılımı da JavaScript ile uyumlu: 10 sorunun 5'i dokunma, 5'i sayı tanıma aşaması.

    Ancak asıl önemli konu, renk körlüğünü ölçme doğruluğu. Bunu değerlendirmek için renk plakalarının nasıl üretildiğini zaten gördüm; şimdi görsel tasarımı da incelememiz gerekiyor.

    Sıradaki kod olarak style.css dosyasını gönder. Onu da inceledikten sonra üç dosyayı birlikte değerlendirip nelerin iyi çalıştığını, hangi hataların sonuçları etkileyebileceğini ve testi nasıl geliştirebileceğimizi söyleyeyim.
    Şunu dedin:

    {
      "id": "./",
      "name": "Renk Körlüğü Testi",
      "short_name": "Renk Testi",
      "description": "Dinamik renk görme ön tarama uygulaması",
      "lang": "tr",
      "start_url": "./",
      "scope": "./",
      "display": "standalone",
      "orientation": "portrait",
      "background_color": "#101827",
      "theme_color": "#101827"
    }
    ChatGPT:

    Süper, bu da manifest.json dosyamız. 📱 Şimdi uygulamanın telefona yüklenebilir bir web uygulaması (PWA) olarak tasarlandığını da görüyoruz.
    Bu dosya ne işe yarıyor?

        name ve short_name: Uygulamanın adı ve telefondaki kısa adı.

        display: standalone: Desteklenen cihazlarda tarayıcı çubuğu olmadan açılmasını sağlar.

        orientation: portrait: Uygulamanın dikey kullanımını tercih eder.

        start_url ve scope: Uygulamanın açılış adresini ve kapsadığı yolu belirler.

        theme_color ve background_color: Uygulama arayüzü ve açılış ekranı için renkler tanımlar.
    Şu ana kadarki dosyalarımız

        app.js — Test sorularını oluşturuyor, cevapları kontrol ediyor ve sonuçları hesaplıyor.

        index.html — Testin ekranlarını ve kullanıcı arayüzünü oluşturuyor.

        manifest.json — Uygulamanın telefona kurulabilmesini destekliyor.

    Bir dosya daha gönderirsen hepsini birlikte inceleyebiliriz. Özellikle style.css ve varsa sw.js dosyaları önemli.

    Bir noktayı da aklımızda tutalım: Uygulamanın teknik olarak düzgün çalışması ile renk körlüğünü klinik olarak doğru ölçmesi farklı şeyler. İkisini ayrı ayrı değerlendireceğiz. 🔍
    Şunu dedin:

    :root {
      color-scheme: only light;

      --bg: #f4f6fa;
      --panel: #ffffff;
      --panel-light: #edf1f7;
      --text: #172033;
      --muted: #536176;
      --accent: #087f68;
      --border: #d5dce7;
      --danger: #b42318;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      min-height: 100%;
      background: var(--bg);
      overscroll-behavior: none;
      color-scheme: only light;
    }

    body {
      margin: 0;
      min-height: 100vh;
      min-height: 100dvh;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      overscroll-behavior: none;
      -webkit-text-size-adjust: 100%;
      touch-action: pan-y;
    }

    button,
    input {
      font: inherit;
    }

    button {
      touch-action: manipulation;
    }

    .app {
      width: min(100%, 640px);
      min-height: 100vh;
      min-height: 100dvh;
      margin: 0 auto;
      padding:
        max(18px, env(safe-area-inset-top))
        18px
        max(22px, env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
    }

    .topbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .brand {
      font-size: 14px;
      font-weight: 850;
      letter-spacing: 2px;
    }

    .top-caption,
    .eyebrow {
      color: var(--accent);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.4px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: clamp(18px, 5vw, 30px);
      box-shadow: 0 12px 36px rgba(20, 35, 55, 0.07);
    }

    .hidden {
      display: none !important;
    }

    h1 {
      margin: 12px 0;
      font-size: clamp(27px, 7vw, 39px);
      line-height: 1.12;
      letter-spacing: -1px;
    }

    h2 {
      margin: 18px 0 10px;
      font-size: 21px;
    }

    p {
      line-height: 1.65;
    }

    .muted {
      color: var(--muted);
      font-size: 14px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
      margin: 24px 0;
    }

    .info-card {
      min-width: 0;
      padding: 14px 8px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--panel-light);
      text-align: center;
    }

    .info-card strong,
    .info-card span {
      display: block;
    }

    .info-card strong {
      font-size: clamp(13px, 3.5vw, 18px);
      overflow-wrap: anywhere;
    }

    .info-card span {
      margin-top: 5px;
      color: var(--muted);
      font-size: 11px;
    }

    .notice {
      margin: 20px 0;
      padding: 14px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: #f6f8fb;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.7;
    }

    .primary-btn {
      width: 100%;
      min-height: 52px;
      padding: 14px 18px;
      border: 0;
      border-radius: 14px;
      background: var(--accent);
      color: #ffffff;
      font-weight: 800;
      cursor: pointer;
    }

    .primary-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .text-btn {
      display: block;
      width: 100%;
      margin-top: 10px;
      padding: 12px;
      border: 0;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
    }

    .progress-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 12px;
      font-weight: 750;
    }

    .progress-track {
      width: 100%;
      height: 8px;
      margin: 12px 0 22px;
      overflow: hidden;
      border-radius: 99px;
      background: #e0e5ed;
    }

    .progress-bar {
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
      transition: width 220ms ease;
    }

    .plate-frame {
      display: grid;
      place-items: center;
      width: 100%;
      margin: 18px 0;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: #ffffff;
      padding: 10px;
    }

    #plate {
      width: 100%;
      max-width: 390px;
      aspect-ratio: 1;
      display: grid;
      place-items: center;
    }

    #plate svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: 70vh;
      color-scheme: only light;
      forced-color-adjust: none;
      user-select: none;
      -webkit-user-select: none;
    }

    .answer-area {
      margin-top: 20px;
    }

    .instruction {
      color: var(--muted);
      font-size: 14px;
      text-align: center;
    }

    #numberForm label {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
    }

    #numberInput {
      width: 100%;
      min-height: 54px;
      margin-bottom: 12px;
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 14px;
      outline: none;
      background: #ffffff;
      color: var(--text);
      font-size: 20px;
    }

    #numberInput:focus {
      border-color: var(--accent);
    }

    .feedback {
      min-height: 24px;
      color: var(--muted);
      font-size: 13px;
    }

    .score-card {
      padding: 20px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--panel-light);
    }

    .score-card strong {
      display: block;
      margin: 10px 0;
      font-size: 44px;
    }

    .metric {
      padding: 16px;
      margin: 10px 0;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--panel-light);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
      font-weight: 750;
    }

    .metric p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 12px;
    }

    .metric .progress-track {
      margin: 10px 0 0;
    }

    .footer {
      margin-top: auto;
      padding: 24px 4px 0;
      text-align: center;
      color: var(--muted);
      font-size: 11px;
    }

    .footer p {
      margin: 4px 0;
    }

    @media (max-width: 360px) {
      .app {
        padding-left: 12px;
        padding-right: 12px;
      }

      .panel {
        padding: 16px;
        border-radius: 18px;
      }

      .info-grid {
        gap: 5px;
      }

      .info-card {
        padding: 12px 4px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        /* Telefonun koyu tema zorlamasını engelle */
    :root {
      color-scheme: light only !important;
      forced-color-adjust: none;
    }

    html,
    body {
      background: #f4f6fa !important;
      color: #172033 !important;
      color-scheme: light only !important;
      forced-color-adjust: none;
    }

    .panel {
      background: #ffffff !important;
      color: #172033 !important;
    }

    .info-card,
    .metric,
    .score-card {
      background: #edf1f7 !important;
      color: #172033 !important;
    }

    .notice {
      background: #f6f8fb !important;
      color: #536176 !important;
    }

    #numberInput {
      background: #ffffff !important;
      color: #172033 !important;
      color-scheme: light only !important;
    }

    #plate,
    .plate-frame {
      background: #ffffff !important;
      color-scheme: light only !important;
      forced-color-adjust: none !important;
    }

    #plate svg,
    #plate svg * {
      forced-color-adjust: none !important;
    }

    .primary-btn {
      background: #087f68 !important;
      color: #ffffff !important;
    }
      }
    }
    ChatGPT:

    Tamam, şimdi style.css dosyasını da aldım. 👀 Üç ana dosyanın mantığını birlikte değerlendirebiliyoruz.

    CSS tasarımın genel olarak güzel düşünülmüş: mobil uyumluluk, büyük dokunma alanları, okunabilir yazılar ve beyaz zemin üzerinde renk plakaları var. Ancak CSS dosyasında önemli bir sözdizimi hatası görüyorum.
    🔴 1. CSS dosyasının sonunda hata var

    Şu bölümde:
    css

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;

        /* Telefonun koyu tema zorlamasını engelle */
        :root {
          color-scheme: light only !important;

    @media bloğunun içinde bir CSS kuralı henüz kapanmadan yeni seçiciler başlıyor. Bu, geçersiz CSS oluşturuyor ve sonraki kuralların bir bölümünün tarayıcı tarafından uygulanmamasına yol açabilir.

    Çözüm: Hareket azaltma ayarını kapatıp koyu tema engelleme kurallarını bu bloğun dışına çıkarmalısın.
    🟡 2. Renk körlüğü testi açısından asıl sorun

    CSS'nin renkleri sabitlemesi, telefonun koyu tema dönüşümünü önlemeye yardımcı olabilir. Fakat ekran parlaklığı, renk profili, ekranın kalibrasyonu ve kullanıcının görüntüleme koşulları yine sonucu etkileyebilir.

    Ayrıca app.js içindeki test, standart Ishihara plakaları yerine rastgele renkli noktalar oluşturuyor. Bu yüzden sonuç yüzdesini renk körlüğünün derecesi olarak yorumlayamayız.
    Şimdiye kadar gördüğüm dosyalar

        app.js: Soruların oluşturulması ve puanlama.

        index.html: Test ekranları.

        manifest.json: Telefona yüklenebilir uygulama ayarları.

        style.css: Görünüm ve mobil uyumluluk.

    Bir şey daha sorayım: Testi şu anda çalıştırırken bir hata mı alıyorsun, yoksa asıl amacın testin renk körlüğünü mümkün olduğunca doğru tespit etmesini sağlamak mı? Buna göre bir sonraki adımı belirleyebiliriz.
    Bu da ilgini çekebilir.
    Mixdive
    Your data stays yours
    Track product usage on your own servers
    Reklam
    Şunu dedin:

    "use strict";

    const CACHE_NAME = "renk-testi-v4";

    const APP_FILES = [
      "./",
      "./index.html",
      "./style.css",
      "./app.js",
      "./manifest.json"
    ];

    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => cache.addAll(APP_FILES))
          .then(() => self.skipWaiting())
      );
    });

    self.addEventListener("activate", (event) => {
      event.waitUntil(
        caches.keys()
          .then((keys) => Promise.all(
            keys
              .filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
          ))
          .then(() => self.clients.claim())
      );
    });

    self.addEventListener("fetch", (event) => {
      const request = event.request;

      if (
        request.method !== "GET" ||
        new URL(request.url).origin !== self.location.origin
      ) {
        return;
      }

      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (
              response &&
              response.ok &&
              response.type === "basic"
            ) {
              const copy = response.clone();

              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, copy);
              });
            }

            return response;
          }).catch(() => {
            if (request.mode === "navigate") {
              return caches.match("./index.html");
            }

            return new Response("Çevrimdışı içerik bulunamadı.", {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            });
          });
        })
      );
    });
    ChatGPT:

    Harika, sw.js dosyasını da aldım! 🔧 Artık uygulamanın çevrimdışı çalışma mekanizmasını da inceleyebiliyoruz.
    sw.js değerlendirmesi

    Bu dosya, uygulamanın Service Worker'ı. Temel işlevleri doğru düşünülmüş:

        Önbelleğe alma: HTML, CSS, JavaScript ve manifest dosyalarını yükleme sırasında önbelleğe alıyor.

        Çevrimdışı açılış: İnternet yoksa kayıtlı index.html dosyasını göstermeyi deniyor.

        Eski önbelleği temizleme: renk-testi-v4 dışındaki önbellekleri siliyor.

        Güncelleme: Yeni Service Worker etkinleşince eski sürümün yerine geçiyor.
    Dikkat edilmesi gereken noktalar

        cache.addAll(APP_FILES) dosyalardan biri yüklenemezse kurulum başarısız olabilir.

        Çevrimdışı kullanım için uygulamanın HTTPS üzerinden veya yerel geliştirme ortamında çalıştırılması gerekir; dosyayı doğrudan açmak yeterli değildir.

        app.js içindeki sorular her yeni testte rastgele üretildiğinden, testin kendisi çevrimdışı çalışabilir. Ancak sonuçlar kalıcı olarak kaydedilmiyor; sayfa yenilenirse mevcut test yanıtları kaybolur.
    Şimdi tüm uygulamayla ilgili genel değerlendirmem

    Kodları birlikte incelediğimizde uygulamanın teknik yapısı oldukça anlaşılır. Fakat iki ayrı konuyu birbirinden ayırmamız gerekiyor:

        Uygulamanın çalışması: Arayüz, soru oluşturma, puanlama ve çevrimdışı açılış.

        Renk körlüğünü doğru değerlendirmesi: Bunun için standartlaştırılmış, uygun biçimde doğrulanmış test plakaları ve kontrollü uygulama koşulları gerekir.

    Mevcut sürümdeki en önemli geliştirme alanı ikinci konu. Rastgele renkli noktalarla elde edilen başarı yüzdesi, tek başına renk körlüğü tanısı veya türü belirleyemez.

    Şimdi asıl hedefini netleştirelim: İstersen önce CSS hatasını ve teknik sorunları düzeltebiliriz; istersen doğrudan testin renk algısı farklılıklarını daha anlamlı değerlendirmesi için tasarımını yeniden ele alabiliriz.
    Şunu dedin:

    kanka hoca dediki test baya kolay bu testi bviraz zorlaştırman lazım yani renkler falan çok ayırt edici oluyor ayırt edici olmasın pek zor olsun yani
    ChatGPT:

    Kanka anladım 😄 Hocan testin kolay olduğunu söylediyse bence sadece renkleri biraz koyulaştırmakla kalmayalım; renkler arasındaki farkı azaltıp testi gerçekten daha zor hâle getirelim.

    Senin mevcut kodunda renkler çok belirgin:

        Kırmızı: #FF3B30

        Yeşil: #00E676

        Mavi: #1769FF

        Sarı: #FFEA00

    Bunlar oldukça canlı ve birbirinden kolay ayırt edilebilen renkler. Ayrıca dokunma aşamasında farklı alanın çok sayıda noktayla oluşturulması da alanı bulmayı kolaylaştırabiliyor.
    Nasıl zorlaştıracağız?

        Renkleri birbirine yaklaştıracağız: Özellikle kırmızı-yeşil ve mavi-sarı paletlerinde.

        Noktaları birbirine benzetip yoğunlaştıracağız: Hedef alanın sınırları daha az belirgin olacak.

        Hedef alanı küçülteceğiz: Dokunma aşamaları daha dikkatli inceleme gerektirecek.

        Sayıları daha zor algılanır hâle getireceğiz: Sayıların oluşturulduğu noktalar arka plan noktalarına daha yakın renklerde olacak.

        Rastgeleliği koruyacağız: Her testte aynı sorular çıkmayacak.

    Bir önemli ayrıntı: Renkleri yakınlaştırmak testi zorlaştırır ama tek başına bilimsel olarak daha doğru bir renk körlüğü testi yapmaz. Bu nedenle uygulamayı bir deneysel renk algısı testi olarak tanımlamaya devam edelim.
    1. app.js içindeki renk paletlerini değiştir

    Mevcut PALETTES bölümünü aşağıdakiyle değiştir. Renkler daha az doygun ve birbirine daha yakın olacak.
    javascript

    const PALETTES = {
      redGreen: {
        name: "Kırmızı-yeşil renk grubu",
        background: [
          "#A87C72", "#A47A70", "#AA8074",
          "#A57973", "#A98278"
        ],
        foreground: [
          "#98966C", "#939268", "#9B986F",
          "#95936B", "#9A9770"
        ],
        target: [
          "#98966C", "#939268", "#9B986F", "#95936B"
        ]
      },

      blueYellow: {
        name: "Mavi-sarı renk grubu",
        background: [
          "#788BA3", "#7B8DA5", "#7588A0",
          "#7D8FA6", "#7689A2"
        ],
        foreground: [
          "#A99B72", "#A4966E", "#AA9C75",
          "#A69770", "#A89A73"
        ],
        target: [
          "#A99B72", "#A4966E", "#AA9C75", "#A69770"
        ]
      },

      achromatic: {
        name: "Gri tonları grubu",
        background: [
          "#BDBDBD", "#B8B8B8", "#C1C1C1",
          "#BABABA", "#BEBEBE"
        ],
        foreground: [
          "#858585", "#898989", "#828282",
          "#888888", "#848484"
        ],
        target: [
          "#858585", "#898989", "#828282"
        ]
      }
    };

    2. Dokunma aşamasını zorlaştır

    makeQuestions() fonksiyonunun içindeki şu satırı bul:
    javascript

    r: randInt(36, 53),

    Şununla değiştir:
    javascript

    r: randInt(24, 34),

    Böylece hedef alan küçülür. Ancak çok küçültürsen test renk algısından ziyade dokunma hassasiyetini ölçmeye başlayabilir.

    Ardından generatePlate() fonksiyonunda dokunma aşaması için şu satırı bul:
    javascript

    for (let i = 0; i < 190; i++) {

    Bunu şöyle değiştir:
    javascript

    for (let i = 0; i < 125; i++) {

    Bu, hedef alanın içindeki farklı renk
    Şunu dedin:

    sen kodu bana değişiklik i
    ChatGPT:
    26s düşündü

    Tabii kanka 😎 Kodunu hocanın istediği gibi zorlaştıralım. Şu an kırmızı ile yeşil ve mavi ile sarı çok doygun ve birbirinden uzak olduğu için kolay ayırt ediliyor.

    Önce app.js dosyasında değişiklik yapalım. Mevcut const PALETTES = { ... }; bölümünü tamamen silip aşağıdakiyle değiştir.
    javascript


    const PALETTES = {
      redGreen: {
        name: "Kırmızı-yeşil renk grubu",
        background: [
          "#C96B52", "#C16A50", "#D07659",
          "#B9614F", "#CA755C", "#BE6856",
          "#CC7055"
        ],
        foreground: [
          "#A58D50", "#AA9255", "#9F894C",
          "#B09A5C", "#A18B51", "#AD9556"
        ],
        target: [
          "#A58D50", "#AA9255", "#9F894C",
          "#B09A5C", "#A18B51"
        ]
      },

      blueYellow: {
        name: "Mavi-sarı renk grubu",
        background: [
          "#527FA3", "#5A83A2", "#58799A",
          "#4E789C", "#6185A1", "#557B97",
          "#5C809F"
        ],
        foreground: [
          "#B3A66B", "#B9AA70", "#AEA168",
          "#B6A66D", "#AA9B63", "#B5A36A"
        ],
        target: [
          "#B3A66B", "#B9AA70", "#AEA168",
          "#B6A66D", "#AA9B63"
        ]
      },

      achromatic: {
        name: "Renk doygunluğu grubu",
        background: [
          "#A5A5A5", "#AAAAAA", "#A0A0A0",
          "#ADADAD", "#A3A3A3", "#A8A8A8"
        ],
        foreground: [
          "#777777", "#707070", "#7D7D7D",
          "#747474", "#808080"
        ],
        target: [
          "#777777", "#707070", "#7D7D7D"
        ]
      }
    };

    Biraz daha zorlaştırmak için

    Şu iki küçük değişikliği de yapabilirsin.

    1. Arka plan noktalarını artır.

    generatePlate() fonksiyonunda şu satırı bul:
    javascript

    for (let i = 0; i < 540; i++) {

    Şöyle değiştir:
    javascript

    for (let i = 0; i < 750; i++) {

    2. Farklı alanın noktalarını biraz azalt.

    Aynı fonksiyondaki şu satırı bul:
    javascript

    for (let i = 0; i < 190; i++) {

    Şöyle değiştir:
    javascript

    for (let i = 0; i < 145; i++) {

    Böylece plakalar daha yoğun ve farklı alanı bulmak daha zor olur.
    Önemli bir ayrıntı

    Bu değişiklikler testi görsel olarak zorlaştırır; ancak ortaya çıkan renk paletleri doğrulanmış bir renk körlüğü testi oluşturmaz. Özellikle gri tonlu aşama renk körlüğünü ölçmekten ziyade genel görsel ayırt etmeyi kontrol eder.

    Kanka, önce bu sürümü dene. Normal renk görüşüne sahip birinin de bazı sorularda zorlanıp zorlanmadığını kontrol et. Amaç yalnızca herkesi zorlamak değil, renkleri ayırt etme becerisini daha anlamlı biçimde değerlendirmek.
    Şunu dedin:

    bana kodları düzlenle ver beni uğraştırma komple ver bana
    ChatGPT:

    Kanka tamam 😎 Seni tek tek kod aramakla uğraştırmıyorum. Aşağıya değiştirilmiş app.js dosyasının tamamını bırakıyorum. Eski dosyanın içini tamamen silip bunu yapıştırman yeterli.

    Bu sürümde renkler birbirine daha yakın, noktalar daha yoğun ve hedef alanlar daha küçük. Ayrıca testin sonuçlarının tıbbi tanı olmadığı uyarısı korunuyor.
    javascript


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

      // Birbirine daha yakın tonlardan oluşan deneysel paletler.
      const PALETTES = {
        redGreen: {
          name: "Kırmızı-yeşil renk grubu",
          background: [
            "#C96B52", "#C16A50", "#D07659",
            "#B9614F", "#CA755C", "#BE6856",
            "#CC7055", "#C5705B", "#BD6654"
          ],
          foreground: [
            "#A58D50", "#AA9255", "#9F894C",
            "#B09A5C", "#A18B51", "#AD9556"
          ],
          target: [
            "#A58D50", "#AA9255", "#9F894C",
            "#B09A5C", "#A18B51"
          ]
        },

        blueYellow: {
          name: "Mavi-sarı renk grubu",
          background: [
            "#527FA3", "#5A83A2", "#58799A",
            "#4E789C", "#6185A1", "#557B97",
            "#5C809F", "#557D9B", "#5A809C"
          ],
          foreground: [
            "#B3A66B", "#B9AA70", "#AEA168",
            "#B6A66D", "#AA9B63", "#B5A36A"
          ],
          target: [
            "#B3A66B", "#B9AA70", "#AEA168",
            "#B6A66D", "#AA9B63"
          ]
        },

        achromatic: {
          name: "Gri tonları",
          background: [
            "#A5A5A5", "#AAAAAA", "#A0A0A0",
            "#ADADAD", "#A3A3A3", "#A8A8A8"
          ],
          foreground: [
            "#777777", "#707070", "#7D7D7D",
            "#747474", "#808080"
          ],
          target: [
            "#777777", "#707070", "#7D7D7D"
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
            x: randInt(125, 275),
            y: randInt(125, 275),
            r: randInt(25, 38),
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

        // Daha yoğun arka plan.
        for (let i = 0; i < 750; i++) {
          const point = randomPointInPlate();

          dots.push(createDot(
            point.x,
            point.y,
            pick(palette.background),
            rand(3.5, 7),
            `opacity="${rand(0.92, 1).toFixed(2)}"`
          ));
        }

        if (question.mode === "tap") {
          // Küçültülmüş farklı alan.
          for (let i = 0; i < 145; i++) {
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
              rand(3.2, 6)
            ));
          }
        } else {
          // Sayılar renkli noktalarla oluşturulur.
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
                    rand(2.5, 4.5)
                  ));
                }
              }
            });
          });
        }

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

            <circle cx="200" cy="200" r="182" fill="#FFFFFF"/>

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
            "Farklı alanı bulma performansı."
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
          achromatic: "Gri tonları"
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
              "Bu paletle oluşturulan soruların özeti. Klinik tanı değildir."
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

      document.addEventListener("touchmove", (event) => {
        if (event.touches && event.touches.length > 1) {
          event.preventDefault();
        }
      }, { passive: false });

      document.addEventListener("gesturestart", (event) => {
        event.preventDefault();
      }, { passive: false });

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
