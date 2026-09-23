/* =========================================================
   Data Lab
   1. Charge les CSV de data/aviation/
   2. Explorateur de fichiers (aperçu + téléchargement)
   3. Tableau de bord Chart.js filtrable par compagnie
   4. Notebook Python/SQL exécuté dans le navigateur (Pyodide)
   ========================================================= */
(function () {
  const DATA_DIR = "data/aviation/";
  const FILES = [
    { name: "fact_flights.csv", label: "Vols (table de faits)" },
    { name: "dim_airports.csv", label: "Aéroports" },
    { name: "dim_airlines.csv", label: "Compagnies" },
    { name: "dim_aircraft.csv", label: "Appareils" },
  ];
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  const ON_TIME = "À l'heure";
  const COLORS = { teal: "#3e6f66", coral: "#e6674b", yellow: "#eac54f", ink: "#16303f", muted: "#5b6a72", line: "#ece8de" };
  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  const state = { raw: {}, tables: {}, charts: {}, pyodide: null, pyLoading: null };
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat("fr-CA");
  const dec = (v) => v.toFixed(1).replace(".", ",");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------------------------------------- 1. Chargement */
  async function loadAll() {
    const status = $("lab-status");
    try {
      await Promise.all(FILES.map(async (f) => {
        const res = await fetch(DATA_DIR + f.name);
        if (!res.ok) throw new Error(`${f.name} introuvable (HTTP ${res.status})`);
        const text = await res.text();
        state.raw[f.name] = text;
        state.tables[f.name] = Papa.parse(text.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
        f.size = new Blob([text]).size;
      }));
      const n = state.tables["fact_flights.csv"].length;
      status.textContent = `${FILES.length} fichiers chargés, ${fmt.format(n)} vols disponibles.`;
      renderFileList();
      initDashboard();
    } catch (err) {
      status.classList.add("error");
      status.innerHTML = location.protocol === "file:"
        ? "Les fichiers ne peuvent pas être lus quand la page est ouverte directement depuis le disque. Lancez un serveur local dans le dossier du projet : <code>python -m http.server 8000</code>, puis ouvrez <code>http://localhost:8000</code>."
        : `Impossible de charger les données : ${esc(err.message)}. Vérifiez que le dossier <code>data/aviation/</code> est bien publié avec le site.`;
    }
  }

  /* ---------------------------------------------- 2. Explorateur */
  function renderFileList() {
    const list = $("file-list");
    list.innerHTML = FILES.map((f, i) => {
      const rows = state.tables[f.name].length;
      const kb = (f.size / 1024).toFixed(f.size < 10240 ? 1 : 0).replace(".", ",");
      return `<li><button class="file-btn" type="button" data-i="${i}" aria-pressed="false">
        <strong>${f.name}</strong><span>${f.label}, ${fmt.format(rows)} lignes, ${kb} Ko</span></button></li>`;
    }).join("");
    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".file-btn");
      if (btn) showPreview(Number(btn.dataset.i));
    });
    showPreview(0);
  }

  function showPreview(i) {
    const f = FILES[i];
    document.querySelectorAll(".file-btn").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i)));
    const rows = state.tables[f.name];
    const cols = Object.keys(rows[0] || {});
    $("file-preview").innerHTML = `
      <div class="preview-head">
        <p>${cols.length} colonnes, 6 premières lignes sur ${fmt.format(rows.length)}</p>
        <a href="${DATA_DIR + f.name}" download>Télécharger ${f.name}</a>
      </div>
      <div class="table-scroll"><table class="data">
        <thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${rows.slice(0, 6).map((r) => `<tr>${cols.map((c) => `<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
  }

  /* ---------------------------------------------- 3. Tableau de bord */
  function initDashboard() {
    const select = $("airline-filter");
    state.tables["dim_airlines.csv"].forEach((a) =>
      select.insertAdjacentHTML("beforeend", `<option value="${esc(a.airline_code)}">${esc(a.airline_name)}</option>`));
    select.addEventListener("change", () => renderDashboard(select.value));

    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.color = COLORS.muted;
    Chart.defaults.borderColor = COLORS.line;
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    renderDashboard("ALL");
  }

  const mean = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
  const delays = (rows) => rows.filter((r) => r.status !== "Annulé" && typeof r.arrival_delay_min === "number").map((r) => r.arrival_delay_min);

  function renderDashboard(code) {
    const all = state.tables["fact_flights.csv"];
    const rows = code === "ALL" ? all : all.filter((r) => r.airline_code === code);
    const flown = rows.filter((r) => r.status !== "Annulé");
    const airports = Object.fromEntries(state.tables["dim_airports.csv"].map((a) => [a.airport_code, a.city]));
    const airlineNames = Object.fromEntries(state.tables["dim_airlines.csv"].map((a) => [a.airline_code, a.airline_name]));
    const total = rows.length || 1;

    // Indicateurs clés
    const kpis = [
      [fmt.format(rows.length), "vols au programme"],
      [dec(rows.filter((r) => r.status === ON_TIME).length / total * 100) + " %", "arrivés à l'heure"],
      [dec(mean(delays(rows))) + " min", "retard moyen à l'arrivée"],
      [fmt.format(flown.reduce((s, r) => s + (r.passengers || 0), 0)), "passagers transportés"],
      [dec((1 - flown.length / total) * 100) + " %", "vols annulés"],
    ];
    $("kpis").innerHTML = kpis.map(([v, l]) => `<div class="kpi"><strong>${v}</strong><span>${l}</span></div>`).join("");

    // Par mois
    const byMonth = MONTHS.map((_, m) => rows.filter((r) => Number(String(r.flight_date).slice(5, 7)) === m + 1));
    draw("chart-monthly", {
      data: {
        labels: MONTHS,
        datasets: [
          { type: "bar", label: "Vols", data: byMonth.map((g) => g.length), backgroundColor: "rgba(62,111,102,.8)", borderRadius: 6, yAxisID: "y", order: 2 },
          { type: "line", label: "Retard moyen (min)", data: byMonth.map((g) => +mean(delays(g)).toFixed(1)), borderColor: COLORS.coral, backgroundColor: COLORS.coral, tension: .35, pointRadius: 3, yAxisID: "y1", order: 1 },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "vols" } },
          y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false }, title: { display: true, text: "minutes" } },
        },
      },
    });

    // Ponctualité par compagnie (toujours toutes ; la sélection est mise en évidence)
    const perAirline = Object.keys(airlineNames).map((c) => {
      const g = all.filter((r) => r.airline_code === c);
      return { c, name: airlineNames[c], rate: g.filter((r) => r.status === ON_TIME).length / (g.length || 1) * 100 };
    }).sort((a, b) => b.rate - a.rate);
    draw("chart-airlines", {
      type: "bar",
      data: {
        labels: perAirline.map((a) => a.name),
        datasets: [{
          label: "% à l'heure", data: perAirline.map((a) => +a.rate.toFixed(1)), borderRadius: 6,
          backgroundColor: perAirline.map((a) => (code === "ALL" || a.c === code ? COLORS.teal : "rgba(62,111,102,.22)")),
        }],
      },
      options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { min: 50, max: 90, title: { display: true, text: "%" } } } },
    });

    // Retard selon l'heure prévue
    const hours = [...Array(16)].map((_, i) => i + 6);
    const byHour = hours.map((h) => mean(delays(rows.filter((r) => Number(String(r.scheduled_departure).slice(11, 13)) === h))));
    const peak = Math.max(...byHour);
    draw("chart-hours", {
      type: "bar",
      data: {
        labels: hours.map((h) => h + " h"),
        datasets: [{ label: "Retard moyen (min)", data: byHour.map((v) => +v.toFixed(1)), borderRadius: 5, backgroundColor: byHour.map((v) => (v >= peak * .8 ? COLORS.coral : COLORS.yellow)) }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: "minutes" } } } },
    });

    // Routes les plus fréquentées (deux sens confondus)
    const routes = {};
    rows.forEach((r) => {
      const key = [r.origin, r.destination].sort().join("-");
      routes[key] = (routes[key] || 0) + 1;
    });
    const top = Object.entries(routes).sort((a, b) => b[1] - a[1]).slice(0, 8);
    draw("chart-routes", {
      type: "bar",
      data: {
        labels: top.map(([k]) => k.split("-").map((c) => airports[c] || c).join(" ⇄ ")),
        datasets: [{ label: "Vols", data: top.map(([, v]) => v), backgroundColor: COLORS.ink, borderRadius: 6 }],
      },
      options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } },
    });
  }

  function draw(id, config) {
    config.options = Object.assign({ maintainAspectRatio: false, responsive: true, animation: { duration: 400 } }, config.options);
    if (state.charts[id]) state.charts[id].destroy();
    state.charts[id] = new Chart($(id), config);
  }

  /* ---------------------------------------------- 4. Notebook Pyodide */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve;
      s.onerror = () => reject(new Error("Téléchargement de Python impossible. Vérifiez votre connexion Internet."));
      document.head.appendChild(s);
    });
  }

  function ensurePython() {
    if (state.pyodide) return Promise.resolve(state.pyodide);
    if (state.pyLoading) return state.pyLoading;
    const label = $("py-state"), btn = $("py-start");
    btn.disabled = true;
    state.pyLoading = (async () => {
      if (!Object.keys(state.raw).length) throw new Error("Les fichiers CSV ne sont pas chargés. Voir le message en haut du Data Lab.");
      label.textContent = "Téléchargement de Python…";
      await loadScript(PYODIDE_URL);
      const py = await loadPyodide();
      label.textContent = "Installation de pandas, matplotlib et sqlite3…";
      await py.loadPackage(["pandas", "matplotlib", "sqlite3"]);
      py.FS.mkdirTree("/data/aviation");
      FILES.forEach((f) => py.FS.writeFile("/data/aviation/" + f.name, state.raw[f.name]));
      await py.runPythonAsync(window.NOTEBOOK_SETUP);
      state.pyodide = py;
      label.textContent = `Python ${py.version} est prêt. Les CSV sont disponibles dans /data/aviation/.`;
      label.className = "py-state ready";
      btn.textContent = "Python est prêt";
      return py;
    })().catch((err) => {
      state.pyLoading = null;
      btn.disabled = false;
      label.textContent = err.message;
      label.className = "py-state error";
      throw err;
    });
    return state.pyLoading;
  }

  async function runCell(cell) {
    const out = cell.querySelector(".output");
    const btn = cell.querySelector(".run");
    const code = cell.querySelector("textarea").value;
    btn.disabled = true;
    out.innerHTML = `<p class="run-info">Exécution en cours…</p>`;
    let py;
    try { py = await ensurePython(); } catch (err) { out.innerHTML = `<pre class="err">${esc(err.message)}</pre>`; btn.disabled = false; return; }

    const lines = [];
    py.setStdout({ batched: (t) => lines.push(t) });
    py.setStderr({ batched: (t) => lines.push(t) });
    const t0 = performance.now();
    let error = null;
    try {
      py.runPython("_html_out.clear()");
      await py.loadPackagesFromImports(code);
      await py.runPythonAsync(code);
    } catch (err) {
      error = String(err.message || err).split("\n")
        .filter((l) => !l.includes("/lib/python") && !l.includes("_pyodide")).slice(-8).join("\n");
    }
    const figsProxy = py.runPython("_collect_figures()");
    const htmlProxy = py.globals.get("_html_out");
    const figs = figsProxy.toJs(), html = htmlProxy.toJs();
    figsProxy.destroy(); htmlProxy.destroy();
    const ms = Math.round(performance.now() - t0);

    out.innerHTML =
      (lines.length ? `<pre>${esc(lines.join("\n"))}</pre>` : "") +
      html.join("") +
      figs.map((b64) => `<img src="data:image/png;base64,${b64}" alt="Graphique produit par la cellule">`).join("") +
      (error ? `<pre class="err">${esc(error)}</pre>` : "") +
      `<p class="run-info">Exécuté en ${fmt.format(ms)} ms</p>`;
    btn.disabled = false;
  }

  function addCell({ title, description, code }) {
    const cell = document.createElement("article");
    cell.className = "cell";
    cell.innerHTML = `
      <div class="cell-head">
        <div><h4>${esc(title)}</h4><p>${esc(description)}</p></div>
        <div class="cell-actions">
          <button class="btn ghost small reset" type="button">Réinitialiser</button>
          <button class="btn small run" type="button">Exécuter</button>
        </div>
      </div>
      <textarea class="code" spellcheck="false" aria-label="Code Python : ${esc(title)}"></textarea>
      <div class="output" aria-live="polite"></div>`;
    const ta = cell.querySelector("textarea");
    ta.value = code;
    ta.rows = Math.min(24, code.split("\n").length + 1);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end");
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCell(cell); }
    });
    cell.querySelector(".run").addEventListener("click", () => runCell(cell));
    cell.querySelector(".reset").addEventListener("click", () => { ta.value = code; cell.querySelector(".output").innerHTML = ""; });
    $("notebook").appendChild(cell);
    return cell;
  }

  function initNotebook() {
    window.NOTEBOOK_CELLS.forEach(addCell);
    $("py-start").addEventListener("click", () => ensurePython().catch(() => {}));
    $("add-cell").addEventListener("click", () => {
      const n = $("notebook").children.length + 1;
      addCell({ title: `Cellule libre ${n}`, description: "Écrivez votre propre analyse. Ctrl + Entrée pour exécuter.", code: window.NOTEBOOK_EMPTY_CELL })
        .querySelector("textarea").focus();
    });
  }

  initNotebook();
  loadAll();
})();
