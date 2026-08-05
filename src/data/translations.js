/**
 * CrowdShield AI - Multilingual Translation Dictionary
 * Supports instant emergency broadcasts in English, Hindi, Marathi, and Tamil.
 */

export const TRANSLATIONS = {
    en: {
        safeStatusTitle: "All Sectors Safe",
        safeStatusSub: "No unusual congestion detected nearby.",
        dangerStatusTitle: "CRUSH RISK WARNING",
        dangerStatusSub: "Congestion at Gate 2. Follow Green Route!",
        navGuideText: "Your nearest designated Green Safe Route: Gate 4 & Gate 5.",
        voiceGuide: "Attention please. To avoid overcrowding near Sector 2, proceed calmly towards emergency exit Gate 4. Follow the green lighted path.",
        broadcasts: {
            gateClosed: {
                title: "🚪 Gate 2 Temporarily Closed",
                desc: "To prevent overcrowding, Gate 2 entry has been halted. Please use alternate Gate 4 or Sector B entrances.",
                meta: "Broadcasted by District Police Control Room"
            },
            oneWayFlow: {
                title: "🔄 One-Way Pedestrian Flow Initiated",
                desc: "One-way movement activated along Central Path. Do not turn back or stop in moving crowd streams.",
                meta: "AI Automated Advisory System"
            },
            downpourSurge: {
                title: "🌧️ Rain Shelter Advisory",
                desc: "Sudden rain detected. Please do not rush under temporary canopies. Proceed calmly to hard-roof Pavilion Zones.",
                meta: "Disaster Management Cell"
            },
            emergencyEvac: {
                title: "🚨 URGENT: High Density Alert",
                desc: "Crowd density has exceeded safe limits in Ghat Central Sector. Immediate slow paced dispersal to Gate 5 required.",
                meta: "Emergency Response Command"
            }
        },
        sosSuccess: "✅ Emergency SOS dispatched to Command Room with coordinates. Rapid Action units notified."
    },

    hi: {
        safeStatusTitle: "सभी क्षेत्र सुरक्षित हैं",
        safeStatusSub: "आसपास कोई भीड़ या अवरोध नहीं है।",
        dangerStatusTitle: "⚠️ भारी भीड़ और खतरे की चेतावनी",
        dangerStatusSub: "गेट 2 पर अत्यधिक भीड़ है। हरे रास्ते का पालन करें!",
        navGuideText: "आपका निकटतम हरा सुरक्षित निकास रास्ता: गेट 4 और गेट 5 है।",
        voiceGuide: "कृपया ध्यान दें। सेक्टर 2 के पास अत्यधिक भीड़ से बचने के लिए, कृपया शांतिपूर्वक आपातकालीन निकास गेट 4 की ओर बढ़ें।",
        broadcasts: {
            gateClosed: {
                title: "🚪 गेट 2 अस्थायी रूप से बंद",
                desc: "भीड़ को नियंत्रित करने के लिए गेट 2 का प्रवेश बंद कर दिया गया है। कृपया वैकल्पिक गेट 4 या सेक्टर B का प्रयोग करें।",
                meta: "जिला पुलिस नियंत्रण कक्ष द्वारा प्रसारित"
            },
            oneWayFlow: {
                title: "🔄 एक तरफा पैदल मार्ग लागू",
                desc: "मुख्य मार्ग पर एक तरफा यातायात शुरू किया गया है। चलती भीड़ में वापस न मुड़ें और न ही रुकें।",
                meta: "एआई स्वचालित परामर्श प्रणाली"
            },
            downpourSurge: {
                title: "🌧️ वर्षा सुरक्षा सूचना",
                desc: "अचानक बारिश के कारण अस्थायी टेंट के नीचे भागदौड़ न करें। शांतिपूर्वक सुरक्षित पक्के शेड की ओर बढ़ें।",
                meta: "आपदा प्रबंधन दल"
            },
            emergencyEvac: {
                title: "🚨 आपातकाल: अत्यधिक भीड़ चेतावनी",
                desc: "घाट सेंट्रल सेक्टर में भीड़ की सघनता सुरक्षित सीमा से अधिक है। तुरंत गेट 5 की ओर शांतिपूर्वक बाहर निकलें।",
                meta: "आपातकालीन प्रतिक्रिया कमान"
            }
        },
        sosSuccess: "✅ नियंत्रण कक्ष को आपका आपातकालीन संदेश और स्थान भेजा गया। सुरक्षा दल सूचित है।"
    },

    mr: {
        safeStatusTitle: "सर्व परिसर सुरक्षित आहेत",
        safeStatusSub: "जवळपास कोणतीही गर्दी किंवा अडथळा नाही.",
        dangerStatusTitle: "⚠️ गर्दीच्या दाबाचा धोका",
        dangerStatusSub: "गेट 2 जवळ तीव्र गर्दी. हिरव्या मार्गाचा अवलंब करा!",
        navGuideText: "तुमचा जवळचा हिरवा सुरक्षित मार्ग: गेट 4 आणि गेट 5.",
        voiceGuide: "कृपया लक्ष द्या. सेक्टर 2 जवळील गर्दी टाळण्यासाठी, कृपया शांतपणे आपत्कालीन गेट 4 च्या दिशेने चला.",
        broadcasts: {
            gateClosed: {
                title: "🚪 गेट 2 तात्पुरते बंद",
                desc: "गर्दी टाळण्यासाठी गेट 2 चे प्रवेश बंद केले आहे. कृपया पर्यायी गेट 4 किंवा सेक्टर B वापरण्याचे आवाहन.",
                meta: "जिल्हा पोलीस नियंत्रण कक्ष"
            },
            oneWayFlow: {
                title: "🔄 एकेरी वाहतूक व्यवस्था लागू",
                desc: "मुख्य मार्गावर एकेरी चालण्याची व्यवस्था सुरू केली आहे. कृपया गर्दीमध्ये मागे वळू नका किंवा थांबू नका.",
                meta: "एआय स्वयंचलित सूचना प्रणाली"
            },
            downpourSurge: {
                title: "🌧️ पावसाची पूर्वसूचना",
                desc: "अचानक आलेल्या पावसामुळे धावपळ करू नका. शांतपणे सुरक्षित छताखाली जा.",
                meta: "त्ती व्यवस्थापन कक्ष"
            },
            emergencyEvac: {
                title: "🚨 तातडीची सूचना: अत्यधिक गर्दी",
                desc: "घाट मध्यवर्ती भागात गर्दीने सुरक्षित मर्यादा ओलांडली आहे. लगेच गेट 5 च्या दिशेने बाहेर पडा.",
                meta: "आपत्कालीन मदत पथक"
            }
        },
        sosSuccess: "✅ नियंत्रण कक्षाला तुमचा आपत्कालीन SOS संदेश पाठवला गेला आहे. मदत रवाना केली आहे."
    },

    ta: {
        safeStatusTitle: "அனைத்து பகுதிகளும் பாதுகாப்பாக உள்ளன",
        safeStatusSub: "அருகில் நெரிசல் எதுவும் கண்டறியப்படவில்லை.",
        dangerStatusTitle: "⚠️ நெரிசல் அபாய எச்சரிக்கை",
        dangerStatusSub: "கேட் 2-ல் அதிக கூட்டம். பச்சை வழியைப் பின்பற்றவும்!",
        navGuideText: "உங்களுக்கு அருகிலுள்ள பாதுகாப்பான பச்சை வழி: கேட் 4 மற்றும் கேட் 5.",
        voiceGuide: "தயவுசெய்து கவனிக்கவும். நெரிசலைத் தவிர்க்க, அமைதியாக அவசர வெளியேறும் கேட் 4 நோக்கி செல்லவும்.",
        broadcasts: {
            gateClosed: {
                title: "🚪 கேட் 2 தற்காலிகமாக மூடப்பட்டது",
                desc: "கூட்ட நெரிசலைத் தவிர்க்க கேட் 2 மூடப்பட்டுள்ளது. தயவுசெய்து மாற்று கேட் 4 அல்லது செக்டார் B ஐப் பயன்படுத்தவும்.",
                meta: "மாவட்ட காவல்துறை கட்டுப்பாட்டு அறை"
            },
            oneWayFlow: {
                title: "🔄 ஒருсторон இயக்க முறை அமல்",
                desc: "பிரதான பாதையில் ஒருсторон இயக்கம் தொடங்கப்பட்டது. மக்கள் கூட்டத்தில் பின்வாங்கவோ நிற்கவோ வேண்டாம்.",
                meta: "AI தானியங்கி ஆலோசனை அமைப்பு"
            },
            downpourSurge: {
                title: "🌧️ மழை பாதுகாப்பு ஆலோசனை",
                desc: "திடீர் மழை காரணமாக கூடாரங்கள் கீழ் ஓட வேண்டாம். அமைதியாக பாதுகாப்பான கட்டிடங்களுக்கு செல்லவும்.",
                meta: "பேரிடர் மேலாண்மை குழு"
            },
            emergencyEvac: {
                title: "🚨 அவசரம்: அதிக மக்கள் அடர்த்தி",
                desc: "மையப் பகுதியில் மக்கள் அடர்த்தி பாதுகாப்பான எல்லையை தாண்டியுள்ளது. கேட் 5 நோக்கி அமைதியாக செல்லவும்.",
                meta: "அவசரக்கால மீட்பு படை"
            }
        },
        sosSuccess: "✅ அவசர SOS செய்தி கட்டுப்பாட்டு அறைக்கு அனுப்பப்பட்டது. மீட்பு குழுவுக்கு தெரிவிக்கப்பட்டது."
    }
};

/**
 * Helper to fetch translation for a specific path and active language.
 */
export function getTranslation(lang = 'en', keyPath) {
    const keys = keyPath.split('.');
    let current = TRANSLATIONS[lang] || TRANSLATIONS.en;
    for (const k of keys) {
        current = current?.[k];
        if (!current) break;
    }
    // Fallback to english if translation key missing
    if (!current && lang !== 'en') {
        let fallback = TRANSLATIONS.en;
        for (const k of keys) {
            fallback = fallback?.[k];
            if (!fallback) break;
        }
        return fallback || keyPath;
    }
    return current || keyPath;
}
