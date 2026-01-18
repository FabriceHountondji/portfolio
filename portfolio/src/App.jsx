import React from 'react';
import { 
  Database, Cpu, Mail, Linkedin, Layers, Terminal, BookOpen, User
} from 'lucide-react';

const Badge = ({ children }) => (
  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md mr-2 mb-2">
    {children}
  </span>
);

const ProjectCard = ({ title, objective, techs, details, period }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 text-blue-600">
        <Layers size={20} />
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      </div>
      <span className="text-xs font-medium text-gray-400 italic">{period}</span>
    </div>
    <p className="text-sm text-gray-600 mb-4"><strong>Objectif:</strong> {objective}</p>
    <div className="flex flex-wrap mb-4">
      {techs.map((t, i) => <Badge key={i}>{t}</Badge>)}
    </div>
    <ul className="text-sm text-gray-500 space-y-1 list-disc pl-4">
      {details.map((d, i) => <li key={i}>{d}</li>)}
    </ul>
  </div>
);

export default function Portfolio() {
  return (
    <div className="bg-gray-50 min-h-screen w-full font-sans text-gray-900 m-0 p-0">
      {/* Header - Pleine Largeur */}
      <header className="bg-white border-b sticky top-0 z-10 w-full">
        <div className="w-full px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Fabrice HOUNTONDJI</h1>
            <p className="text-blue-600 font-medium italic">INGÉNIEUR EN ANALYSE DE DONNÉES</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right text-sm text-gray-500 mr-4">
              <p>Français (Avancé), Anglais (Intermédiaire)</p>
            </div>
            <a href="mailto:fabricehoutondji@gmail.com" className="hover:text-blue-600 transition-colors"><Mail size={22}/></a>
            <a href="https://www.linkedin.com/in/fabrice-hountondji" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors"><Linkedin size={22}/></a>
          </div>
        </div>
      </header>

      {/* Main Content - Toute la largeur */}
      <main className="w-full px-8 md:px-16 py-12 space-y-20">
        
        {/* Section Formations Académiques */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-blue-600" />
            <h2 className="text-2xl font-bold">Formations Académiques</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border-l-4 border-blue-600 shadow-sm">
              <h3 className="font-bold text-gray-800">Maîtrise en informatique et gestion intelligente des données</h3>
              <p className="text-blue-600">Université du Québec à Montréal, QC/Montréal</p>
              <p className="text-sm text-gray-500 italic">Diplôme prévu en mai 2026</p>
            </div>
            <div className="bg-white p-6 rounded-xl border-l-4 border-gray-300 shadow-sm">
              <h3 className="font-bold text-gray-800">Baccalauréat en Systèmes Informatiques et Logiciels</h3>
              <p className="text-blue-600">Haute Ecole de Commerce et de Management, Bénin</p>
              <p className="text-sm text-gray-500 italic">2018-2021</p>
            </div>
          </div>
        </section>

        {/* Parcours Professionnel */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Database className="text-blue-600" />
            <h2 className="text-2xl font-bold">Parcours Professionnel</h2>
          </div>
          
          <div className="space-y-12">
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <h3 className="text-xl font-bold text-gray-800">Data Analyste - Stagiaire</h3>
              <p className="text-blue-600 font-semibold italic">GBAI GENERAL Services (IL - USA) </p>
              <p className="text-sm text-gray-500 mb-4 font-medium">Été 2024 (4 mois)</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
                <li className="flex items-start gap-2">✅ Analyse, nettoyage et vérification via SQL Server & MySQL</li>
                <li className="flex items-start gap-2">📈 Stratégies d'augmentation du chiffre d'affaires de 5%</li>
                <li className="flex items-start gap-2">📊 Tableaux de bord Power BI (Analyse comptable temps réel)</li>
                <li className="flex items-start gap-2">⚙️ Gestion de projet avec Jira pour suivre l'avancement</li>
                <li className="flex items-start gap-2">🎯 Recueil et analyse des besoins utilisateurs finaux</li>
                <li className="flex items-start gap-2">📦 Aide à la gestion des stocks via prévisions budgétaires</li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-300 pl-6 py-2">
              <h3 className="text-xl font-bold text-gray-800">Développeur Web et Analyste de données - Stagiaire </h3>
              <p className="text-blue-600 font-semibold italic">Sécurité des Systèmes d'informations (ANSSI-Bénin) </p>
              <p className="text-sm text-gray-500 mb-4 font-medium">Hiver 2022 (6 mois) </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
                <li className="flex items-start gap-2">💻 Framework Laravel 8 & PHP pour applications Web</li>
                <li className="flex items-start gap-2">🔄 Outils et technologies ETL pour le traitement des données</li>
                <li className="flex items-start gap-2">🌐 Déploiement sur Ubuntu OS (Nginx) et monitoring</li>
                <li className="flex items-start gap-2">🗄️ Administration DB (Déclencheurs et procédures stockées)</li>
                <li className="flex items-start gap-2">🛠️ Correction de bugs et maintien du datalake</li>
                <li className="flex items-start gap-2">📋 Analyse des données avec Power BI</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Expertise Technique */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="text-blue-600" />
            <h2 className="text-2xl font-bold">Expertise Technique</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-bold text-blue-600 mb-3 underline decoration-2 underline-offset-4">Stockage & Big Data</h4>
              <div className="flex flex-wrap">
                {["Oracle", "NoSQL", "PostgreSQL", "Neo4J", "HDFS", "Spark", "Hive", "PIG", "Hadoop"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-bold text-blue-600 mb-3 underline decoration-2 underline-offset-4">IA & Analyse</h4>
              <div className="flex flex-wrap">
                {["CNN", "Tensorflow", "Keras", "Pandas", "Analyse Prédictive", "Power BI", "RapidMiner"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-bold text-blue-600 mb-3 underline decoration-2 underline-offset-4">Langages</h4>
              <div className="flex flex-wrap">
                {["Python", "JAVA", "R", "PHP", "JavaScript", "C++", "SQL"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-bold text-blue-600 mb-3 underline decoration-2 underline-offset-4">Technologies</h4>
              <div className="flex flex-wrap">
                {["Docker", "Laravel", "Airflow", "Git", "Agile SCRUM", "UML"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
          </div>
        </section>

        {/* Projets Académiques */}
        <section className="flex flex-col gap-6">
          <ProjectCard 
          title="Gestion de projet Aviation Civile"
          period="Automne 2025 - Hiver 2026"
          objective="Valorisation intelligente des données de l'aviation civile."
          techs={["Python", "Airflow", "Streamlit", "Scraping"]}
          details={[
            "Collecte en temps réel via Opensky et FlightRadar24",
            "Automatisation ETL avec l'orchestrateur Apache Airflow",
            "Affichages et graphiques via Streamlit"
          ]}
        />

        <ProjectCard 
          title="Classification Espèces Marines"
          period="Hiver 2025"
          objective="Développer un modèle CNN pour identifier baleines, requins, etc."
          techs={["CNN", "Keras", "Tensorflow", "Pandas"]}
          details={[
            "Nettoyage et augmentation de données pour la robustesse",
            "Modèle CNN avec filtres progressifs (64 à 512)",
            "Objectif de précision supérieure ou égale à 85%"
          ]}
        />

        <ProjectCard 
          title="Données Massives & Recommandation"
          period="Hiver 2024"
          objective="Système de recommandation et gestion avancée de données massives."
          techs={["Neo4J", "Spark", "Hive", "PIG", "Java"]}
          details={[
            "Création d'une base de données orientée graphe (Neo4j)",
            "Système de recommandation collaboratif pour e-commerce",
            "Création de fonctions UDF en Java et Python"
          ]}
        />

        <ProjectCard 
          title="Fouille de Données Médicales"
          period="Hiver 2024"
          objective="Explorer des données de pharmacovigilance pour extraire des infos."
          techs={["Spark", "Python", "Pandas", "Notebook"]}
          details={[
            "Recherche de motifs ou patterns fréquents",
            "Identification d'effets indésirables de combinaisons de produits",
            "Fouille profonde de données de pharmacovigilance"
          ]}
        />

        </section>

        {/* Section Autres Expériences */}
        <section className="bg-blue-50 p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-blue-600" />
            <h2 className="text-xl font-bold">Autres Expériences</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="font-bold text-gray-800">Associé aux ventes</h3>
              <p className="text-blue-600">Urban Planet, Longueuil, Canada</p>
            </div>
            <p className="text-sm font-medium text-gray-500 italic mt-2 md:mt-0">Automne 2023 à nos jours</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Service à la clientèle rigoureux et fourniture d'informations</li>
            <li>• Organisation du magasin et service à la caisse</li>
          </ul>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="w-full px-8 text-center opacity-70 text-sm">
          <p>© 2026 - Fabrice HOUNTONDJI | Ingénieur en Analyse de Données</p>
        </div>
      </footer>
    </div>
  );
}