# Winga UI — Localization (Kiswahili + English)

Lugha chaguo-msingi ni **Kiswahili**. Kuna language switch (🇹🇿 SW | 🇬🇧 EN) kwenye navbar. Kila maneno yanayotumika kwenye UI yanapaswa kupitia tafsiri ili yabadilike kwa lugha iliyochaguliwa.

---

## Wakati unaongeza maneno mapya

1. **Ongeza key kwenye message files (Kiswahili + English):**
   - `src/lib/i18n/messages/sw.json` — tafsiri kwa Kiswahili
   - `src/lib/i18n/messages/en.json` — tafsiri kwa English

   Mfano: ikiwa unataka kitufe "Save draft":
   - **sw.json:** ndani ya `"common"` au kategoria inayofaa, ongeza: `"saveDraft": "Hifadhi rasimu"`
   - **en.json:** ongeza: `"saveDraft": "Save draft"`

2. **Tumia `t()` kwenye component:**
   - Import: `import { useT } from "@/lib/i18n";`
   - Kwenye component: `const t = useT();`
   - Badala ya maandishi ngumu: `{t("common.saveDraft")}`

   **Usiweke** maandishi moja kwa moja kama `Save draft` au `Hifadhi` isipokuwa ni placeholder ya kiufundi tu.

---

## Muundo wa keys (structure)

Keys ziko kwa makundi: `common`, `nav`, `home`, `auth`, `job`, `bid`, `subscription`, `dashboard`. Ongeza key mpya ndani ya kikundi kinachofaa, au ongeza kikundi kipya ikiwa unahitaji (k.m. `"contract": { "viewDetails": "..." }`).

- `common.*` — kitufe na maandishi yanayotumika mara kwa mara (Save, Cancel, Next, Back, Loading…)
- `nav.*` — vitu vya navigation (Find Jobs, Pricing, …)
- `home.*` — ukurasa wa kwanza (tagline, testimonials, …)
- `auth.*` — login, register, OTP
- `job.*` — kazi (title, description, budget, search, sort, …)
- `bid.*` — breakdown ya bei (service fee, commission, …)
- `subscription.*` — ujumbe wa usajili wa mwezi
- `dashboard.*` — my jobs, find work, profile, messages, …

---

## Mfano kamili

**1. Ongeza kwenye sw.json:**
```json
"common": {
  ...
  "saveDraft": "Hifadhi rasimu"
}
```

**2. Ongeza kwenye en.json:**
```json
"common": {
  ...
  "saveDraft": "Save draft"
}
```

**3. Kwenye component:**
```tsx
import { useT } from "@/lib/i18n";

export function MyComponent() {
  const t = useT();
  return (
    <button>{t("common.saveDraft")}</button>
  );
}
```

---

## Ukosefu wa key

Ikiwa key haipo kwenye JSON, `t("key.name")` itarudisha `"key.name"` (key yenyewe). Kwa hiyo unaweza kuongeza key baadaye bila kuvunja UI.

---

**Kwa kila maneno mapya unayoyaongeza kwenye system: ongeza key kwenye sw.json na en.json, kisha tumia `t("key")` kwenye UI. Default lugha ni Kiswahili.**
