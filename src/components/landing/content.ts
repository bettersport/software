/**
 * Contenido de la web pública en español e inglés.
 * Fuente: documento "Ajustes WEB 23.10" (Felipe Villarino).
 * Todo el copy vive aquí para que editarlo no implique tocar el diseño.
 */

export type Lang = "es" | "en";

export const VIDEOS = [
  { id: "6EleXoV-tKc", cat: { es: "Fútbol", en: "Football" }, title: { es: "Copa de Verano en Coquimbo: primer torneo de fútbol sostenible", en: "Coquimbo Summer Cup: the first sustainable football tournament" } },
  { id: "-pkmmhlGGgs", cat: { es: "Fútbol", en: "Football" }, title: { es: "El fútbol de verano limpia playas y crea conciencia", en: "Summer football cleans beaches and raises awareness" } },
  { id: "k8r9o5cqjNU", cat: { es: "Rugby", en: "Rugby" }, title: { es: "Cobs & Cogs y Bettersport por un deporte sostenible", en: "Cobs & Cogs and Bettersport for sustainable sport" } },
  { id: "cKNWvq8mNMc", cat: { es: "Pádel", en: "Padel" }, title: { es: "Chile subcampeón del mundo — 1er Mundial de Pádel en Silla de Ruedas", en: "Chile world runner-up — 1st Wheelchair Padel World Cup" } },
  { id: "tdJq2Z0dYRA", cat: { es: "Pádel", en: "Padel" }, title: { es: "Americano de Pádel Cámara de Comercio Chile-México y Chile-Suiza", en: "Padel Americano: Chile-Mexico and Chile-Switzerland Chambers of Commerce" } },
];

export const SOCIAL = {
  instagram: "https://www.instagram.com/bettersport.cl/",
  youtube: "https://www.youtube.com/@bettersport1546",
  linkedin: "https://www.linkedin.com/company/bettersport/",
};

export const PLATFORM_URL = "https://app.bettersport.cl";
export const AWARDS_URL = "/awards";

/** Instituciones que respaldan a Bettersport. */
export const PARTNERS = [
  { name: "Megamedia", short: "MEGA" },
  { name: "Ministerio del Deporte", short: "MINDEP" },
  { name: "Comité Olímpico de Chile", short: "COCH" },
];

