"""
Génère des jeux de données d'EXEMPLE pour l'entrepôt aviation (schéma en étoile).

Ces fichiers servent de démonstration dans la section « Data Lab » du portfolio.
Remplacez-les par les exports réels de votre entrepôt PostgreSQL en gardant
les mêmes noms de colonnes (voir data/aviation/README.md).

Usage :  python scripts/generate_sample_data.py
"""
import csv
import math
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(2026)
OUT = Path(__file__).resolve().parent.parent / "data" / "aviation"
OUT.mkdir(parents=True, exist_ok=True)

# --------------------------------------------------------------- dim_airports
AIRPORTS = [
    # iata, icao, nom, ville, pays, lat, lon, fuseau
    ("YUL", "CYUL", "Montréal-Trudeau", "Montréal", "Canada", 45.4706, -73.7408, "America/Toronto"),
    ("YYZ", "CYYZ", "Toronto Pearson", "Toronto", "Canada", 43.6777, -79.6248, "America/Toronto"),
    ("YVR", "CYVR", "Vancouver International", "Vancouver", "Canada", 49.1947, -123.1792, "America/Vancouver"),
    ("YYC", "CYYC", "Calgary International", "Calgary", "Canada", 51.1315, -114.0106, "America/Edmonton"),
    ("YOW", "CYOW", "Ottawa Macdonald-Cartier", "Ottawa", "Canada", 45.3225, -75.6692, "America/Toronto"),
    ("YQB", "CYQB", "Québec Jean-Lesage", "Québec", "Canada", 46.7911, -71.3933, "America/Toronto"),
    ("YHZ", "CYHZ", "Halifax Stanfield", "Halifax", "Canada", 44.8808, -63.5086, "America/Halifax"),
    ("YEG", "CYEG", "Edmonton International", "Edmonton", "Canada", 53.3097, -113.5800, "America/Edmonton"),
    ("YWG", "CYWG", "Winnipeg Richardson", "Winnipeg", "Canada", 49.9100, -97.2399, "America/Winnipeg"),
    ("JFK", "KJFK", "John F. Kennedy", "New York", "États-Unis", 40.6413, -73.7781, "America/New_York"),
    ("ORD", "KORD", "Chicago O'Hare", "Chicago", "États-Unis", 41.9742, -87.9073, "America/Chicago"),
    ("LAX", "KLAX", "Los Angeles International", "Los Angeles", "États-Unis", 33.9416, -118.4085, "America/Los_Angeles"),
    ("CDG", "LFPG", "Paris-Charles de Gaulle", "Paris", "France", 49.0097, 2.5479, "Europe/Paris"),
    ("LHR", "EGLL", "London Heathrow", "Londres", "Royaume-Uni", 51.4700, -0.4543, "Europe/London"),
    ("CUN", "MMUN", "Cancún International", "Cancún", "Mexique", 21.0365, -86.8771, "America/Cancun"),
]

# --------------------------------------------------------------- dim_airlines
AIRLINES = [
    # code, nom, pays, alliance, facteur de retard
    ("AC", "Air Canada", "Canada", "Star Alliance", 1.00),
    ("WS", "WestJet", "Canada", "Aucune", 1.10),
    ("PD", "Porter Airlines", "Canada", "Aucune", 0.85),
    ("TS", "Air Transat", "Canada", "Aucune", 1.20),
    ("F8", "Flair Airlines", "Canada", "Aucune", 1.45),
    ("UA", "United Airlines", "États-Unis", "Star Alliance", 1.05),
    ("DL", "Delta Air Lines", "États-Unis", "SkyTeam", 0.80),
    ("AF", "Air France", "France", "SkyTeam", 0.95),
]
DELAY_FACTOR = {a[0]: a[4] for a in AIRLINES}

# --------------------------------------------------------------- dim_aircraft
MODELS = {
    # modèle: (constructeur, sièges, long-courrier ?)
    "A220-300": ("Airbus", 137, False),
    "A320neo": ("Airbus", 174, False),
    "A321neo": ("Airbus", 196, False),
    "A330-300": ("Airbus", 297, True),
    "737 MAX 8": ("Boeing", 174, False),
    "787-9": ("Boeing", 298, True),
    "E195-E2": ("Embraer", 132, False),
    "Dash 8-400": ("De Havilland", 78, False),
}
FLEET_MODELS = {
    "AC": ["A220-300", "A321neo", "737 MAX 8", "787-9", "A330-300"],
    "WS": ["737 MAX 8", "787-9"],
    "PD": ["E195-E2", "Dash 8-400"],
    "TS": ["A321neo", "A330-300"],
    "F8": ["737 MAX 8"],
    "UA": ["737 MAX 8", "A320neo"],
    "DL": ["A220-300", "A321neo"],
    "AF": ["A330-300", "787-9"],
}
PREFIX = {"AC": "C-F", "WS": "C-G", "PD": "C-G", "TS": "C-G", "F8": "C-F", "UA": "N", "DL": "N", "AF": "F-H"}

aircraft = []
aid = 1
for code, models in FLEET_MODELS.items():
    for model in models:
        for _ in range(random.randint(2, 4)):
            suffix = "".join(random.choice("ABCDEFGHJKLMNPRSTUVWXYZ") for _ in range(3))
            reg = PREFIX[code] + (str(random.randint(100, 999)) + suffix[:2] if PREFIX[code] == "N" else suffix)
            manuf, seats, _ = MODELS[model]
            aircraft.append({
                "aircraft_id": aid, "registration": reg, "model": model,
                "manufacturer": manuf, "seats": seats, "airline_code": code,
                "year_built": random.randint(2012, 2024),
            })
            aid += 1

# --------------------------------------------------------------- routes
ROUTES = [
    # origine, destination, compagnies, vols/semaine (aller)
    ("YUL", "YYZ", ["AC", "PD", "WS"], 9), ("YUL", "YVR", ["AC", "WS", "F8"], 4),
    ("YUL", "YYC", ["AC", "WS"], 3), ("YUL", "YOW", ["PD"], 3), ("YUL", "YQB", ["AC", "PD"], 3),
    ("YUL", "YHZ", ["AC", "PD"], 3), ("YUL", "JFK", ["DL", "AC"], 4), ("YUL", "ORD", ["UA", "AC"], 3),
    ("YUL", "LAX", ["AC"], 2), ("YUL", "CDG", ["AF", "AC", "TS"], 5), ("YUL", "LHR", ["AC"], 2),
    ("YUL", "CUN", ["TS", "AC", "WS"], 4), ("YYZ", "YVR", ["AC", "WS", "F8"], 5),
    ("YYZ", "YYC", ["AC", "WS", "F8"], 4), ("YYZ", "YOW", ["AC", "PD"], 4), ("YYZ", "YWG", ["AC", "WS"], 2),
    ("YYZ", "YHZ", ["AC", "PD", "WS"], 3), ("YYZ", "LHR", ["AC"], 2), ("YYZ", "ORD", ["UA"], 2),
    ("YVR", "YYC", ["AC", "WS", "F8"], 4), ("YVR", "YEG", ["WS", "AC"], 3), ("YVR", "LAX", ["AC", "DL"], 2),
    ("YYC", "YEG", ["WS"], 2), ("YYC", "YWG", ["WS", "F8"], 2),
]
LONG_HAUL = {"CDG", "LHR"}
AIRPORT_BY_CODE = {a[0]: a for a in AIRPORTS}


def haversine(a, b):
    lat1, lon1 = math.radians(a[5]), math.radians(a[6])
    lat2, lon2 = math.radians(b[5]), math.radians(b[6])
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))


MONTH_FACTOR = {1: 1.45, 2: 1.35, 3: 1.05, 4: 0.85, 5: 0.80, 6: 1.10,
                7: 1.30, 8: 1.20, 9: 0.75, 10: 0.80, 11: 0.95, 12: 1.50}
DEP_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

