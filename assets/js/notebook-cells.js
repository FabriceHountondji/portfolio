// Cellules pré-remplies du notebook du Data Lab.
// Les CSV de data/aviation/ sont copiés dans le système de fichiers de Pyodide
// sous /data/aviation/, on les lit donc comme sur un disque local.
// La fonction display(df) affiche un DataFrame en tableau ; les figures
// matplotlib sont affichées automatiquement à la fin de l'exécution.

window.NOTEBOOK_SETUP = String.raw`
import io, base64
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams.update({
    "figure.facecolor": "white", "axes.facecolor": "white",
    "axes.edgecolor": "#c9cfd2", "axes.labelcolor": "#16303f",
    "xtick.color": "#5b6a72", "ytick.color": "#5b6a72",
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.titleweight": "bold", "axes.titlesize": 12, "font.size": 10,
    "axes.prop_cycle": matplotlib.cycler(color=["#3e6f66", "#e6674b", "#eac54f", "#16303f", "#8fb9ad"]),
})
pd.set_option("display.width", 120)

_html_out = []

def display(obj, max_rows=20):
    """Affiche un DataFrame ou une Series sous forme de tableau HTML."""
    if isinstance(obj, pd.Series):
        obj = obj.to_frame()
    if isinstance(obj, pd.DataFrame):
        extra = ""
        if len(obj) > max_rows:
            extra = f"<p class='run-info'>{len(obj)} lignes, {max_rows} premières affichées</p>"
            obj = obj.head(max_rows)
        _html_out.append("<div class='table-scroll'>" + obj.to_html(classes="data", border=0, na_rep="") + "</div>" + extra)
    else:
        print(obj)

def _collect_figures():
    images = []
    for num in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(num).savefig(buf, format="png", dpi=110, bbox_inches="tight")
        images.append(base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
    return images
`;

window.NOTEBOOK_CELLS = [
  {
    title: "Charger et explorer la table de faits",
    description: "Lecture des CSV avec pandas et premiers contrôles de qualité.",
    code: String.raw`import pandas as pd

vols = pd.read_csv("/data/aviation/fact_flights.csv", parse_dates=["flight_date"])
A_L_HEURE = "À l'heure"

debut, fin = vols["flight_date"].min(), vols["flight_date"].max()
print(f"{len(vols)} vols chargés, du {debut:%d/%m/%Y} au {fin:%d/%m/%Y}")
print(f"Taux de ponctualité : {(vols['status'] == A_L_HEURE).mean():.1%}")

manquants = vols.isna().sum()
print("\nValeurs manquantes (vols annulés) :")
print(manquants[manquants > 0].to_string())

display(vols.head(8))`,
  },
  {
    title: "Ponctualité par compagnie",
    description: "Jointure faits et dimension, agrégation, puis graphique matplotlib.",
    code: String.raw`import pandas as pd
import matplotlib.pyplot as plt

vols = pd.read_csv("/data/aviation/fact_flights.csv")
compagnies = pd.read_csv("/data/aviation/dim_airlines.csv")

# Jointure fait / dimension, puis agrégation par compagnie
df = vols.merge(compagnies, on="airline_code")
stats = (
    df.assign(a_l_heure=df["status"].eq("À l'heure"))
      .groupby("airline_name")
      .agg(vols=("flight_id", "count"),
           ponctualite=("a_l_heure", "mean"),
           retard_moyen=("arrival_delay_min", "mean"))
      .sort_values("ponctualite")
)

fig, ax = plt.subplots(figsize=(8, 4))
barres = ax.barh(stats.index, stats["ponctualite"] * 100)
ax.bar_label(barres, fmt="%.1f %%", padding=4, fontsize=9)
ax.set_xlim(0, 100)
ax.set_xlabel("Vols arrivés à l'heure (%)")
ax.set_title("Ponctualité par compagnie, 2025")

display(stats.round(2))`,
  },
  {
    title: "Requête SQL sur l'entrepôt",
    description: "Les 4 tables sont chargées dans SQLite pour interroger le modèle en étoile en SQL.",
    code: String.raw`import sqlite3
import pandas as pd

# Charge les 4 tables CSV dans une base SQLite en mémoire
con = sqlite3.connect(":memory:")
for table in ["fact_flights", "dim_airports", "dim_airlines", "dim_aircraft"]:
    pd.read_csv(f"/data/aviation/{table}.csv").to_sql(table, con, index=False)

requete = """
SELECT o.city || ' - ' || d.city              AS route,
       COUNT(*)                               AS vols,
       ROUND(AVG(f.arrival_delay_min), 1)     AS retard_moyen_min,
       ROUND(100.0 * SUM(f.status = 'Retardé') / COUNT(*), 1) AS pct_retardes
FROM fact_flights f
JOIN dim_airports o ON o.airport_code = f.origin
JOIN dim_airports d ON d.airport_code = f.destination
GROUP BY route
HAVING COUNT(*) >= 60
ORDER BY retard_moyen_min DESC
LIMIT 10;
"""
display(pd.read_sql(requete, con))`,
  },
  {
    title: "Carte thermique des retards",
    description: "Tableau croisé jour × heure de départ pour repérer les créneaux à risque.",
    code: String.raw`import pandas as pd
import matplotlib.pyplot as plt

vols = pd.read_csv("/data/aviation/fact_flights.csv", parse_dates=["scheduled_departure"])
vols["jour"] = vols["scheduled_departure"].dt.dayofweek
vols["heure"] = vols["scheduled_departure"].dt.hour
JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

grille = vols.pivot_table(index="jour", columns="heure",
                          values="arrival_delay_min", aggfunc="mean")

fig, ax = plt.subplots(figsize=(10, 3.6))
image = ax.imshow(grille, cmap="YlOrRd", aspect="auto")
ax.set_yticks(range(7), JOURS)
ax.set_xticks(range(len(grille.columns)), [f"{h}h" for h in grille.columns])
ax.set_title("Retard moyen à l'arrivée selon le jour et l'heure de départ")
fig.colorbar(image, label="minutes")

jour, heure = grille.stack().idxmax()
print(f"Créneau le plus à risque : {JOURS[jour]} à {heure}h, "
      f"{grille.stack().max():.0f} min de retard moyen")`,
  },
];

window.NOTEBOOK_EMPTY_CELL = String.raw`import pandas as pd

# Fichiers disponibles : fact_flights, dim_airports, dim_airlines, dim_aircraft
df = pd.read_csv("/data/aviation/dim_aircraft.csv")
display(df.groupby("manufacturer")["seats"].describe())`;
