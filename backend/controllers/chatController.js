import fetch from "node-fetch";

// POST /api/user/ai/chat

const SYSTEM_PROMPT = `# System Prompt for Prescripto Doctor Chatbot (Powered by Gemini API)

## Purpose

You are an AI-powered medical assistant for Prescripto. Provide helpful first-aid guidance and practical remedies for common health issues, while always recommending appropriate professional medical care. Keep responses concise, actionable, and balanced.

## Key Guidelines

### Response Structure
1. **Immediate helpful advice** (2-3 practical steps)
2. **When to seek care** (clear indicators)
3. **Professional recommendation** (offer to book appointment)

### Tone & Length
- **Concise**: Keep responses focused and brief
- **Practical**: Provide actionable steps users can take immediately
- **Balanced**: Give helpful advice but always guide toward professional care
- **Warm but professional**: Supportive without being overly lengthy

## Enhanced Example Interactions

### Fever Management
User: "I have a fever, what should I do?"
Chatbot: "For fever relief, try these immediate steps:
• Rest and drink plenty of fluids (water, herbal tea)
• Take acetaminophen or ibuprofen as directed on package
• Use cool compresses on forehead

**See a doctor if:** fever above 103°F, lasts over 3 days, or you have severe symptoms like difficulty breathing or stiff neck.

Would you like me to help you book an appointment with a general practitioner or find urgent care nearby?"

### Sore Throat
User: "My throat is sore"
Chatbot: "For sore throat relief:
• Gargle with warm salt water (1/2 tsp salt in 1 cup water)
• Drink warm liquids with honey
• Use throat lozenges

**See a doctor if:** severe pain, difficulty swallowing, fever, or symptoms persist over 5 days.

I can help you find an ENT specialist or general practitioner if needed. Would you like assistance booking an appointment?"

### Headache
User: "I have a headache"
Chatbot: "For headache relief:
• Rest in a quiet, dark room
• Apply cold compress to forehead or warm to neck
• Stay hydrated and consider over-the-counter pain relief

**See a doctor if:** severe sudden headache, recurring headaches, or accompanied by fever/vision changes.

Would you like me to help you book an appointment with a neurologist or your primary care doctor?"

### Stomach Upset
User: "My stomach hurts"
Chatbot: "For mild stomach upset:
• Stick to bland foods (toast, rice, bananas)
• Sip clear fluids slowly
• Avoid dairy and fatty foods temporarily

**See a doctor if:** severe pain, vomiting blood, signs of dehydration, or symptoms worsen.

I can help you find a gastroenterologist or schedule with your primary care physician. Would you like assistance?"

## Response Guidelines

### Keep It Brief
- Maximum 4-5 bullet points for immediate care
- One clear "when to see a doctor" section
- End with appointment booking offer

### Always Include
- 2-3 immediate self-care steps
- Clear warning signs that need medical attention
- Offer to help book appropriate specialist or GP

### Professional Boundaries
- Provide general first-aid advice, not medical diagnosis
- Always recommend professional care for persistent/severe symptoms
- Guide users to appropriate healthcare providers

### Emergency Protocol
For serious symptoms (chest pain, difficulty breathing, severe injury):
"This could be a medical emergency. Please call emergency services immediately or go to the nearest emergency room. Do not delay seeking immediate medical care."

## Specialist Recommendations

**Common Conditions → Specialists:**
- Skin issues → Dermatologist
- Heart/chest concerns → Cardiologist  
- Breathing problems → Pulmonologist
- Digestive issues → Gastroenterologist
- Joint/muscle pain → Orthopedist
- Mental health → Psychiatrist/Psychologist
- Children's health → Pediatrician
- Women's health → Gynecologist
- Eye problems → Ophthalmologist

## Key Principles

✅ **Helpful First**: Provide immediate practical steps
✅ **Safety First**: Clear warning signs for medical care
✅ **Concise**: Keep responses focused and actionable
✅ **Professional Guidance**: Always offer to help find appropriate care
✅ **Balanced**: Useful advice + professional recommendation

You are designed to be a helpful first point of contact that empowers users with immediate guidance while ensuring they get proper medical care when needed.`;








export async function chatHandler(req, res) {
  try {
    const { prompt } = req.body || {};
    // console.log(prompt);
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    // If environment has GEMINI_API_KEY (Google Generative API), proxy to Google
    if (process.env.GEMINI_API_KEY) {
      try {
        // CORRECT URL
          const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
          const googleResp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nUser: ${prompt}`
                  }
                ]
              }
            ]
          }),
        });

        // console.log("Google Generative API response status:", googleResp.status);

        if (!googleResp.ok) {
          const text = await googleResp.text();
          console.error(`Google Generative API returned status ${googleResp.status}:`, text);
        } else {
          const contentType = googleResp.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            let json = null;
            try {
              json = await googleResp.json();
            } catch (parseErr) {
              console.warn("Failed to parse Google Generative API JSON response:", parseErr);
              const raw = await googleResp.text().catch(() => "");
              console.warn("Raw response:", raw.slice(0, 1000));
            }

            const reply =
              json?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (reply) return res.json({ reply });
          } else {
            const raw = await googleResp.text().catch(() => "");
            console.error(
              "Google Generative API returned non-JSON content-type:",
              contentType,
              "raw:",
              raw.slice(0, 200)
            );
          }
        }
      } catch (gErr) {
        console.error("Google Generative API error:", gErr);
        // fall through to other options
      }
    }

    // No OpenAI proxy: use GEMINI_API_KEY if present, otherwise fall back to canned replies.
    const lower = prompt.toLowerCase();
    if (lower.includes("fever"))
      return res.json({
        reply:
          "For fever: rest, hydrate, paracetamol/ibuprofen as appropriate. Seek care for high/persistent fever."
      });
    if (lower.includes("headache"))
      return res.json({
        reply:
          "For headache: rest in dark room, hydrate, OTC pain relief; seek care for sudden severe headache."
      });
    if (lower.includes("book"))
      return res.json({
        reply:
          "To book an appointment, open a doctor's profile and choose an available slot or tell me which specialty you need."
      });

    return res.json({
      reply:
        "Sorry, I couldn't understand. Try rephrasing or ask about booking, payments, or profile."
    });
  } catch (err) {
    console.error("chatHandler error", err);
    res.status(500).json({ error: "internal error" });
  }
}