export const COPY = {
  nav: {
    what: { es: "Qué hacemos", en: "What we do" },
    how: { es: "Cómo funciona", en: "How it works" },
    about: { es: "Quiénes somos", en: "About us" },
    awards: { es: "Awards 2026", en: "Awards 2026" },
    platform: { es: "Conoce nuestra plataforma", en: "Explore our platform" },
    login: { es: "Entrar", en: "Log in" },
  },

  hero: {
    eyebrow: { es: "Sports ESG & Investment Tech-Enabled Services", en: "Sports ESG & Investment Tech-Enabled Services" },
    title1: { es: "El juego cambió.", en: "The game has changed." },
    title2: { es: "La inversión en sponsorship también.", en: "So has sponsorship investment." },
    lead: {
      es: "Transformamos tu inversión deportiva en impacto ESG medible, trazable y reportable. Bienvenido al nuevo estándar de la inversión deportiva.",
      en: "We turn your sports investment into measurable, traceable and reportable ESG impact. Welcome to the new standard of sports investment.",
    },
    ctaPlatform: { es: "Conoce nuestra plataforma", en: "Explore our platform" },
    ctaAwards: { es: "Bettersport Awards 2026", en: "Bettersport Awards 2026" },
    partners: { es: "Nos apoyan", en: "Backed by" },
  },

  what: {
    eyebrow: { es: "Qué hacemos", en: "What we do" },
    title: { es: "Somos el ecosistema de inversión con impacto en el deporte", en: "We are the impact investment ecosystem for sport" },
    cards: [
      {
        title: { es: "Inversión con trazabilidad", en: "Investment you can trace" },
        text: {
          es: "Apoyamos a las marcas con un servicio integral que les permite invertir con impacto y trazabilidad, cumpliendo con sus estándares de inversión ESG.",
          en: "We support brands with an end-to-end service that lets them invest with impact and traceability, meeting their ESG investment standards.",
        },
      },
      {
        title: { es: "Sponsorship conectado al impacto", en: "Sponsorship connected to impact" },
        text: {
          es: "Conectamos su inversión en sponsorship deportivo a clubes, federaciones y eventos con impacto real en temas sociales, ambientales y de gobernanza.",
          en: "We connect their sports sponsorship investment to clubs, federations and events with real social, environmental and governance impact.",
        },
      },
      {
        title: { es: "Alianza público-privada", en: "Public-private partnership" },
        text: {
          es: "Con nuestra alianza con el Ministerio del Deporte, tu inversión pasa de ser de nicho a estratégica para el país, apoyando la modernización del deporte nacional.",
          en: "Through our partnership with Chile's Ministry of Sport, your investment shifts from niche to strategic for the country, supporting the modernisation of national sport.",
        },
      },
    ],
  },

  how: {
    eyebrow: { es: "Cómo lo hacemos", en: "How we do it" },
    quote: {
      es: "La tecnología nos permite escalar. Nuestro equipo hace que el impacto suceda.",
      en: "Technology lets us scale. Our team makes the impact happen.",
    },
    lead: {
      es: "Gestionamos tu portafolio de inversión en sponsorship deportivo y te facilitamos licencias Bettersport para entregar a tus patrocinados. Con ellas, clubes, federaciones y eventos gestionan su impacto ESG y reportan bajo el estándar nacional.",
      en: "We manage your sports sponsorship portfolio and provide Bettersport licences for you to hand to the organisations you sponsor. With them, clubs, federations and events manage their ESG impact and report under the national standard.",
    },
    modelTitle: { es: "Technology Licensing Model", en: "Technology Licensing Model" },
    modelText: {
      es: "Las marcas generan una inversión anual en licencias para sus patrocinados, entregándoles nuestra herramienta tecnológica y nuestro servicio para que gestionen sus objetivos sostenibles y reporten su impacto de manera estandarizada.",
      en: "Brands make an annual licence investment for the organisations they sponsor, giving them our technology and service so they can manage their sustainability goals and report impact in a standardised way.",
    },
    steps: [
      {
        n: "01",
        title: { es: "La marca invierte", en: "The brand invests" },
        text: { es: "Adquiere licencias anuales Bettersport para su portafolio de patrocinados.", en: "It buys annual Bettersport licences for its sponsorship portfolio." },
      },
      {
        n: "02",
        title: { es: "Entrega las licencias", en: "It hands over the licences" },
        text: { es: "Clubes, federaciones y eventos reciben la plataforma y el acompañamiento de nuestro equipo.", en: "Clubs, federations and events receive the platform and our team's support." },
      },
      {
        n: "03",
        title: { es: "Gestionan su impacto", en: "They manage their impact" },
        text: { es: "Definen su estrategia ESG, ejecutan proyectos y miden indicadores ambientales, sociales y de gobernanza.", en: "They define their ESG strategy, run projects and measure environmental, social and governance indicators." },
      },
      {
        n: "04",
        title: { es: "Reportan al estándar", en: "They report to the standard" },
        text: { es: "El impacto se reporta de forma estandarizada y vuelve a la marca como resultado trazable y auditable.", en: "Impact is reported in a standardised way and returns to the brand as a traceable, auditable result." },
      },
    ],
  },

  about: {
    eyebrow: { es: "Quiénes somos", en: "About us" },
    title: { es: "Un equipo apasionado por el deporte y la sostenibilidad", en: "A team passionate about sport and sustainability" },
    paragraphs: {
      es: [
        "En Bettersport creemos que el deporte tiene el poder de generar cambios positivos mucho más allá de la competencia.",
        "Somos una compañía especializada en gestión estratégica de sostenibilidad e inversión deportiva, que combina acompañamiento experto, servicios especializados y tecnología propia con inteligencia artificial para transformar el sponsorship tradicional en una inversión con impacto real.",
        "Trabajamos junto a marcas, clubes, federaciones y organizaciones deportivas, ayudándolas a diseñar, gestionar y medir sus estrategias de sostenibilidad, generar nuevas oportunidades de colaboración y maximizar el valor de sus inversiones.",
        "A través de nuestro modelo Sports ESG & Investment Tech-Enabled Services, integramos la cercanía de un socio estratégico con herramientas que permiten medir, trazar y reportar resultados ambientales, sociales y de gobernanza.",
        "No solo entregamos tecnología. Acompañamos a nuestros clientes a transformar sus objetivos en resultados concretos.",
      ],
      en: [
        "At Bettersport we believe sport has the power to drive positive change far beyond competition.",
        "We are a company specialised in strategic sustainability management and sports investment, combining expert guidance, specialised services and our own AI-powered technology to turn traditional sponsorship into investment with real impact.",
        "We work alongside brands, clubs, federations and sports organisations, helping them design, manage and measure their sustainability strategies, create new partnership opportunities and maximise the value of their investments.",
        "Through our Sports ESG & Investment Tech-Enabled Services model, we combine the closeness of a strategic partner with tools to measure, trace and report environmental, social and governance results.",
        "We don't just deliver technology. We walk our clients through turning goals into concrete results.",
      ],
    },
    closing: {
      es: "Estamos construyendo un nuevo ecosistema donde el deporte, las empresas y la sostenibilidad se conectan para generar valor compartido.",
      en: "We are building a new ecosystem where sport, business and sustainability connect to create shared value.",
    },
  },

  purpose: {
    eyebrow: { es: "Nuestro propósito", en: "Our purpose" },
    title: { es: "Transformar el poder del deporte en impacto positivo para las personas y el planeta", en: "Turning the power of sport into positive impact for people and the planet" },
    paragraphs: {
      es: [
        "Existimos para impulsar una nueva manera de entender la inversión deportiva, donde cada patrocinio, alianza y proyecto represente una oportunidad real de generar impacto sostenible.",
        "Queremos que la sostenibilidad deje de ser una iniciativa aislada y se convierta en un componente estratégico de la gestión deportiva.",
        "Conectamos el deporte con los recursos, el conocimiento y la tecnología necesarios para generar un impacto ambiental, social y económico medible, promoviendo organizaciones más responsables, inversiones más inteligentes y comunidades más sostenibles.",
      ],
      en: [
        "We exist to drive a new way of understanding sports investment, where every sponsorship, partnership and project is a real opportunity to create sustainable impact.",
        "We want sustainability to stop being an isolated initiative and become a strategic component of sports management.",
        "We connect sport with the resources, knowledge and technology needed to generate measurable environmental, social and economic impact, fostering more responsible organisations, smarter investments and more sustainable communities.",
      ],
    },
    closing: {
      es: "Porque creemos que el verdadero valor del deporte no solo se mide en resultados deportivos, sino también en el impacto que deja en la sociedad.",
      en: "Because we believe the true value of sport is measured not only in results on the field, but also in the impact it leaves on society.",
    },
  },

  vision: {
    eyebrow: { es: "Nuestra visión", en: "Our vision" },
    title: { es: "Ser el nuevo estándar de sostenibilidad e inversión deportiva para Latinoamérica y Estados Unidos", en: "To be the new standard of sustainability and sports investment for Latin America and the United States" },
    paragraphs: {
      es: [
        "Aspiramos a ser la compañía referente en gestión de sostenibilidad e inversión deportiva en Latinoamérica y Estados Unidos, liderando la transformación hacia un ecosistema más conectado, transparente y sostenible.",
        "Visualizamos un futuro donde las marcas conozcan el impacto real de sus inversiones; los clubes y organizaciones deportivas cuenten con herramientas y acompañamiento para gestionar su sostenibilidad; y los recursos destinados al deporte generen valor más allá de la visibilidad comercial.",
        "A través de la innovación, la inteligencia artificial y un modelo de servicios escalable, buscamos establecer un estándar compartido para gestionar, medir y reportar el impacto ESG del deporte.",
      ],
      en: [
        "We aim to be the leading company in sustainability management and sports investment across Latin America and the United States, driving the shift towards a more connected, transparent and sustainable ecosystem.",
        "We picture a future where brands know the real impact of their investments; clubs and sports organisations have the tools and support to manage their sustainability; and resources devoted to sport create value beyond commercial visibility.",
        "Through innovation, artificial intelligence and a scalable services model, we seek to establish a shared standard to manage, measure and report the ESG impact of sport.",
      ],
    },
    closing: {
      es: "Queremos que el futuro del deporte no solo sea más competitivo, sino también más sostenible.",
      en: "We want the future of sport to be not only more competitive, but also more sustainable.",
    },
  },

  videos: {
    eyebrow: { es: "Galería", en: "Gallery" },
    title: { es: "El impacto, en acción", en: "Impact in action" },
    lead: {
      es: "Eventos donde el deporte impulsa la sostenibilidad y la acción climática.",
      en: "Events where sport drives sustainability and climate action.",
    },
    channel: { es: "Ver más en YouTube", en: "See more on YouTube" },
  },

  awards: {
    eyebrow: { es: "Bettersport Awards 2026", en: "Bettersport Awards 2026" },
    title: { es: "Reconocemos al deporte que deja huella", en: "Celebrating the sport that leaves a mark" },
    lead: {
      es: "Los premios que distinguen a clubes, federaciones, eventos y marcas que transforman el deporte en impacto real. Postulaciones abiertas.",
      en: "The awards that recognise clubs, federations, events and brands turning sport into real impact. Entries are open.",
    },
    cta: { es: "Inscríbete en los Awards 2026", en: "Enter the 2026 Awards" },
  },

  cta: {
    title: { es: "¿Listo para invertir con impacto?", en: "Ready to invest with impact?" },
    lead: {
      es: "Conoce la plataforma donde marcas, clubes, federaciones y eventos gestionan, miden y reportan su impacto ESG.",
      en: "Explore the platform where brands, clubs, federations and events manage, measure and report their ESG impact.",
    },
    button: { es: "Conoce nuestra plataforma", en: "Explore our platform" },
  },

  footer: {
    tagline: { es: "El nuevo estándar de la inversión deportiva.", en: "The new standard of sports investment." },
    rights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
  },
};
