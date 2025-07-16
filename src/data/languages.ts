export interface LanguageTexts {
  // App Title and Subtitle
  appTitle: string;
  appSubtitle: string;
  
  // Control Panel
  ragaTitle: string;
  talaTitle: string;
  tanpuraTitle: string;
  octaveTitle: string;
  
  // Tanpura Controls
  tanpuraBtnStart: string;
  tanpuraBtnStop: string;
  volumeLabel: string;
  
  // Octave Labels
  mandraText: string;
  madhyaText: string;
  taraText: string;
  
  // Welcome Screen
  welcomeTitle: string;
  welcomeDescription: string;
  beginBtnText: string;
  loadingText: string;
  
  // Performance Info
  currentSwaraLabel: string;
  octaveLabel: string;
  ragaLabel: string;
  
  // Instructions
  instructionsTitle: string;
  leftHandTitle: string;
  rightHandTitle: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  instruction4: string;
  instruction5: string;
  instruction6: string;
  instruction7: string;
  instruction8: string;
  
  // General
  enableCameraLabel: string;
  cameraPermissionText: string;
}

export const languages: Record<string, LanguageTexts> = {
  en: {
    appTitle: "RaagaRangam",
    appSubtitle: "Interactive Carnatic Music Experience",
    ragaTitle: "Raga",
    talaTitle: "Tala",
    tanpuraTitle: "Tanpura",
    octaveTitle: "Octave",
    tanpuraBtnStart: "Start Drone",
    tanpuraBtnStop: "Stop Drone",
    volumeLabel: "Drone Volume",
    mandraText: "Mandra",
    madhyaText: "Madhya",
    taraText: "Tara",
    welcomeTitle: "Welcome to RaagaRangam",
    welcomeDescription: "Experience the beauty of Carnatic music through gesture-based interaction. Allow camera access to begin your musical journey.",
    beginBtnText: "Begin Experience",
    loadingText: "Preparing the musical sphere...",
    currentSwaraLabel: "Current Swara",
    octaveLabel: "Octave",
    ragaLabel: "Raga",
    instructionsTitle: "🙏 How to Play",
    leftHandTitle: "Left Hand (Swaras):",
    rightHandTitle: "Right Hand (Swaras):",
    instruction1: "• Index finger to thumb: Sa",
    instruction2: "• Middle finger to thumb: Ri",
    instruction3: "• Ring finger to thumb: Ga",
    instruction4: "• Pinky finger to thumb: Not used for notes",
    instruction5: "• Index finger to thumb: Ma",
    instruction6: "• Middle finger to thumb: Pa",
    instruction7: "• Ring finger to thumb: Da",
    instruction8: "• Pinky finger to thumb: Ni",
    enableCameraLabel: "Enable Camera",
    cameraPermissionText: "Camera access is required for hand tracking"
  },
  te: {
    appTitle: "రాగరంగం",
    appSubtitle: "సంవేదనాత్మక కర్ణాటక సంగీత అనుభవం",
    ragaTitle: "రాగం",
    talaTitle: "తాళం",
    tanpuraTitle: "తాన్పుర",
    octaveTitle: "సప్తకం",
    tanpuraBtnStart: "శ్రుతి ప్రారంభించు",
    tanpuraBtnStop: "శ్రుతి ఆపు",
    volumeLabel: "శ్రుతి వాల్యూమ్",
    mandraText: "మంద్ర",
    madhyaText: "మధ్య",
    taraText: "తార",
    welcomeTitle: "రాగరంగానికి స్వాగతం",
    welcomeDescription: "సంజ్ఞా ఆధారిత పరస్పర చర్య ద్వారా కర్ణాటక సంగీత సౌందర్యాన్ని అనుభవించండి। మీ సంగీత యాత్రను ప్రారంభించడానికి కెమెరా అనుమతిని ఇవ్వండి।",
    beginBtnText: "అనుభవం ప్రారంభించు",
    loadingText: "సంగీత గోళాన్ని సిద్ధం చేస్తున్నాం...",
    currentSwaraLabel: "ప్రస్తుత స్వరం",
    octaveLabel: "సప్తకం",
    ragaLabel: "రాగం",
    instructionsTitle: "🙏 ఎలా వాయించాలి",
    leftHandTitle: "ఎడమ చేతి (స్వరాలు):",
    rightHandTitle: "కుడి చేతి (స్వరాలు):",
    instruction1: "• చూపుడు వేలు - బొటనవేలు: సా",
    instruction2: "• మధ్య వేలు - బొటనవేలు: రి",
    instruction3: "• ఉంగరపు వేలు - బొటనవేలు: గ",
    instruction4: "• చిటికెన వేలు - బొటనవేలు: స్వరాలకు ఉపయోగపడదు",
    instruction5: "• చూపుడు వేలు - బొటనవేలు: మ",
    instruction6: "• మధ్య వేలు - బొటనవేలు: ప",
    instruction7: "• ఉంగరపు వేలు - బొటనవేలు: ద",
    instruction8: "• చిటికెన వేలు - బొటనవేలు: ని",
    enableCameraLabel: "కెమెరాను సక్రియం చేయండి",
    cameraPermissionText: "చేతి ట్రాకింగ్ కోసం కెమెరా యాక్సెస్ అవసరం"
  },
  hi: {
    appTitle: "रागरंगम",
    appSubtitle: "संवादात्मक कर्नाटक संगीत अनुभव",
    ragaTitle: "राग",
    talaTitle: "ताल",
    tanpuraTitle: "तानपुरा",
    octaveTitle: "सप्तक",
    tanpuraBtnStart: "ड्रोन शुरू करें",
    tanpuraBtnStop: "ड्रोन बंद करें",
    volumeLabel: "ड्रोन वॉल्यूम",
    mandraText: "मंद्र",
    madhyaText: "मध्य",
    taraText: "तार",
    welcomeTitle: "रागरंगम में स्वागत",
    welcomeDescription: "इशारा-आधारित इंटरैक्शन के माध्यम से कर्नाटक संगीत की सुंदरता का अनुभव करें। अपनी संगीत यात्रा शुरू करने के लिए कैमरा एक्सेस की अनुमति दें।",
    beginBtnText: "अनुभव शुरू करें",
    loadingText: "संगीत गोला तैयार कर रहे हैं...",
    currentSwaraLabel: "वर्तमान स्वर",
    octaveLabel: "सप्तक",
    ragaLabel: "राग",
    instructionsTitle: "🙏 कैसे बजाएं",
    leftHandTitle: "बायां हाथ (स्वर):",
    rightHandTitle: "दाहिना हाथ (स्वर):",
    instruction1: "• तर्जनी से अंगूठे तक: सा",
    instruction2: "• मध्यमा से अंगूठे तक: रि",
    instruction3: "• अनामिका से अंगूठे तक: ग",
    instruction4: "• कनिष्ठा से अंगूठे तक: स्वरों के लिए उपयोग नहीं होता",
    instruction5: "• तर्जनी से अंगूठे तक: म",
    instruction6: "• मध्यमा से अंगूठे तक: प",
    instruction7: "• अनामिका से अंगूठे तक: ध",
    instruction8: "• कनिष्ठा से अंगूठे तक: नि",
    enableCameraLabel: "कैमरा सक्षम करें",
    cameraPermissionText: "हाथ ट्रैकिंग के लिए कैमरा एक्सेस आवश्यक है"
  }
};