import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';

const ExperienceCard = ({ title, company, period, location, tasks }) => (
  <div className="mb-10 ml-6 p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-600 transition-transform hover:scale-101">
    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
      <Briefcase className="w-4 h-4 text-blue-600" />
    </span>
    <h3 className="flex items-center mb-1 text-xl font-semibold text-gray-900">
      {title}
    </h3>
    <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium text-gray-500">
      <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
      <span className="flex items-center gap-1"><Calendar size={14}/> {period}</span>
      <span className="text-blue-600 font-bold">{company}</span>
    </div>
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <li key={index} className="flex items-start gap-2 text-gray-600">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          <span>{task}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ProfessionalExperience = () => {
  const experiences = [
    {
      title: "Data Analyste - Stagiaire",
      company: "GBAI GENERAL Services",
      location: "IL - USA",
      period: "Été 2024 (4 mois)",
      tasks: [
        "Recueil des besoins utilisateurs et fourniture de solutions d'analyse des ventes[cite: 29].",
        "Analyse, nettoyage et vérification de données via SQL Server et MySQL[cite: 30].",
        "Mise en œuvre de stratégies ayant augmenté le chiffre d'affaires de 5%[cite: 32].",
        "Création de tableaux de bord Power BI pour l'analyse comptable en temps réel[cite: 35]."
      ]
    },
    {
      title: "Développeur Web et Analyste de données - Stagiaire",
      company: "ANSSI",
      location: "Bénin",
      period: "Hiver 2022 (6 mois)",
      tasks: [
        "Développement d'applications Web PHP avec le framework Laravel 8[cite: 40].",
        "Utilisation d'outils ETL pour le traitement et maintien du datalake[cite: 41, 42].",
        "Déploiement de systèmes applicatifs sur Ubuntu OS (Nginx)[cite: 43].",
        "Administration de bases de données (Vues, Procédures stockées, Déclencheurs)[cite: 46, 47]."
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 uppercase tracking-wider">
          Expériences Professionnelles
        </h2>
        <div className="relative border-l border-gray-200 ml-3">
          {experiences.map((exp, idx) => (
            <ExperienceCard key={idx} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalExperience;