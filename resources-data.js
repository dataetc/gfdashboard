// Resources data structure
const resourcesData = {
  dashboards: [
    {
      id: 'ccm-dashboard',
      title: 'CCM Dashboard',
      titleKey: 'resources-ccmdash',
      url: 'https://dataetc.org/projects/ccm',
      image: 'images/ccm_dashboard.png',
      imageGif: 'images/ccm_dashboard.gif',
      languages: ['all'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'gc8-documents',
      title: 'GC8 Documents Dashboard',
      titleKey: 'resources-gc8-documents',
      url: 'https://dataetc.org/projects/gc8-documents',
      image: 'images/gc8-documents.png',
      imageGif: 'images/gc8-documents.gif',
      languages: ['all'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'reprioritization-dashboard',
      title: 'Mind the Gap: Emerging gaps in Global Fund programs',
      titleKey: 'resources-reprioritization',
      url: 'https://dataetc.org/projects/reprioritization',
      image: 'images/reprioritization.png',
      imageGif: 'images/reprioritization.gif',
      languages: ['all'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'pepfar-dashboard',
      title: 'PEPFAR Dashboard',
      titleKey: 'resources-pepfardash',
      url: 'https://dataetc.org/projects/uqd',
      image: 'images/pepfar_dashboard.png',
      imageGif: 'images/pepfar_dashboard.gif',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'uqd-dashboard',
      title: 'UQD Dashboard',
      titleKey: 'resources-uqddash',
      url: 'https://dataetc.org/projects/uqd',
      image: 'images/uqd_dashboard.png',
      imageGif: 'images/uqd_dashboard.gif',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'r8-dashboard',
      title: 'Global Fund Replenishment 8 Scenarios',
      titleKey: 'resources-r8dash',
      url: 'https://dataetc.org/projects/r8-tracker',
      image: 'images/replenishment_dashboard.png',
      imageGif: 'images/replenishment_dashboard.gif',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: true
    }
  ],
  
  guides: [
    {
      id: 'interpreting-guidance-en',
      title: 'Interpreting Global Fund Guidance - FAQ',
      url: 'resources/Interpreting Global Fund Guidance - FAQ - EN.pdf',
      image: 'images/interpreting-guidance-en.png',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-fr',
      title: 'Interprétation des orientations du Fonds mondial - FAQ',
      url: 'resources/Interprétation des orientations du Fonds mondial - FAQ - FR.pdf',
      image: 'images/interpreting-guidance-fr.png',
      languages: ['french'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-es',
      title: 'Interpretación de las orientaciones del Fondo Mundial - FAQ',
      url: 'resources/Interpretación de las orientaciones del Fondo Mundial - FAQ - ES.pdf',
      image: 'images/interpreting-guidance-es.png',
      languages: ['spanish'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-pt',
      title: 'Interpretação do Guia do Fundo Global - FAQ',
      url: 'resources/Interpretação do Guia do Fundo Global - FAQ - PT.pdf',
      image: 'images/interpreting-guidance-pt.png',
      languages: ['portuguese'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-ru',
      title: 'Интерпретация руководства Глобального фонда - Вопросы и ответы',
      url: 'resources/Интерпретация руководства Глобального фонда - Вопросы и ответы - RU.pdf',
      image: 'images/interpreting-guidance-ru.png',
      languages: ['russian'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-ar',
      title: 'نسخة من تفسير إرشادات الصندوق العالمي - الأسئلة الشائعة',
      url: 'resources/نسخة من تفسير إرشادات الصندوق العالمي - الأسئلة الشائعة - AR.pdf',
      image: 'images/interpreting-guidance-ar.png',
      languages: ['arabic'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'interpreting-guidance-ba',
      title: 'Interpreting Global Fund Guidance - FAQ - Bahasa Indonesia',
      url: 'resources/Interpreting Global Fund Guidance - FAQ - Bahasa Indonesia.pdf',
      image: 'images/interpreting-guidance-ba.png',
      languages: ['indonesian'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'reprogramming-en',
      title: 'Community Guide to Reprogramming Global Fund Grants',
      url: 'resources/Community Guide to Reprogramming Global Fund Grants.pdf',
      image: 'images/reprogramming-en.png',
      languages: ['english'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'reprogramming-fr',
      title: 'Guide communautaire à la reprogrammation des subventions du Fonds mondial',
      url: 'resources/Guide communautaire à la reprogrammation des subventions du Fonds mondial.pdf',
      image: 'images/reprogramming-fr.png',
      languages: ['french'],
      source: 'Partners',
      archived: false,
      external: false
    }
  ],
  
  reports: [
    {
      id: 'reprioritization-report-en',
      title: 'Community Engagement in Global Fund Reprioritization',
      url: 'resources/Community Engagement in Global Fund Reprioritization 2025.pdf',
      image: 'images/reprioritization-report.png',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'reprioritization-report-fr',
      title: 'Engagement communautaire dans la redéfinition des priorités du Fonds mondial',
      url: 'resources/Engagement communautaire dans la redéfinition des priorités du Fonds mondial.pdf',
      image: 'images/reprioritization-report-fr.png',
      languages: ['french'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'scope-report',
      title: 'SCOPE Report',
      url: 'resources/SCOPE Report.pdf',
      image: 'images/SCOPE-report.png',
      languages: ['english'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'gc7-cut-data',
      title: 'GC7 Reprioritization Revised Funding Envelopes',
      url: 'https://docs.google.com/spreadsheets/d/1OWv9Q4zyLESuzdvuesSHBp9GhLyycgiz9IMbXmlRWzA/edit?usp=sharing',
      image: 'images/gc7-cut-data.png',
      languages: ['all'],
      source: 'GADH',
      archived: false,
      external: true
    },
    {
      id: 'roadmap-en',
      title: 'A Roadmap for Strengthening Community Engagement with Global Fund',
      url: 'resources/A Roadmap for Strengthening Community Engagement with Global Fund.pdf',
      image: 'images/roadmap.png',
      languages: ['english'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'roadmap-fr',
      title: 'Feuille de route pour le renforcement de l\'engagement des communautés auprès du Fonds mondial',
      url: 'resources/Feuille de route pour le renforcement de l\'engagement des communautés auprès du Fonds mondial.pdf',
      image: 'images/roadmap-fra.png',
      languages: ['french'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'rise-en',
      title: 'Community engagement in Global Fund Country Coordinating Mechanisms: Findings from the RISE Study',
      url: 'resources/RISE Report 2024.pdf',
      image: 'images/rise.png',
      languages: ['english'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'rise-fr',
      title: 'Engagement communautaire dans les instances de coordination nationale du Fonds mondial: Conclusions de l\'étude RISE',
      url: 'resources/Rapport RISE 2024.pdf',
      image: 'images/rise-fra.png',
      languages: ['french'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'rise-es',
      title: 'Participación comunitaria en los Mecanismos de Coordinación de País del Fondo Mundial: Resultados del estudio RISE',
      url: 'resources/Informe RISE 2024.pdf',
      image: 'images/rise-esp.png',
      languages: ['spanish'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'rise-pt',
      title: 'Envolvimento da Comunidade nos Mecanismos de Coordenação do Pais do Fundo Global: Conclusões do Estudo RISE',
      url: 'resources/Relatório RISE 2024.pdf',
      image: 'images/rise-por.png',
      languages: ['portuguese'],
      source: 'Partners',
      archived: false,
      external: false
    },
    {
      id: 'rise-ru',
      title: 'Участие сообществ в Страновых Координационных Комитетах Глобального Фонда: Результаты исследования RISE',
      url: 'resources/Отчет RISE 2024.pdf',
      image: 'images/rise-rus.png',
      languages: ['russian'],
      source: 'Partners',
      archived: false,
      external: false
    }
  ],
  
  globalFund: [
    {
      id: 'core-guidance-en',
      title: 'Core Guidance',
      url: 'https://resources.theglobalfund.org/en/technical-guidance/core-guidance/',
      image: 'images/gf-core-guidance-en.png',
      languages: ['english'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'core-guidance-fr',
      title: 'Orientations de base',
      url: 'https://resources.theglobalfund.org/en/technical-guidance/core-guidance/',
      image: 'images/gf-core-guidance-fr.png',
      languages: ['french'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'core-guidance-es',
      title: 'Directrices básicas',
      url: 'https://resources.theglobalfund.org/es/technical-guidance/core-guidance/',
      image: 'images/gf-core-guidance-es.png',
      languages: ['spanish'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'operational-update-en',
      title: 'Operational Update: Launching Grant Cycle 8',
      url: 'https://archive.theglobalfund.org/media/tlvapcz2/archive_operational-2025-12-15_update_en.pdf',
      image: 'images/operational-update-en.png',
      languages: ['english'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'operational-update-fr',
      title: 'Mise à jour opérationnelle: Lancement du cycle de subvention 8',
      url: 'https://archive.theglobalfund.org/media/t4alu3z4/archive_operational-2025-12-15_update_fr.pdf',
      image: 'images/operational-update-fr.png',
      languages: ['french'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'operational-update-es',
      title: 'Actualización operativa: Lanzamiento del Octavo Ciclo de Subvenciones',
      url: 'https://archive.theglobalfund.org/media/ck1nbzvh/archive_operational-2025-12-15_update_es.pdf',
      image: 'images/operational-update-es.png',
      languages: ['spanish'],
      source: 'Global Fund',
      archived: true,
      external: true
    },
    {
      id: 'operational-update-pt',
      title: 'Atualização operacional: Lançamento do oitavo ciclo de subvenções',
      url: 'https://archive.theglobalfund.org/media/udahuvop/archive_operational-2025-12-15_update_pt.pdf',
      image: 'images/operational-update-pt.png',
      languages: ['portuguese'],
      source: 'Global Fund',
      archived: false,
      external: true
    },
    {
      id: 'crg-toolbox',
      title: 'Community Engagement Toolbox: Resources from Partners of the Global Fund\'s Community Engagement Strategic Initiative',
      url: 'https://www.theglobalfund.org/media/10734/ccm_communityengagement_toolbox_en.pdf',
      image: 'images/crg-toolbox.png',
      languages: ['portuguese'],
      source: 'Global Fund',
      archived: false,
      external: true
    }
  ],
  
  advocacy: [
    {
      id: '28th-strategy-committee',
      title: '28th Strategy Committee Civil Society Statement (7 July 2025)',
      url: 'resources/28th Strategy Committee Civil Society Statement.pdf',
      image: 'images/CS-28SC-letter.png',
      languages: ['english', 'french'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'change-53bm',
      title: 'CHANGE Statement - 53rd Board Meeting (7 May 2025)',
      url: 'resources/CHANGE Statement - 53rd Board Meeting.pdf',
      image: 'images/CHANGE-letter-53BM.png',
      languages: ['english', 'french'],
      source: 'GADH',
      archived: false,
      external: false
    },
    {
      id: 'change-27sc',
      title: 'CHANGE Statement - 27th Strategy Committee Meeting (13 March 2025)',
      url: 'resources/CHANGE Statement - 27th Strategy Committee Meeting.pdf',
      image: 'images/CHANGE-letter.png',
      languages: ['english', 'french'],
      source: 'GADH',
      archived: false,
      external: false
    }
  ]
};