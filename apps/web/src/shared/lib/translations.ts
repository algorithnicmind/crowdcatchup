export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta';

export interface TranslationDictionary {
  safeStatusTitle: string;
  safeStatusSub: string;
  dangerStatusTitle: string;
  dangerStatusSub: string;
  navGuideText: string;
  sosSuccess: string;
  voiceGuide: string;
  broadcasts: {
    gateClosed: string;
    oneWayFlow: string;
    emergencyEvac: string;
    downpourSurge: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    safeStatusTitle: "SAFE CROWD FLOW",
    safeStatusSub: "Density normal. Proceed along Green Route.",
    dangerStatusTitle: "HIGH DENSITY AHEAD",
    dangerStatusSub: "Opening Gate 4. Diverting flow to Sector B.",
    navGuideText: "Follow Green illuminated arrows to exit safely.",
    sosSuccess: "SOS alert dispatched! Rescue team notified.",
    voiceGuide: "Speak your command (e.g., 'Status of Gate 2')",
    broadcasts: {
      gateClosed: "Gate 2 temporary entry pause. Please proceed toward Gate 4 for smooth movement.",
      oneWayFlow: "One-way walking corridor active. Keep right and maintain steady walking pace.",
      emergencyEvac: "To ensure comfortable space, please follow designated Green Route via Gate 5.",
      downpourSurge: "Shelter area crowded. Kindly move toward open pavilion Sector C."
    }
  },
  hi: {
    safeStatusTitle: "सुरक्षित भीड़ प्रवाह",
    safeStatusSub: "घनत्व सामान्य है। हरे मार्ग पर आगे बढ़ें।",
    dangerStatusTitle: "आगे अधिक भीड़ है",
    dangerStatusSub: "गेट 4 खोला जा रहा है। सेक्टर बी की तरफ जाएं।",
    navGuideText: "सुरक्षित निकास के लिए हरे निशानों का पालन करें।",
    sosSuccess: "आपातकालीन संदेश भेजा गया! सहायता टीम को सूचित किया गया।",
    voiceGuide: "अपना प्रश्न बोलें (जैसे: 'गेट 2 की स्थिति')",
    broadcasts: {
      gateClosed: "गेट 2 पर अस्थायी ठहराव है। सुगम आवागमन के लिए कृपया गेट 4 की ओर बढ़ें।",
      oneWayFlow: "एकतरफा पैदल मार्ग चालू है। दाईं ओर रहें और निरंतर चलें।",
      emergencyEvac: "सुविधाजनक आवागमन के लिए, कृपया गेट 5 के माध्यम से निर्धारित हरे मार्ग का पालन करें।",
      downpourSurge: "आश्रय क्षेत्र भरा हुआ है। कृपया खुले मंडप सेक्टर सी की ओर जाएं।"
    }
  },
  mr: {
    safeStatusTitle: "सुरक्षित गर्दी प्रवाह",
    safeStatusSub: "घनता सामान्य आहे. हिरव्या मार्गाने पुढे जा.",
    dangerStatusTitle: "पुढे जास्त गर्दी आहे",
    dangerStatusSub: "गेट ४ उघडले जात आहे. सेक्टर बी कडे वळा.",
    navGuideText: "सुरक्षित बाहेर पडण्यासाठी हिरव्या चिन्हांचे अनुसरण करा.",
    sosSuccess: "आपत्कालीन संदेश पाठवला! मदत पथकाला सूचित केले.",
    voiceGuide: "तुमचा प्रश्न बोला (उदा. 'गेट २ ची स्थिती')",
    broadcasts: {
      gateClosed: "गेट २ वर तात्पुरता थांबा. सुलभ प्रवासासाठी कृपया गेट ४ कडे जा.",
      oneWayFlow: "एकतर्फी पादचारी मार्ग सुरू आहे. उजव्या बाजूने चाला.",
      emergencyEvac: "सोयीस्कर प्रवासासाठी, कृपया गेट ५ द्वारे निश्चित केलेल्या हिरव्या मार्गाचे अनुसरण करा.",
      downpourSurge: "निवारा क्षेत्र भरले आहे. कृपया उघड्या मंडप सेक्टर सी कडे जा."
    }
  },
  ta: {
    safeStatusTitle: "பாதுகாப்பான கூட்ட ஓட்டம்",
    safeStatusSub: "அடர்த்தி இயல்பானது. பச்சை வழியில் செல்லவும்.",
    dangerStatusTitle: "முன்னால் அதிக கூட்டம்",
    dangerStatusSub: "கேட் 4 திறக்கப்படுகிறது. செக்டார் B-க்கு செல்லவும்.",
    navGuideText: "பாதுகாப்பாக வெளியேற பச்சை வழிகாட்டி அம்புகளைப் பின்பற்றவும்.",
    sosSuccess: "அவசர செய்தி அனுப்பப்பட்டது! மீட்புக் குழுவிற்கு தகவல் தெரிவிக்கப்பட்டது.",
    voiceGuide: "உங்கள் கட்டளையைப் பேசுங்கள் (எ.கா: 'கேட் 2 நிலை')",
    broadcasts: {
      gateClosed: "கேட் 2 தற்காலிகமாக இடைநிறுத்தப்பட்டுள்ளது. சீரான பாதைக்கு கேட் 4 நோக்கி செல்லவும்.",
      oneWayFlow: "ஒரு வழி நடைபாதை செயல்பாட்டில் உள்ளது. வலதுபுறமாகச் செல்லவும்.",
      emergencyEvac: "வசதியான நடைபயணத்திற்கு, கேட் 5 வழியாக நியமிக்கப்பட்ட பச்சை வழியைப் பின்பற்றவும்.",
      downpourSurge: "நிழல் பகுதி நிரம்பியுள்ளது. திறந்த மண்டபம் செக்டார் C நோக்கிச் செல்லவும்."
    }
  }
};
