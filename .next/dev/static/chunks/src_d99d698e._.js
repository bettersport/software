(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency,
    "formatPercent",
    ()=>formatPercent,
    "getProgressColor",
    ()=>getProgressColor,
    "getRankingMedal",
    ()=>getRankingMedal,
    "getStatusColor",
    ()=>getStatusColor,
    "getStatusLabel",
    ()=>getStatusLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount, currency = "$") {
    return `${amount.toLocaleString("es-CL")} ${currency}`;
}
function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}
function getProgressColor(value) {
    if (value >= 80) return "#10B981";
    if (value >= 60) return "#F59E0B";
    return "#EF4444";
}
function getStatusColor(status) {
    const map = {
        in_progress: "badge-cyan",
        completed: "badge-green",
        planning: "badge-blue",
        paused: "badge-orange",
        open: "badge-green",
        negotiating: "badge-orange",
        funded: "badge-cyan",
        closed: "badge-red"
    };
    return map[status] || "badge-blue";
}
function getStatusLabel(status) {
    const map = {
        in_progress: "En progreso",
        completed: "Completado",
        planning: "Planificación",
        paused: "Pausado",
        open: "Abierto",
        negotiating: "En negociación",
        funded: "Financiado",
        closed: "Cerrado",
        received: "Recibido",
        accepted: "Aceptado",
        rejected: "Rechazado"
    };
    return map[status] || status;
}
function getRankingMedal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/lib/userContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProvider",
    ()=>UserProvider,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    activeUser: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][0],
    setActiveUser: ()=>{}
});
function UserProvider({ children }) {
    _s();
    const [activeUser, setActiveUserState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][0]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProvider.useEffect": ()=>{
            // First try to load full user data (includes profile edits)
            const storedData = localStorage.getItem("bettersport_user_data");
            if (storedData) {
                try {
                    setActiveUserState(JSON.parse(storedData));
                    return;
                } catch  {}
            }
            // Fallback: load by ID from mockUsers
            const stored = localStorage.getItem("bettersport_user");
            if (stored) {
                const found = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"].find({
                    "UserProvider.useEffect.found": (u)=>u.id === stored
                }["UserProvider.useEffect.found"]);
                if (found) setActiveUserState(found);
            }
        }
    }["UserProvider.useEffect"], []);
    const setActiveUser = (user)=>{
        setActiveUserState(user);
        localStorage.setItem("bettersport_user", user.id);
        localStorage.setItem("bettersport_user_data", JSON.stringify(user));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserContext.Provider, {
        value: {
            activeUser,
            setActiveUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/userContext.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(UserProvider, "hUs+Q8BhHvShLWWo+6IWpg2sw2E=");
_c = UserProvider;
const useUser = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
};
_s1(useUser, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "UserProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/leaf.js [app-client] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/userContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const allRoles = [
    "admin",
    "club",
    "brand",
    "manager",
    "auditor"
];
const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 48,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: allRoles
    },
    {
        label: "Ranking",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 53,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: allRoles,
        children: [
            {
                label: "Clubes",
                href: "/ranking",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 56,
                    columnNumber: 50
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Soluciones",
                href: "/solutions",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 57,
                    columnNumber: 56
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Mi posición",
                href: "/ranking/position",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 58,
                    columnNumber: 64
                }, ("TURBOPACK compile-time value", void 0)),
                roles: [
                    "club",
                    "admin",
                    "manager"
                ]
            }
        ]
    },
    {
        label: "Proyectos de alto impacto",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 63,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin",
            "club",
            "brand",
            "manager"
        ],
        children: [
            {
                label: "Proyectos sostenibles",
                href: "/marketplace",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 66,
                    columnNumber: 69
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Mis eventos",
                href: "/marketplace/my-events",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 67,
                    columnNumber: 69
                }, ("TURBOPACK compile-time value", void 0)),
                roles: [
                    "club",
                    "admin",
                    "manager"
                ]
            },
            {
                label: "Proyectos realizados",
                href: "/marketplace/completed",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 68,
                    columnNumber: 78
                }, ("TURBOPACK compile-time value", void 0)),
                roles: [
                    "club",
                    "admin",
                    "manager"
                ]
            }
        ]
    },
    {
        label: "Marcas",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 73,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin",
            "brand"
        ],
        children: [
            {
                label: "Ranking clubes",
                href: "/brands/ranking",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 76,
                    columnNumber: 65
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Proyectos sostenibles",
                href: "/brands/projects",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 77,
                    columnNumber: 73
                }, ("TURBOPACK compile-time value", void 0))
            }
        ]
    },
    {
        label: "Gestión ESG",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 82,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin",
            "club",
            "manager"
        ],
        children: [
            {
                label: "Mis proyectos",
                href: "/esg/projects",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 85,
                    columnNumber: 62
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "KPIs e indicadores",
                href: "/esg/kpis",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 86,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Gestión documental",
                href: "/esg/documents",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 87,
                    columnNumber: 68
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Presupuesto",
                href: "/esg/budget",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 88,
                    columnNumber: 58
                }, ("TURBOPACK compile-time value", void 0))
            }
        ]
    },
    {
        label: "Auditoría",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 93,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin",
            "auditor"
        ],
        children: [
            {
                label: "Verificar clubes",
                href: "/ranking",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 96,
                    columnNumber: 60
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Documentos",
                href: "/esg/documents",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 97,
                    columnNumber: 60
                }, ("TURBOPACK compile-time value", void 0))
            }
        ]
    },
    {
        label: "Motor IA",
        href: "/ai-strategy",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 103,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin",
            "club",
            "manager"
        ]
    },
    {
        label: "Mi Club",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 108,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "club"
        ],
        children: [
            {
                label: "Perfil del club",
                href: "/club/profile",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 111,
                    columnNumber: 64
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Configuración",
                href: "/club/settings",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 112,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0))
            }
        ]
    },
    {
        label: "Administración",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 117,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        roles: [
            "admin"
        ],
        children: [
            {
                label: "Todos los clubes",
                href: "/ranking",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 120,
                    columnNumber: 60
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                label: "Configuración",
                href: "/club/settings",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 121,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0))
            }
        ]
    }
];
const partners = [
    {
        name: "Claro",
        initials: "CL"
    },
    {
        name: "Rugby CL",
        initials: "RC"
    },
    {
        name: "ESPN",
        initials: "ES"
    },
    {
        name: "VTR",
        initials: "VT"
    }
];
function Sidebar({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { activeUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [openMenus, setOpenMenus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "Ranking",
        "Marketplace",
        "Marcas"
    ]);
    // Auto-close drawer on mobile when navigating
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            if (mobileOpen && onMobileClose) onMobileClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Sidebar.useEffect"], [
        pathname
    ]);
    const toggleMenu = (label)=>{
        setOpenMenus((prev)=>prev.includes(label) ? prev.filter((m)=>m !== label) : [
                ...prev,
                label
            ]);
    };
    const isActive = (href)=>{
        if (!href) return false;
        return pathname === href || pathname.startsWith(href + "/");
    };
    // Filtrar items según el rol del usuario activo
    const filteredNavItems = navItems.filter((item)=>!item.roles || item.roles.includes(activeUser.role)).map((item)=>({
            ...item,
            children: item.children?.filter((child)=>!child.roles || child.roles.includes(activeUser.role))
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("sidebar-bg h-screen flex flex-col overflow-hidden transition-all duration-300", // Mobile: fixed overlay drawer
        "fixed inset-y-0 left-0 z-50 lg:static lg:z-30", // Width: always 272px on mobile, collapsible on desktop
        "w-[272px]", collapsed ? "lg:w-16" : "lg:w-[272px]", // Slide in/out on mobile
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 px-4 py-5 flex items-center gap-2",
                style: {
                    borderBottom: "1px solid #E2E8F0"
                },
                children: [
                    collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                        style: {
                            background: "linear-gradient(135deg, #10B981, #06B6D4)"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
                            size: 18,
                            color: "#fff"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            x: -10
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        className: "flex-1 min-w-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.svg",
                            alt: "BetterSport",
                            className: "h-8 w-auto object-contain"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggle,
                        className: "ml-auto flex-shrink-0 transition-colors rounded-md p-1 hover:bg-slate-100",
                        style: {
                            color: "#94A3B8"
                        },
                        children: collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 204,
                            columnNumber: 24
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 204,
                            columnNumber: 53
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 min-h-0 overflow-y-auto py-5 px-4 space-y-1",
                children: filteredNavItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItemComponent, {
                        item: item,
                        collapsed: collapsed,
                        isActive: isActive,
                        isOpen: openMenus.includes(item.label),
                        onToggle: ()=>toggleMenu(item.label)
                    }, item.label, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 p-4",
                style: {
                    borderTop: "1px solid #E2E8F0"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] mb-2.5 font-medium uppercase tracking-wider",
                        style: {
                            color: "#94A3B8"
                        },
                        children: "Partners"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: partners.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-7 px-2.5 rounded-md flex items-center justify-center text-[10px] font-semibold",
                                style: {
                                    backgroundColor: "#F1F5F9",
                                    color: "#64748B"
                                },
                                title: p.name,
                                children: p.initials
                            }, p.name, false, {
                                fileName: "[project]/src/components/layout/Sidebar.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Sidebar.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "SLMmalZMGCr9Guxqz9dgZ17kn4E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = Sidebar;
function NavItemComponent({ item, collapsed, isActive, isOpen, onToggle, level = 0 }) {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onToggle,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full nav-item justify-between", level > 0 && "pl-6"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-shrink-0",
                                    children: item.icon
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, this),
                                !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                                    lineNumber: 269,
                                    columnNumber: 28
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this),
                        !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            size: 14,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-transform duration-200", isOpen && "rotate-180")
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 272,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: isOpen && !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            height: 0,
                            opacity: 0
                        },
                        animate: {
                            height: "auto",
                            opacity: 1
                        },
                        exit: {
                            height: 0,
                            opacity: 0
                        },
                        transition: {
                            duration: 0.2
                        },
                        className: "overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-4 mt-0.5 space-y-0.5",
                            children: item.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: child.href || "#",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("nav-item pl-3 border border-transparent", isActive(child.href) && "nav-item-active"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-shrink-0",
                                            children: child.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                                            lineNumber: 298,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: child.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                                            lineNumber: 299,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, child.label, true, {
                                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                                    lineNumber: 290,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.tsx",
                            lineNumber: 288,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 281,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.tsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Sidebar.tsx",
            lineNumber: 259,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: item.href || "#",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("nav-item border border-transparent", active && "nav-item-active", level > 0 && "pl-6"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex-shrink-0",
                children: item.icon
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: item.label
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 320,
                columnNumber: 22
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Sidebar.tsx",
        lineNumber: 311,
        columnNumber: 5
    }, this);
}
_c1 = NavItemComponent;
var _c, _c1;
__turbopack_context__.k.register(_c, "Sidebar");
__turbopack_context__.k.register(_c1, "NavItemComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.js [app-client] (ecmascript) <export default as UserCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/userContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const roleConfig = {
    admin: {
        label: "Administrador",
        badge: "badge-purple",
        color: "#8B5CF6"
    },
    club: {
        label: "Club Deportivo",
        badge: "badge-green",
        color: "#10B981"
    },
    brand: {
        label: "Marca",
        badge: "badge-cyan",
        color: "#06B6D4"
    },
    manager: {
        label: "Consultor ESG",
        badge: "badge-orange",
        color: "#F59E0B"
    },
    auditor: {
        label: "Auditor ESG",
        badge: "badge-blue",
        color: "#3B82F6"
    }
};
function TopBar({ onMobileMenuToggle }) {
    _s();
    const { activeUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showNotifs, setShowNotifs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showUser, setShowUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const role = roleConfig[activeUser.role] ?? roleConfig.club;
    const unreadCount = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockNotifications"].filter((n)=>!n.read).length;
    const handleLogout = ()=>{
        localStorage.removeItem("bettersport_user");
        router.push("/login");
    };
    const notifTypeColors = {
        success: "text-emerald-400",
        warning: "text-amber-400",
        error: "text-red-400",
        info: "text-blue-400"
    };
    const notifDotColors = {
        success: "bg-emerald-400",
        warning: "bg-amber-400",
        error: "bg-red-400",
        info: "bg-blue-400"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "topbar-bg h-14 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "lg:hidden btn-ghost h-9 w-9 p-0 justify-center flex-shrink-0",
                onClick: onMobileMenuToggle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/TopBar.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/TopBar.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden sm:flex flex-1 max-w-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            size: 15,
                            className: "absolute left-3 top-1/2 -translate-y-1/2",
                            style: {
                                color: "#94A3B8"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/TopBar.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Buscar proyectos...",
                            value: search,
                            onChange: (e)=>setSearch(e.target.value),
                            className: "input-field pl-9 h-9"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/TopBar.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/TopBar.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/TopBar.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 ml-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowNotifs(!showNotifs);
                                    setShowUser(false);
                                },
                                className: "btn-ghost h-9 w-9 p-0 justify-center rounded-lg relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold",
                                        style: {
                                            backgroundColor: "#10B981",
                                            color: "#fff"
                                        },
                                        children: unreadCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: showNotifs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 8,
                                        scale: 0.95
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 8,
                                        scale: 0.95
                                    },
                                    transition: {
                                        duration: 0.15
                                    },
                                    className: "absolute right-0 top-12 w-80 card z-50 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 flex items-center justify-between",
                                            style: {
                                                borderBottom: "1px solid #f1f5f9"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-sm",
                                                    style: {
                                                        color: "#0f172a"
                                                    },
                                                    children: "Notificaciones"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "badge badge-green text-xs",
                                                    children: [
                                                        unreadCount,
                                                        " nuevas"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-h-80 overflow-y-auto",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockNotifications"].map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 hover:bg-slate-50 transition-colors cursor-pointer", !notif.read && "bg-slate-50/50"),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", notifDotColors[notif.type])
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                lineNumber: 121,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium", notifTypeColors[notif.type]),
                                                                        children: notif.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                        lineNumber: 123,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs mt-0.5 leading-relaxed",
                                                                        style: {
                                                                            color: "#64748b"
                                                                        },
                                                                        children: notif.message
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                        lineNumber: 124,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs mt-1",
                                                                        style: {
                                                                            color: "#94a3b8"
                                                                        },
                                                                        children: notif.time
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                        lineNumber: 125,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                lineNumber: 122,
                                                                columnNumber: 25
                                                            }, this),
                                                            !notif.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1",
                                                                style: {
                                                                    backgroundColor: "#10B981"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 23
                                                    }, this)
                                                }, notif.id, false, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "text-xs font-medium transition-colors",
                                                style: {
                                                    color: "#3B82F6"
                                                },
                                                children: "Ver todas las notificaciones"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopBar.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowUser(!showUser);
                                    setShowNotifs(false);
                                },
                                className: "flex items-center gap-2.5 h-9 px-2.5 rounded-lg hover:bg-slate-100 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                                        style: {
                                            background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`,
                                            color: "#fff"
                                        },
                                        children: activeUser.name.charAt(0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:block text-sm font-medium",
                                        style: {
                                            color: "#0f172a"
                                        },
                                        children: activeUser.name.split(" ")[0]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        size: 12,
                                        style: {
                                            color: "#94a3b8"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: showUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 8,
                                        scale: 0.95
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 8,
                                        scale: 0.95
                                    },
                                    transition: {
                                        duration: 0.15
                                    },
                                    className: "absolute right-0 top-12 w-56 card py-2 z-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 py-3",
                                            style: {
                                                borderBottom: "1px solid #f1f5f9"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2.5 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                                                            style: {
                                                                background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`,
                                                                color: "#fff"
                                                            },
                                                            children: activeUser.name.charAt(0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold truncate",
                                                                    style: {
                                                                        color: "#0f172a"
                                                                    },
                                                                    children: activeUser.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs truncate",
                                                                    style: {
                                                                        color: "#94a3b8"
                                                                    },
                                                                    children: activeUser.email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                                    lineNumber: 173,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${role.badge} badge`,
                                                            children: role.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 21
                                                        }, this),
                                                        activeUser.country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs",
                                                            style: {
                                                                color: "#94a3b8"
                                                            },
                                                            children: activeUser.country
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 44
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 27
                                                }, this),
                                                label: "Mi perfil",
                                                href: "/club/profile"
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 27
                                                }, this),
                                                label: "Configuración",
                                                href: "/club/settings"
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__["UserCircle2"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 27
                                                }, this),
                                                label: "Cambiar perfil",
                                                href: "/login"
                                            }
                                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowUser(false);
                                                    router.push(item.href);
                                                },
                                                className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm transition-colors",
                                                style: {
                                                    color: "#64748b"
                                                },
                                                children: [
                                                    item.icon,
                                                    item.label
                                                ]
                                            }, item.label, true, {
                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                lineNumber: 186,
                                                columnNumber: 19
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 pt-1",
                                            style: {
                                                borderTop: "1px solid #f1f5f9"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleLogout,
                                                className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Cerrar sesión"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopBar.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/TopBar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/TopBar.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(TopBar, "R4eZv0IEOv6XI8sKwi7yc8SqbtU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/DashboardLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardLayout",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/userContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function DashboardLayout({ children }) {
    _s();
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$userContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen overflow-hidden",
            style: {
                backgroundColor: "#F8FAFC"
            },
            children: [
                mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden",
                    onClick: ()=>setMobileOpen(false)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                    lineNumber: 18,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                    collapsed: collapsed,
                    onToggle: ()=>setCollapsed(!collapsed),
                    mobileOpen: mobileOpen,
                    onMobileClose: ()=>setMobileOpen(false)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col overflow-hidden min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopBar"], {
                            onMobileMenuToggle: ()=>setMobileOpen(!mobileOpen)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 overflow-y-auto px-4 py-5 lg:px-10 lg:py-10",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "top-right",
                    toastOptions: {
                        style: {
                            background: "#ffffff",
                            color: "#0F172A",
                            border: "1px solid #E2E8F0",
                            borderRadius: "12px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                            fontSize: "13px"
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/DashboardLayout.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/DashboardLayout.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/DashboardLayout.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(DashboardLayout, "GnP+wY0xscbaVuLLxvQnaTKQ8AU=");
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d99d698e._.js.map