flights = []
fid = 1
start = datetime(2025, 1, 1)
for week in range(52):
    for orig, dest, carriers, per_week in ROUTES:
        for direction in (0, 1):
            o, d = (orig, dest) if direction == 0 else (dest, orig)
            n = max(1, round(per_week * random.uniform(0.35, 0.45)))  # échantillon ~40 %
            for _ in range(n):
                airline = random.choice(carriers)
                long_haul = o in LONG_HAUL or d in LONG_HAUL
                fleet = [ac for ac in aircraft if ac["airline_code"] == airline
                         and MODELS[ac["model"]][2] == long_haul]
                if not fleet:
                    fleet = [ac for ac in aircraft if ac["airline_code"] == airline]
                plane = random.choice(fleet)

                day = start + timedelta(days=week * 7 + random.randint(0, 6))
                if day.year != 2025:
                    continue
                hour = random.choice([17, 18, 19, 20, 21] if long_haul and o in ("YUL", "YYZ") else DEP_HOURS)
                sched_dep = day.replace(hour=hour, minute=random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]))
                dist = haversine(AIRPORT_BY_CODE[o], AIRPORT_BY_CODE[d])
                duration = int(dist / 790 * 60 + 28 + random.randint(-6, 12))
                sched_arr = sched_dep + timedelta(minutes=duration)

                # Retard : saison × heure × compagnie × aéroport chargé
                p_cancel = 0.012 * MONTH_FACTOR[day.month] * DELAY_FACTOR[airline]
                if random.random() < p_cancel:
                    status, dep_delay, arr_delay, act_dep, act_arr = "Annulé", "", "", "", ""
                else:
                    hour_factor = 0.6 + (hour - 6) * 0.07
                    hub = 1.15 if o in ("YYZ", "JFK", "ORD", "LHR") else 1.0
                    wd = 1.12 if day.weekday() in (4, 6) else 1.0
                    scale = 9 * MONTH_FACTOR[day.month] * DELAY_FACTOR[airline] * hour_factor * hub * wd
                    dep = int(random.expovariate(1 / scale)) - random.randint(0, 6)
                    if random.random() < 0.04:
                        dep += random.randint(60, 240)  # grosses perturbations
                    arr = dep + random.randint(-14, 10)
                    act_dep_dt = sched_dep + timedelta(minutes=dep)
                    act_arr_dt = sched_arr + timedelta(minutes=arr)
                    status = "À l'heure" if arr <= 15 else "Retardé"
                    dep_delay, arr_delay = dep, arr
                    act_dep, act_arr = act_dep_dt.isoformat(sep=" "), act_arr_dt.isoformat(sep=" ")

                pax = "" if status == "Annulé" else int(plane["seats"] * random.uniform(0.62, 0.98))
                num = f"{airline}{random.randint(100, 1999)}"
                flights.append({
                    "flight_id": fid, "flight_number": num, "flight_date": day.date().isoformat(),
                    "airline_code": airline, "aircraft_id": plane["aircraft_id"],
                    "origin": o, "destination": d,
                    "scheduled_departure": sched_dep.isoformat(sep=" "), "actual_departure": act_dep,
                    "scheduled_arrival": sched_arr.isoformat(sep=" "), "actual_arrival": act_arr,
                    "departure_delay_min": dep_delay, "arrival_delay_min": arr_delay,
                    "distance_km": round(dist), "passengers": pax, "status": status,
                })
                fid += 1

flights.sort(key=lambda f: f["scheduled_departure"])
for i, f in enumerate(flights, 1):
    f["flight_id"] = i


def write(name, rows, fields):
    with open(OUT / name, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"{name:22s} {len(rows):>6} lignes")


write("dim_airports.csv",
      [dict(zip(["airport_code", "icao_code", "airport_name", "city", "country", "latitude", "longitude", "timezone"], a)) for a in AIRPORTS],
      ["airport_code", "icao_code", "airport_name", "city", "country", "latitude", "longitude", "timezone"])
write("dim_airlines.csv",
      [dict(zip(["airline_code", "airline_name", "country", "alliance"], a[:4])) for a in AIRLINES],
      ["airline_code", "airline_name", "country", "alliance"])
write("dim_aircraft.csv", aircraft,
      ["aircraft_id", "registration", "model", "manufacturer", "seats", "airline_code", "year_built"])
write("fact_flights.csv", flights, list(flights[0].keys()))
