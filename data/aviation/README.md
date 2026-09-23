# Données de l'entrepôt aviation

Ce dossier contient les fichiers CSV qui alimentent l'entrepôt PostgreSQL de la
plateforme d'analyse de données aéronautiques. Le portfolio les lit directement
(section Data Lab) : explorateur de fichiers, tableau de bord et notebook Python.

> Les fichiers fournis sont des **données d'exemple** générées par
> `scripts/generate_sample_data.py`. Remplacez-les par vos exports réels en
> conservant les mêmes noms de fichiers et de colonnes.

## Modèle en étoile

| Fichier | Rôle | Clé | Colonnes |
|---|---|---|---|
| `fact_flights.csv` | Table de faits, un vol par ligne | `flight_id` | flight_number, flight_date, airline_code, aircraft_id, origin, destination, scheduled_departure, actual_departure, scheduled_arrival, actual_arrival, departure_delay_min, arrival_delay_min, distance_km, passengers, status |
| `dim_airports.csv` | Dimension aéroports | `airport_code` (IATA) | icao_code, airport_name, city, country, latitude, longitude, timezone |
| `dim_airlines.csv` | Dimension compagnies | `airline_code` (IATA) | airline_name, country, alliance |
| `dim_aircraft.csv` | Dimension appareils | `aircraft_id` | registration, model, manufacturer, seats, airline_code, year_built |

Relations : `fact_flights.origin` et `fact_flights.destination` → `dim_airports.airport_code`,
`fact_flights.airline_code` → `dim_airlines.airline_code`,
`fact_flights.aircraft_id` → `dim_aircraft.aircraft_id`.

Valeurs de `status` : `À l'heure` (arrivée ≤ 15 min de retard), `Retardé`, `Annulé`.
Pour un vol annulé, les colonnes réelles, de retard et de passagers sont vides.

## Exporter depuis PostgreSQL

```sql
\copy (SELECT * FROM fact_flights ORDER BY flight_id) TO 'data/aviation/fact_flights.csv' WITH CSV HEADER
\copy dim_airports TO 'data/aviation/dim_airports.csv' WITH CSV HEADER
\copy dim_airlines TO 'data/aviation/dim_airlines.csv' WITH CSV HEADER
\copy dim_aircraft TO 'data/aviation/dim_aircraft.csv' WITH CSV HEADER
```

Gardez `fact_flights.csv` sous 5 à 10 Mo (échantillon ou une année) pour que la
page reste rapide : tout est chargé dans le navigateur du visiteur.
