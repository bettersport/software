(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryColors",
    ()=>categoryColors,
    "categoryIcons",
    ()=>categoryIcons,
    "categoryLabels",
    ()=>categoryLabels,
    "mockClubs",
    ()=>mockClubs,
    "mockDocuments",
    ()=>mockDocuments,
    "mockESGProjects",
    ()=>mockESGProjects,
    "mockEvents",
    ()=>mockEvents,
    "mockNotifications",
    ()=>mockNotifications,
    "mockSolutionProviders",
    ()=>mockSolutionProviders,
    "mockUser",
    ()=>mockUser,
    "mockUsers",
    ()=>mockUsers,
    "solutionCategoryIcons",
    ()=>solutionCategoryIcons,
    "solutionCategoryLabels",
    ()=>solutionCategoryLabels
]);
const mockUser = {
    id: "u2",
    name: "Felipe González",
    email: "felipe@clubrugby.cl",
    role: "club",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
    club: "Rugby Verde",
    country: "Chile",
    clubId: "c4"
};
const mockUsers = [
    {
        id: "u1",
        name: "Carlos Rodríguez",
        email: "carlos@bettersport.com",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
        club: "BetterSport Platform",
        country: "España"
    },
    {
        id: "u2",
        name: "Felipe González",
        email: "felipe@clubrugby.cl",
        role: "club",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
        club: "Rugby Verde",
        country: "Chile",
        clubId: "c4"
    },
    {
        id: "u3",
        name: "Alejandro Reyes",
        email: "alejandro@greensportsa.com",
        role: "brand",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro",
        club: "GreenSport SA",
        country: "Argentina"
    },
    {
        id: "u4",
        name: "Laura Sánchez",
        email: "laura@sportmanager.es",
        role: "manager",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
        club: "Consultora ESG Deportiva",
        country: "España"
    },
    {
        id: "u5",
        name: "Diego Fernández",
        email: "diego@auditoresg.com",
        role: "auditor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego",
        club: "Auditor Certificado ESG",
        country: "México"
    }
];
const mockClubs = [
    {
        id: "c1",
        name: "Club Atlético Sostenible",
        sport: "Fútbol",
        country: "España",
        flag: "🇪🇸",
        esgScore: 94.2,
        ranking: 1,
        environmental: 96,
        social: 93,
        governance: 91,
        transparency: 98,
        members: 2400,
        founded: 1985,
        description: "Pioneros en sostenibilidad deportiva en España."
    },
    {
        id: "c2",
        name: "Green Sports FC",
        sport: "Fútbol",
        country: "Argentina",
        flag: "🇦🇷",
        esgScore: 91.8,
        ranking: 2,
        environmental: 94,
        social: 90,
        governance: 89,
        transparency: 94,
        members: 1800,
        founded: 1992,
        description: "Referente en gestión ambiental del Cono Sur."
    },
    {
        id: "c3",
        name: "Padel Eco Club",
        sport: "Pádel",
        country: "Chile",
        flag: "🇨🇱",
        esgScore: 88.5,
        ranking: 3,
        environmental: 90,
        social: 88,
        governance: 85,
        transparency: 91,
        members: 650,
        founded: 2005,
        description: "Inclusión y medio ambiente, nuestra razón de ser."
    },
    {
        id: "c4",
        name: "Rugby Verde",
        sport: "Rugby",
        country: "Chile",
        flag: "🇨🇱",
        esgScore: 85.3,
        ranking: 4,
        environmental: 87,
        social: 84,
        governance: 83,
        transparency: 87,
        members: 420,
        founded: 1998,
        description: "Rugby con conciencia ambiental y social."
    },
    {
        id: "c5",
        name: "Natación Inclusiva",
        sport: "Natación",
        country: "Colombia",
        flag: "🇨🇴",
        esgScore: 82.1,
        ranking: 5,
        environmental: 80,
        social: 90,
        governance: 79,
        transparency: 82,
        members: 310,
        founded: 2010,
        description: "Deporte adaptado e inclusión social."
    },
    {
        id: "c6",
        name: "Tenis Sustentable",
        sport: "Tenis",
        country: "México",
        flag: "🇲🇽",
        esgScore: 79.6,
        ranking: 6,
        environmental: 82,
        social: 78,
        governance: 76,
        transparency: 83,
        members: 890,
        founded: 2001,
        description: "Promoviendo el tenis verde."
    },
    {
        id: "c7",
        name: "Atletismo Comunitario",
        sport: "Atletismo",
        country: "Perú",
        flag: "🇵🇪",
        esgScore: 76.4,
        ranking: 7,
        environmental: 74,
        social: 82,
        governance: 74,
        transparency: 80,
        members: 520,
        founded: 2008,
        description: "Atletismo para todos."
    },
    {
        id: "c8",
        name: "Fútbol Barrial",
        sport: "Fútbol",
        country: "Uruguay",
        flag: "🇺🇾",
        esgScore: 73.2,
        ranking: 8,
        environmental: 71,
        social: 79,
        governance: 70,
        transparency: 74,
        members: 1100,
        founded: 1975,
        description: "El fútbol como herramienta social."
    },
    {
        id: "c9",
        name: "CrossFit Sostenible Madrid",
        sport: "CrossFit",
        country: "España",
        flag: "🇪🇸",
        esgScore: 71.4,
        ranking: 9,
        environmental: 69,
        social: 75,
        governance: 69,
        transparency: 73,
        members: 420,
        founded: 2015,
        description: "CrossFit con enfoque comunitario y sostenible en Madrid."
    },
    {
        id: "c10",
        name: "Voleibol Ecológico Bogotá",
        sport: "Voleibol",
        country: "Colombia",
        flag: "🇨🇴",
        esgScore: 68.9,
        ranking: 10,
        environmental: 70,
        social: 72,
        governance: 64,
        transparency: 70,
        members: 280,
        founded: 2012,
        description: "Deporte y naturaleza en perfecta armonía en Bogotá."
    },
    {
        id: "c11",
        name: "Básquetbol Social Buenos Aires",
        sport: "Básquetbol",
        country: "Argentina",
        flag: "🇦🇷",
        esgScore: 66.2,
        ranking: 11,
        environmental: 64,
        social: 70,
        governance: 65,
        transparency: 66,
        members: 650,
        founded: 2009,
        description: "Básquetbol comprometido con el desarrollo social y comunitario."
    },
    {
        id: "c12",
        name: "Trail Running Patagonia",
        sport: "Trail Running",
        country: "Chile",
        flag: "🇨🇱",
        esgScore: 63.7,
        ranking: 12,
        environmental: 68,
        social: 62,
        governance: 59,
        transparency: 66,
        members: 190,
        founded: 2018,
        description: "Corredores de montaña con profunda conciencia ambiental."
    },
    {
        id: "c13",
        name: "Handball Inclusivo CDMX",
        sport: "Handball",
        country: "México",
        flag: "🇲🇽",
        esgScore: 60.5,
        ranking: 13,
        environmental: 58,
        social: 67,
        governance: 57,
        transparency: 60,
        members: 340,
        founded: 2014,
        description: "Handball para todas las edades y capacidades en Ciudad de México."
    },
    {
        id: "c14",
        name: "Ciclismo Urbano BCN",
        sport: "Ciclismo",
        country: "España",
        flag: "🇪🇸",
        esgScore: 57.8,
        ranking: 14,
        environmental: 62,
        social: 56,
        governance: 53,
        transparency: 60,
        members: 780,
        founded: 2016,
        description: "Movilidad sostenible y deporte urbano en Barcelona."
    },
    {
        id: "c15",
        name: "Boxeo Social Lima",
        sport: "Boxeo",
        country: "Perú",
        flag: "🇵🇪",
        esgScore: 54.1,
        ranking: 15,
        environmental: 50,
        social: 62,
        governance: 51,
        transparency: 54,
        members: 210,
        founded: 2020,
        description: "Boxeo como herramienta de inclusión social en Lima."
    }
];
const mockEvents = [
    {
        id: "e1",
        title: "Descarbonizando el rugby",
        clubId: "c4",
        clubName: "Rugby Verde",
        country: "Chile",
        flag: "🇨🇱",
        sport: "Rugby",
        category: "huella_carbono",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80",
        description: "Proyecto que busca mejorar la sostenibilidad de los entornos naturales con la gestión de residuos y reducción de huella de carbono.",
        sustainableImpact: "Reducción del 40% de emisiones CO2 en 3 temporadas",
        budget: 120000,
        funded: 90000,
        remaining: 30000,
        daysLeft: 3,
        sponsoredBy: [
            "Federación Rugby Chile"
        ],
        mediaPartner: "CNN",
        sealEsg: true,
        audience: 15000,
        status: "negotiating"
    },
    {
        id: "e2",
        title: "Agua para el fútbol",
        clubId: "c2",
        clubName: "Green Sports FC",
        country: "Argentina",
        flag: "🇦🇷",
        sport: "Fútbol",
        category: "huella_hidrica",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
        description: "Proyecto que busca mejorar la sostenibilidad de los entornos naturales con la gestión de residuos y eficiencia hídrica.",
        sustainableImpact: "Ahorro de 500.000 litros de agua por temporada",
        budget: 120000,
        funded: 90000,
        remaining: 30000,
        daysLeft: 3,
        sponsoredBy: [
            "AquaEco"
        ],
        mediaPartner: "CNN",
        sealEsg: true,
        audience: 45000,
        status: "negotiating"
    },
    {
        id: "e3",
        title: "Inclusión en Padel",
        clubId: "c3",
        clubName: "Padel Eco Club",
        country: "Chile",
        flag: "🇨🇱",
        sport: "Pádel",
        category: "inclusion",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
        description: "Proyecto que busca mejorar la sostenibilidad de los entornos naturales con la gestión de residuos e inclusión deportiva.",
        sustainableImpact: "200 personas con discapacidad integradas al deporte",
        budget: 120000,
        funded: 90000,
        remaining: 30000,
        daysLeft: 3,
        sponsoredBy: [
            "World Padel Tour"
        ],
        mediaPartner: "ESPN",
        sealEsg: true,
        audience: 8000,
        status: "negotiating"
    },
    {
        id: "e4",
        title: "Gestión residuos en estadios",
        clubId: "c1",
        clubName: "Club Atlético Sostenible",
        country: "España",
        flag: "🇪🇸",
        sport: "Fútbol",
        category: "gestion_residuos",
        image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
        description: "Implementación de sistema de reciclaje y compostaje en estadios deportivos.",
        sustainableImpact: "Reciclaje del 80% de residuos generados en eventos",
        budget: 85000,
        funded: 60000,
        remaining: 25000,
        daysLeft: 12,
        sealEsg: false,
        audience: 60000,
        status: "open"
    },
    {
        id: "e5",
        title: "Educación ambiental juvenil",
        clubId: "c5",
        clubName: "Natación Inclusiva",
        country: "Colombia",
        flag: "🇨🇴",
        sport: "Natación",
        category: "educacion",
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
        description: "Programa educativo para jóvenes deportistas sobre sostenibilidad y cuidado del medioambiente.",
        sustainableImpact: "1.000 jóvenes capacitados en conciencia ambiental",
        budget: 45000,
        funded: 35000,
        remaining: 10000,
        daysLeft: 21,
        sealEsg: true,
        audience: 5000,
        status: "negotiating"
    },
    {
        id: "e6",
        title: "Equidad de género en el deporte",
        clubId: "c6",
        clubName: "Tenis Sustentable",
        country: "México",
        flag: "🇲🇽",
        sport: "Tenis",
        category: "equidad_genero",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
        description: "Programa de becas y formación para atletas femeninas de bajos recursos.",
        sustainableImpact: "150 mujeres acceden a formación deportiva de élite",
        budget: 65000,
        funded: 40000,
        remaining: 25000,
        daysLeft: 30,
        sealEsg: true,
        audience: 12000,
        status: "open"
    },
    {
        id: "e7",
        title: "Maratón Verde — Cero Emisiones",
        clubId: "c7",
        clubName: "Atletismo Comunitario",
        country: "Perú",
        flag: "🇵🇪",
        sport: "Atletismo",
        category: "huella_carbono",
        image: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=600&q=80",
        description: "Maratón urbana con cero emisiones netas. Cada corredor planta un árbol al cruzar la meta.",
        sustainableImpact: "500 árboles plantados, certificación carbono neutro",
        budget: 55000,
        funded: 30000,
        remaining: 25000,
        daysLeft: 45,
        sealEsg: true,
        audience: 8000,
        status: "open",
        featured: true
    },
    {
        id: "e8",
        title: "Rugby Femenino Sin Fronteras",
        clubId: "c4",
        clubName: "Rugby Verde",
        country: "Chile",
        flag: "🇨🇱",
        sport: "Rugby",
        category: "equidad_genero",
        image: "https://images.unsplash.com/photo-1546519638405-a9f9a7c5d0b5?w=600&q=80",
        description: "Torneo internacional femenino de rugby con enfoque en equidad de género e inclusión.",
        sustainableImpact: "80 jugadoras de 10 países, programa de becas activo",
        budget: 78000,
        funded: 50000,
        remaining: 28000,
        daysLeft: 60,
        sponsoredBy: [
            "ONU Mujeres",
            "Nike"
        ],
        sealEsg: true,
        audience: 22000,
        status: "open"
    },
    {
        id: "e9",
        title: "Torneo Pádel Cero Residuos",
        clubId: "c3",
        clubName: "Padel Eco Club",
        country: "Chile",
        flag: "🇨🇱",
        sport: "Pádel",
        category: "gestion_residuos",
        image: "https://images.unsplash.com/photo-1551958219-acbc595d66cf?w=600&q=80",
        description: "Torneo regional de pádel con sistema de cero residuos: sin plásticos de un solo uso y compostaje en cancha.",
        sustainableImpact: "100% residuos reciclados, 0 plásticos de un solo uso",
        budget: 35000,
        funded: 20000,
        remaining: 15000,
        daysLeft: 18,
        sealEsg: false,
        audience: 3500,
        status: "negotiating"
    },
    {
        id: "e10",
        title: "Escuela de Natación Comunitaria",
        clubId: "c5",
        clubName: "Natación Inclusiva",
        country: "Colombia",
        flag: "🇨🇴",
        sport: "Natación",
        category: "inclusion",
        image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80",
        description: "Escuela de natación gratuita para niños de zonas vulnerables, con énfasis en seguridad acuática y deporte inclusivo.",
        sustainableImpact: "300 niños aprenden a nadar, reducción de accidentes acuáticos",
        budget: 28000,
        funded: 28000,
        remaining: 0,
        daysLeft: 0,
        sponsoredBy: [
            "Fondo Nacional Deportivo",
            "Coldeportes"
        ],
        sealEsg: true,
        audience: 4500,
        status: "funded"
    }
];
const mockESGProjects = [
    {
        id: "p1",
        title: "Reducción huella de carbono 2025",
        category: "huella_carbono",
        status: "in_progress",
        progress: 65,
        budget: 45000,
        spent: 29250,
        startDate: "2025-01-15",
        endDate: "2025-12-31",
        responsible: "Carlos Mendoza",
        description: "Reducir las emisiones de CO2 del club en un 40% mediante energías renovables y movilidad sostenible.",
        milestones: [
            {
                id: "m1",
                title: "Auditoría inicial de emisiones",
                date: "2025-02-01",
                completed: true
            },
            {
                id: "m2",
                title: "Instalación paneles solares",
                date: "2025-05-01",
                completed: true
            },
            {
                id: "m3",
                title: "Flota vehículos eléctricos",
                date: "2025-08-01",
                completed: false
            },
            {
                id: "m4",
                title: "Certificación ISO 14001",
                date: "2025-12-01",
                completed: false
            }
        ],
        kpis: [
            {
                id: "k1",
                name: "Emisiones CO2 (ton)",
                current: 24,
                target: 18,
                unit: "ton",
                trend: "down"
            },
            {
                id: "k2",
                name: "Energía renovable (%)",
                current: 65,
                target: 100,
                unit: "%",
                trend: "up"
            }
        ]
    },
    {
        id: "p2",
        title: "Programa inclusión social 2025",
        category: "inclusion",
        status: "in_progress",
        progress: 80,
        budget: 28000,
        spent: 22400,
        startDate: "2025-03-01",
        endDate: "2025-11-30",
        responsible: "Ana Ruiz",
        description: "Incorporar 200 personas en situación de vulnerabilidad al deporte.",
        milestones: [
            {
                id: "m5",
                title: "Convenio municipalidad",
                date: "2025-03-15",
                completed: true
            },
            {
                id: "m6",
                title: "Primera cohorte inscrita",
                date: "2025-04-15",
                completed: true
            },
            {
                id: "m7",
                title: "Evaluación semestral",
                date: "2025-08-30",
                completed: true
            },
            {
                id: "m8",
                title: "Informe final y certificación",
                date: "2025-11-30",
                completed: false
            }
        ],
        kpis: [
            {
                id: "k3",
                name: "Personas incluidas",
                current: 160,
                target: 200,
                unit: "personas",
                trend: "up"
            },
            {
                id: "k4",
                name: "Tasa retención (%)",
                current: 82,
                target: 80,
                unit: "%",
                trend: "up"
            }
        ]
    },
    {
        id: "p3",
        title: "Gestión hídrica instalaciones",
        category: "huella_hidrica",
        status: "planning",
        progress: 20,
        budget: 18000,
        spent: 3600,
        startDate: "2025-09-01",
        endDate: "2026-03-31",
        responsible: "Pedro Soto",
        description: "Optimizar el uso del agua en canchas e instalaciones deportivas.",
        milestones: [
            {
                id: "m9",
                title: "Auditoría hídrica",
                date: "2025-09-30",
                completed: true
            },
            {
                id: "m10",
                title: "Sistema captación agua lluvia",
                date: "2025-12-01",
                completed: false
            },
            {
                id: "m11",
                title: "Riego inteligente",
                date: "2026-02-01",
                completed: false
            }
        ],
        kpis: [
            {
                id: "k5",
                name: "Consumo agua (m³/mes)",
                current: 1200,
                target: 800,
                unit: "m³",
                trend: "down"
            }
        ]
    },
    {
        id: "p4",
        title: "Equidad de género en directiva 2025",
        category: "equidad_genero",
        status: "in_progress",
        progress: 50,
        budget: 12000,
        spent: 6000,
        startDate: "2025-04-01",
        endDate: "2025-12-31",
        responsible: "María Torres",
        description: "Implementar política de género para alcanzar 40% de participación femenina en órganos directivos.",
        milestones: [
            {
                id: "m12",
                title: "Diagnóstico de brechas de género",
                date: "2025-04-30",
                completed: true
            },
            {
                id: "m13",
                title: "Política de género aprobada en asamblea",
                date: "2025-06-30",
                completed: true
            },
            {
                id: "m14",
                title: "Elecciones con cupo femenino",
                date: "2025-09-30",
                completed: false
            },
            {
                id: "m15",
                title: "Informe de cumplimiento anual",
                date: "2025-12-15",
                completed: false
            }
        ],
        kpis: [
            {
                id: "k6",
                name: "Mujeres en directiva (%)",
                current: 25,
                target: 40,
                unit: "%",
                trend: "up"
            },
            {
                id: "k7",
                name: "Deportistas femeninas activas",
                current: 85,
                target: 120,
                unit: "personas",
                trend: "up"
            }
        ]
    },
    {
        id: "p5",
        title: "Educación ambiental categorías menores",
        category: "educacion",
        status: "completed",
        progress: 100,
        budget: 8500,
        spent: 8200,
        startDate: "2025-02-01",
        endDate: "2025-07-31",
        responsible: "Sofía Morales",
        description: "Programa de 6 meses de educación ambiental para atletas menores de 18 años.",
        milestones: [
            {
                id: "m16",
                title: "Diseño curricular del programa",
                date: "2025-02-28",
                completed: true
            },
            {
                id: "m17",
                title: "Capacitación de monitores",
                date: "2025-03-31",
                completed: true
            },
            {
                id: "m18",
                title: "Implementación del programa",
                date: "2025-06-30",
                completed: true
            },
            {
                id: "m19",
                title: "Evaluación final y certificación",
                date: "2025-07-31",
                completed: true
            }
        ],
        kpis: [
            {
                id: "k8",
                name: "Jóvenes capacitados",
                current: 124,
                target: 100,
                unit: "personas",
                trend: "up"
            },
            {
                id: "k9",
                name: "Talleres realizados",
                current: 18,
                target: 18,
                unit: "talleres",
                trend: "stable"
            }
        ]
    }
];
const mockDocuments = [
    {
        id: "d1",
        name: "Política ESG Club Rugby Chile 2025.pdf",
        type: "pdf",
        category: "Política ESG",
        size: "2.4 MB",
        uploadedAt: "2025-01-10",
        uploadedBy: "Felipe González",
        version: "v2.0"
    },
    {
        id: "d2",
        name: "Reporte Carbono Q1 2025.xlsx",
        type: "xls",
        category: "Ambiental",
        size: "845 KB",
        uploadedAt: "2025-04-05",
        uploadedBy: "Carlos Mendoza",
        version: "v1.0"
    },
    {
        id: "d3",
        name: "Certificado ISO 14001 Borrador.pdf",
        type: "pdf",
        category: "Certificaciones",
        size: "1.2 MB",
        uploadedAt: "2025-05-20",
        uploadedBy: "Felipe González",
        version: "v1.0"
    },
    {
        id: "d4",
        name: "Evidencias inclusión social - fotos.zip",
        type: "img",
        category: "Social",
        size: "18.5 MB",
        uploadedAt: "2025-06-01",
        uploadedBy: "Ana Ruiz",
        version: "v1.0"
    },
    {
        id: "d5",
        name: "Presupuesto proyectos ESG 2025.xlsx",
        type: "xls",
        category: "Financiero",
        size: "320 KB",
        uploadedAt: "2025-01-05",
        uploadedBy: "Pedro Soto",
        version: "v3.1"
    }
];
const mockNotifications = [
    {
        id: "n1",
        type: "success",
        title: "Propuesta aceptada",
        message: "Claro aceptó tu propuesta de patrocinio para 'Descarbonizando el rugby'",
        time: "Hace 2 horas",
        read: false
    },
    {
        id: "n2",
        type: "warning",
        title: "KPI fuera de meta",
        message: "El indicador de consumo hídrico supera el límite mensual",
        time: "Hace 5 horas",
        read: false
    },
    {
        id: "n3",
        type: "info",
        title: "Nueva propuesta recibida",
        message: "ESPN envió una propuesta de media partner para 'Agua para el fútbol'",
        time: "Hace 1 día",
        read: true
    },
    {
        id: "n4",
        type: "info",
        title: "Ranking actualizado",
        message: "Tu club subió al puesto #4 en el ranking de sostenibilidad",
        time: "Hace 2 días",
        read: true
    }
];
const categoryLabels = {
    huella_hidrica: "Huella hídrica",
    huella_carbono: "Huella de carbono",
    gestion_residuos: "Gestión de residuos",
    educacion: "Educación",
    inclusion: "Inclusión",
    equidad_genero: "Equidad de género"
};
const categoryColors = {
    huella_hidrica: "badge-cyan",
    huella_carbono: "badge-green",
    gestion_residuos: "badge-orange",
    educacion: "badge-blue",
    inclusion: "badge-purple",
    equidad_genero: "badge-red"
};
const categoryIcons = {
    huella_hidrica: "💧",
    huella_carbono: "🌱",
    gestion_residuos: "♻️",
    educacion: "📚",
    inclusion: "🤝",
    equidad_genero: "⚖️"
};
const solutionCategoryLabels = {
    eficiencia_hidrica: "Eficiencia hídrica",
    eficiencia_energetica: "Eficiencia energética",
    gestion_residuos: "Gestión de residuos",
    educacion_ambiental: "Educación ambiental",
    impacto_social: "Impacto social",
    movilidad_sostenible: "Movilidad sostenible"
};
const solutionCategoryIcons = {
    eficiencia_hidrica: "💧",
    eficiencia_energetica: "⚡",
    gestion_residuos: "♻️",
    educacion_ambiental: "🌿",
    impacto_social: "🤝",
    movilidad_sostenible: "🚲"
};
const mockSolutionProviders = [
    {
        id: "sp1",
        name: "AquaTech Solutions",
        initials: "AT",
        color: "#0EA5E9",
        category: "eficiencia_hidrica",
        country: "Chile",
        flag: "🇨🇱",
        description: "Especialistas en sistemas de captura y reutilización de agua pluvial para estadios y recintos deportivos. Reducimos hasta un 60% el consumo hídrico.",
        services: [
            "Auditoría hídrica",
            "Sistemas de captación",
            "Monitoreo IoT",
            "Certificación hídrica"
        ],
        projectsCount: 50,
        associatedBrand: "Claro",
        associatedClub: "Universidad de Chile",
        stars: 5,
        verified: true,
        featured: true,
        tags: [
            "IoT",
            "Estadios",
            "Certificación"
        ]
    },
    {
        id: "sp2",
        name: "GreenEnergy Sport",
        initials: "GE",
        color: "#10B981",
        category: "eficiencia_energetica",
        country: "Argentina",
        flag: "🇦🇷",
        description: "Instalación de paneles solares y sistemas de iluminación LED de alta eficiencia para instalaciones deportivas. Partner oficial de la ANFP.",
        services: [
            "Paneles solares",
            "LED deportivo",
            "Auditoría energética",
            "Compensación CO₂"
        ],
        projectsCount: 45,
        associatedBrand: "ESPN",
        associatedClub: "Boca Juniors",
        stars: 4,
        verified: true,
        featured: true,
        tags: [
            "Solar",
            "LED",
            "ANFP"
        ]
    },
    {
        id: "sp3",
        name: "Ciclo Verde",
        initials: "CV",
        color: "#F59E0B",
        category: "gestion_residuos",
        country: "Chile",
        flag: "🇨🇱",
        description: "Gestión integral de residuos en eventos deportivos masivos. Implementamos estaciones de clasificación, compostaje y economía circular en estadios.",
        services: [
            "Plan de residuos cero",
            "Estaciones de reciclaje",
            "Compostaje orgánico",
            "Reporte de impacto"
        ],
        projectsCount: 40,
        associatedBrand: "VTR",
        associatedClub: "Colo-Colo",
        stars: 4,
        verified: true,
        tags: [
            "Eventos",
            "Reciclaje",
            "Economía circular"
        ]
    },
    {
        id: "sp4",
        name: "EduSport Sostenible",
        initials: "ES",
        color: "#8B5CF6",
        category: "educacion_ambiental",
        country: "Chile",
        flag: "🇨🇱",
        description: "Programas educativos sobre sostenibilidad y medioambiente dirigidos a clubes, federaciones y comunidades deportivas de toda Latinoamérica.",
        services: [
            "Talleres formativos",
            "Curriculum ESG para clubes",
            "Campañas de sensibilización",
            "Certificados de formación"
        ],
        projectsCount: 30,
        associatedBrand: "Itaú",
        associatedClub: "La Serena",
        stars: 4,
        verified: true,
        featured: true,
        tags: [
            "Formación",
            "LATAM",
            "Certificados"
        ]
    },
    {
        id: "sp5",
        name: "MoviSport",
        initials: "MS",
        color: "#06B6D4",
        category: "movilidad_sostenible",
        country: "Chile",
        flag: "🇨🇱",
        description: "Implementamos planes de movilidad sostenible para recintos deportivos: bicicleteros, zonas de carga eléctrica y convenios con apps de transporte compartido.",
        services: [
            "Bicicleteros seguros",
            "Carga vehículos eléctricos",
            "Parkings inteligentes",
            "Plan de movilidad"
        ],
        projectsCount: 25,
        associatedBrand: "Pemex",
        associatedClub: "Atlético Nacional",
        stars: 4,
        verified: true,
        tags: [
            "Bicicleta",
            "Eléctrico",
            "Smart parking"
        ]
    },
    {
        id: "sp6",
        name: "ImpactoClub",
        initials: "IC",
        color: "#EC4899",
        category: "impacto_social",
        country: "México",
        flag: "🇲🇽",
        description: "Diseñamos programas de inclusión, diversidad y equidad de género para organizaciones deportivas, con métricas de impacto social certificadas.",
        services: [
            "Diagnóstico DEI",
            "Programas de inclusión",
            "Métricas de impacto",
            "Reportes sociales"
        ],
        projectsCount: 23,
        associatedBrand: "Águila",
        associatedClub: "América de Cali",
        stars: 4,
        verified: true,
        tags: [
            "DEI",
            "Inclusión",
            "Métricas"
        ]
    },
    {
        id: "sp7",
        name: "HidroSport CL",
        initials: "HS",
        color: "#0284C7",
        category: "eficiencia_hidrica",
        country: "Chile",
        flag: "🇨🇱",
        description: "Sistemas de riego inteligente y mantenimiento de canchas con mínimo consumo de agua. Especialistas en campos de fútbol y tenis.",
        services: [
            "Riego inteligente",
            "Sensores de humedad",
            "Mantenimiento césped",
            "Reciclaje de agua"
        ],
        projectsCount: 18,
        associatedBrand: "Claro",
        associatedClub: "Huachipato",
        stars: 3,
        verified: true,
        tags: [
            "Riego",
            "Fútbol",
            "Tenis"
        ]
    },
    {
        id: "sp8",
        name: "SolarStadium",
        initials: "SS",
        color: "#F97316",
        category: "eficiencia_energetica",
        country: "España",
        flag: "🇪🇸",
        description: "Referentes europeos en energía renovable para estadios y pabellones deportivos. Proyectos en más de 40 recintos en Europa y Latinoamérica.",
        services: [
            "Plantas solares",
            "Baterías de almacenamiento",
            "Power Purchase Agreement",
            "Carbon neutral"
        ],
        projectsCount: 15,
        associatedBrand: "ESPN",
        associatedClub: "Barcelona SC",
        stars: 5,
        verified: true,
        featured: true,
        tags: [
            "Europa",
            "Carbon neutral",
            "PPA"
        ]
    },
    {
        id: "sp9",
        name: "ResidúOK",
        initials: "RO",
        color: "#84CC16",
        category: "gestion_residuos",
        country: "Chile",
        flag: "🇨🇱",
        description: "App y servicio de logística para la correcta disposición de residuos generados en torneos y eventos deportivos de cualquier escala.",
        services: [
            "App de trazabilidad",
            "Retiro programado",
            "Informe de disposición",
            "Certificados legales"
        ],
        projectsCount: 12,
        associatedBrand: "VTR",
        associatedClub: "O'Higgins",
        stars: 3,
        verified: true,
        tags: [
            "App",
            "Logística",
            "Certificados"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/leaf.js [app-client] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.js [app-client] (ecmascript) <export default as UserCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const features = [
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 12,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Gestión ESG",
        desc: "Monitorea y gestiona el desempeño ambiental, social y de gobernanza"
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 13,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Ranking Sostenible",
        desc: "Posiciona tu club en el ranking de clubes más sostenibles"
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 14,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Marketplace",
        desc: "Conecta con patrocinadores interesados en impacto sostenible"
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 15,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Motor IA",
        desc: "IA que genera tu estrategia ESG personalizada"
    }
];
const roleConfig = {
    admin: {
        label: "Administrador",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.12)",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 19,
            columnNumber: 93
        }, ("TURBOPACK compile-time value", void 0)),
        desc: "Acceso total a la plataforma"
    },
    club: {
        label: "Club Deportivo",
        color: "#10B981",
        bg: "rgba(16,185,129,0.12)",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 20,
            columnNumber: 93
        }, ("TURBOPACK compile-time value", void 0)),
        desc: "Gestión ESG del club"
    },
    brand: {
        label: "Marca",
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.12)",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 21,
            columnNumber: 93
        }, ("TURBOPACK compile-time value", void 0)),
        desc: "Patrocinios y eventos"
    },
    manager: {
        label: "Consultor ESG",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 22,
            columnNumber: 93
        }, ("TURBOPACK compile-time value", void 0)),
        desc: "Gestiona múltiples clubes"
    },
    auditor: {
        label: "Auditor ESG",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.12)",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__["UserCircle2"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 23,
            columnNumber: 93
        }, ("TURBOPACK compile-time value", void 0)),
        desc: "Revisión y verificación ESG"
    }
};
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("felipe@clubrugby.cl");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("password123");
    const [showPass, setShowPass] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDemo, setShowDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDemo, setSelectedDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleLogin = async (e)=>{
        e.preventDefault();
        setLoading(true);
        const found = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"].find((u)=>u.email === email);
        if (found) {
            localStorage.setItem("bettersport_user", found.id);
            localStorage.removeItem("bettersport_user_data");
        }
        await new Promise((r)=>setTimeout(r, 1000));
        router.push("/dashboard");
    };
    const loginAs = async (user)=>{
        setSelectedDemo(user);
        setEmail(user.email);
        localStorage.setItem("bettersport_user", user.id);
        localStorage.removeItem("bettersport_user_data");
        await new Promise((r)=>setTimeout(r, 700));
        router.push("/dashboard");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex",
        style: {
            backgroundColor: "#f8fafc"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "linear-gradient(135deg, #0D1E35 0%, #0B1628 100%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 left-0 w-96 h-96 rounded-full opacity-10",
                        style: {
                            background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
                            filter: "blur(60px)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10",
                        style: {
                            background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
                            filter: "blur(60px)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.svg",
                            alt: "BetterSport",
                            className: "h-9 w-auto object-contain",
                            style: {
                                filter: "brightness(0) invert(1)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 30
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: 0.6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-4xl font-bold text-white leading-tight mb-4",
                                        style: {
                                            fontFamily: "'Manrope', sans-serif"
                                        },
                                        children: [
                                            "La plataforma ESG",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 32
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gradient",
                                                children: "para el deporte sostenible"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white/60 text-lg leading-relaxed max-w-md",
                                        children: "Gestiona proyectos, conecta con patrocinadores y lidera el ranking de clubes más sostenibles de Latinoamérica."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4 mt-10",
                                children: features.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            duration: 0.4,
                                            delay: 0.2 + i * 0.1
                                        },
                                        className: "p-4 rounded-2xl",
                                        style: {
                                            backgroundColor: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.1)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                                                style: {
                                                    backgroundColor: "rgba(16,185,129,0.15)",
                                                    color: "#10B981"
                                                },
                                                children: f.icon
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-white",
                                                children: f.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/50 mt-1 leading-relaxed",
                                                children: f.desc
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, f.title, true, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 flex items-center gap-6",
                        children: [
                            {
                                n: "500+",
                                l: "Clubes"
                            },
                            {
                                n: "1.2K",
                                l: "Proyectos"
                            },
                            {
                                n: "$2.5M",
                                l: "Patrocinios"
                            }
                        ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-2xl font-bold text-gradient",
                                        children: s.n
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/50 mt-0.5",
                                        children: s.l
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, s.l, true, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center justify-center p-8 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.97
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    transition: {
                        duration: 0.4
                    },
                    className: "w-full max-w-lg py-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:hidden flex justify-center mb-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/logo.svg",
                                alt: "BetterSport",
                                className: "h-9 w-auto object-contain"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card p-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-slate-900",
                                            style: {
                                                fontFamily: "'Manrope', sans-serif"
                                            },
                                            children: "Bienvenido de vuelta"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-400 text-sm mt-2",
                                            children: "Ingresa tus credenciales para continuar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleLogin,
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2.5",
                                                    children: "Correo electrónico"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    className: "input-field",
                                                    placeholder: "tu@club.com",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2.5",
                                                    children: "Contraseña"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: showPass ? "text" : "password",
                                                            value: password,
                                                            onChange: (e)=>setPassword(e.target.value),
                                                            className: "input-field pr-10",
                                                            placeholder: "••••••••",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/login/page.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setShowPass(!showPass),
                                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors",
                                                            children: showPass ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/login/page.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 33
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/login/page.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 56
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/login/page.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end mt-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "text-xs text-teal-600 hover:text-teal-500 transition-colors",
                                                        children: "¿Olvidaste tu contraseña?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/login/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: loading,
                                            className: "w-full h-14 rounded-2xl font-semibold text-slate-800 flex items-center justify-center gap-2 text-base transition-all duration-200 disabled:opacity-70",
                                            style: {
                                                background: "linear-gradient(135deg, #10B981, #06B6D4)",
                                                boxShadow: "0 0 24px rgba(16,185,129,0.3)"
                                            },
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 177,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    "Iniciar sesión",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/login/page.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-8 pt-6 border-t border-slate-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center text-sm text-slate-400",
                                        children: [
                                            "¿No tienes cuenta?",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/register",
                                                className: "text-teal-600 hover:text-teal-500 font-medium transition-colors",
                                                children: "Registra tu club"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDemo(!showDemo),
                                    className: "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-medium transition-all",
                                    style: {
                                        backgroundColor: "#f1f5f9",
                                        border: "1px solid #e2e8f0",
                                        color: "#475569"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__["UserCircle2"], {
                                                    size: 16,
                                                    className: "text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, this),
                                                "Acceso rápido demo — elige un perfil"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            animate: {
                                                rotate: showDemo ? 180 : 0
                                            },
                                            transition: {
                                                duration: 0.2
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                size: 16,
                                                className: "text-slate-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    children: showDemo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: -8,
                                            height: 0
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0,
                                            height: "auto"
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: -8,
                                            height: 0
                                        },
                                        className: "overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 space-y-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"].map((user, i)=>{
                                                const rc = roleConfig[user.role];
                                                const isSelected = selectedDemo?.id === user.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                    initial: {
                                                        opacity: 0,
                                                        x: -10
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        x: 0
                                                    },
                                                    transition: {
                                                        delay: i * 0.06
                                                    },
                                                    onClick: ()=>loginAs(user),
                                                    disabled: isSelected,
                                                    className: "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.01] disabled:opacity-70",
                                                    style: {
                                                        backgroundColor: isSelected ? rc.bg : "#f8fafc",
                                                        border: `1px solid ${isSelected ? rc.color + "50" : "#e2e8f0"}`
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-xl flex items-center justify-center text-slate-800 font-bold text-sm flex-shrink-0",
                                                            style: {
                                                                background: `linear-gradient(135deg, ${rc.color}, ${rc.color}88)`
                                                            },
                                                            children: user.name.charAt(0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/login/page.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 flex-wrap",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold text-slate-900",
                                                                            children: user.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/login/page.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1",
                                                                            style: {
                                                                                backgroundColor: rc.bg,
                                                                                color: rc.color,
                                                                                border: `1px solid ${rc.color}40`
                                                                            },
                                                                            children: [
                                                                                rc.icon,
                                                                                " ",
                                                                                rc.label
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/login/page.tsx",
                                                                            lineNumber: 248,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/login/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-400 mt-0.5 truncate",
                                                                    children: user.email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/login/page.tsx",
                                                                    lineNumber: 255,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs mt-0.5",
                                                                    style: {
                                                                        color: rc.color + "99"
                                                                    },
                                                                    children: rc.desc
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/login/page.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/login/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-shrink-0",
                                                            children: isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-4 h-4 rounded-full border-2 border-white/20 animate-spin",
                                                                style: {
                                                                    borderTopColor: rc.color
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/login/page.tsx",
                                                                lineNumber: 260,
                                                                columnNumber: 31
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                size: 14,
                                                                className: "text-slate-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/login/page.tsx",
                                                                lineNumber: 262,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/login/page.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, user.id, true, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/login/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "Hh3a0Wt4+A/wOsZ/NJq1IImkfa0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d8aff86c._.js.map