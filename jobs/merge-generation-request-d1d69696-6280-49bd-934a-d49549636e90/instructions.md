# MERGE two Gujarati translations of 3 items

Follow DOT.md. This is a **merge** job, not a fresh translation: two translators have already translated the
same English items, and you produce the best final Gujarati by merging them, as the brief below explains.

- English source: `inputs/english.json`
- Candidate 1: `inputs/candidate_1.json`
- Candidate 2: `inputs/candidate_2.json`
- Answer: `out/gujarati.json`, a JSON array with the same keys as the candidate items (title, body, artifact_id, pictures)
- Gujarati textbooks for terminology: `/workspace/shared/GPSC_GUJ_34_Files_2026-10-02/` (start with
  `GPSC_GUJ_00_MASTER_SYLLABUS_AND_AGGREGATOR_GUIDE.pdf`). Use one Gujarati term per concept across all items.

Run `node check.mjs` until it prints PASS, commit only `out/`, and ALWAYS comment DONE on the PR (or STUCK and why),
even if another instruction says not to post messages: the app reads nothing else.

---

You are the final editor of a Gujarati translation of exam study material (reading material pages).

Two independent translators translated the same English items. Their work is given below as "Candidate 1" and "Candidate 2". Both passed the automatic structure checks; neither is known to be better.

YOUR TASK

Produce the best final Gujarati version of every item by truly merging the two candidates. Candidate 1 and Candidate 2 are equals: neither is the default, and their order means nothing. Do not keep one candidate's text and only touch it up.

Work sentence by sentence against the English:
1. Read both candidates' versions of the sentence side by side.
2. Choose the one that a Gujarati-medium student understands faster on first reading: more natural Gujarati word order, the standard textbook or exam term, plainer and shorter wording, with the full meaning of the English.
3. Where each candidate is better in a different part of the sentence (one has the better term, the other the better word order or a smoother verb), combine them into one sentence.
4. If both are equally good, either is fine; but across an item you should normally find sentences where each candidate is the better one. If you end up keeping almost everything from one candidate, check again whether the other has the more natural phrasing in some places.

Do not retranslate from scratch where a candidate already expresses the meaning well; the improvement comes from choosing and combining their best wording.

AIM FOR THE STUDENT

The reader is a Gujarati-medium student preparing for a competitive exam, who must understand this material on first reading and recall it in the exam hall. Prefer the wording that is simple, natural and easy to remember: everyday Gujarati sentence order, short clear sentences, and familiar words over heavy literal or Sanskritised phrasing. Keep the standard exam and textbook terms students meet in their books and question papers (use the terms list where given); explain nothing extra, but never choose an obscure word when a plain one says the same thing exactly.

Judge the wording as an experienced Gujarati teacher would. Where the English uses an unusual, abstract or foreign-sounding expression for an ordinary idea, translate the intended meaning, not the surface image: choose the expression a good Gujarati textbook or question paper would use for that idea, so the student never has to decode a literal rendering. Fidelity means the same meaning and facts, not the same metaphor.

FIDELITY

- The English items control every fact. Preserve every claim, qualification, condition, negation, number, date, name, example and distinction of the English. If both candidates lost or changed a detail, restore it from the English.
- Do not add explanations, facts, examples, summaries or citations.
- Keep every citation in square brackets exactly as it appears in the English, character for character.
- Write all numbers with the digits 0-9.
- Use the same term for the same concept throughout. Where a terms list is given below, use its Gujarati term for that English term.

STRUCTURE

- Return exactly 3 items, with the same artifact_id values in the same order as the English items. Never add, drop, merge or reorder items.
- Give every item exactly the same keys as the candidate items. Keep correct_option exactly as in the English when it is present.
- Keep the HTML structure of the English: the same elements, nesting, lists, tables and attributes. Change only the text inside the tags. Keep LaTeX and formulas unchanged.
- Keep every picture slot <figure data-picture="pic-..."> byte-identical. When an item has a "pictures" list, return it with the same ids and the same fields, choosing the better translated words for each picture. Keep each alt under 300 characters and each caption under 140 characters; if the better wording is longer, shorten it without losing its meaning.

OUTPUT

Write the JSON array to out/gujarati.json (one object per item, in the English order, with the same keys as the candidate items: title, body, artifact_id, pictures). Keep HTML tags literal inside correctly escaped JSON strings. Do not mention the candidates, the translators or your choices anywhere in the output.

ENGLISH SOURCE ITEMS

(in inputs/english.json)

CANDIDATE 1

(in inputs/candidate_1.json)

CANDIDATE 2

(in inputs/candidate_2.json)

TERMS FOUND IN THIS TEXT (reference)
- Autotrophic nutrition → સ્વયંપોષી પોષણ
- Photosynthesis → પ્રકાશસંશ્લેષણ
- Nutrition → પોષણ
- Organism → સજીવ
- Energy → ઊર્જા
- Material → સામગ્રી
- Life processes → જૈવિક ક્રિયાઓ
- Nutrients → પોષક તત્ત્વો
- Inorganic substance → અકાર્બનિક પદાર્થ
- Carbon dioxide → કાર્બન ડાયોક્સાઇડ
- Fungi → ફૂગ
- Heterotrophic nutrition → વિષમપોષી પોષણ
- Algae → શેવાળ
- Heterotroph → વિષમપોષી
- Supply → પુરવઠો
- Carbohydrate → કાર્બોહાઇડ્રેટ
- Soil → જમીન
- Mineral → ખનિજ
- Metabolism → ચયાપચય
- Chlorophyll → હરિતદ્રવ્ય
- Light energy → પ્રકાશઊર્જા
- Oxygen → ઓક્સિજન
- Pigment → રંજકદ્રવ્ય
- Chemical energy → રાસાયણિક ઊર્જા
- Organic compound → કાર્બનિક સંયોજન
- Carbon → કાર્બન
- Atmosphere → વાતાવરણ
- Glucose → ગ્લુકોઝ
- Starch → સ્ટાર્ચ
- Equation → સમીકરણ
- Cellular respiration → કોષીય શ્વસન
- Tissue → પેશી
- Organic matter → કાર્બનિક પદાર્થ
- Food chain → આહાર શૃંખલા
- Herbivores → તૃણાહારી પ્રાણીઓ
- Carnivores → માંસાહારી પ્રાણીઓ
- Production → ઉત્પાદન
- Atmospheric oxygen → વાતાવરણીય પ્રાણવાયુ
- Autotroph → સ્વયંપોષી
- Prelims focus → પરીક્ષાલક્ષી મુદ્દા
- Raw materials → કાચા માલ
- Trap: → ધ્યાન રાખો:
- Biology → જીવશાસ્ત્ર
- Hill → ટેકરી
- Gas → વાયુ
- Transport system → પરિવહન પ્રણાલી
- Vein → શિરા
- Vascular tissue → વાહકપેશી
- Chloroplast → હરિતકણ
- Organelle → અંગિકા
- Cell organelle → કોષીય અંગિકા
- Gas exchange → વાતવિનિમય
- Epidermis → અધિસ્તર
- Water vapour → પાણીની વરાળ
- Species → પ્રજાતિ
- Stoma → વાયુરંધ્ર
- Root hair → મૂળરોમ
- Surface area → સપાટીનું ક્ષેત્રફળ
- Xylem → જલવાહક પેશી
- Nitrogen → નાઇટ્રોજન
- Phosphorus → ફોસ્ફરસ
- Magnesium → મેગ્નેશિયમ
- Iron → લોખંડ
- Protein → પ્રોટીન
- Acid → એસિડ
- Atmospheric nitrogen → વાતાવરણીય નાઇટ્રોજન
- Compound → સંયોજન
- Microorganisms → સૂક્ષ્મજીવાણુઓ
- Bacteria → જીવાણુ
- Leguminous plants → શિમ્બી કુળની વનસ્પતિ
- Nutrient → પોષક તત્ત્વ
- Transport → પરિવહન
- Phloem → અન્નવાહક પેશી
- Chemical reaction → રાસાયણિક પ્રક્રિયા
- Molecule → અણુ
- Drought → દુષ્કાળ
- Electron → ઇલેક્ટ્રૉન
- Hydrogen ion → હાઇડ્રોજન આયન
- Insoluble → અદ્રાવ્ય
- Respiration → શ્વસનક્રિયા
- Cytoplasm → કોષરસ
These terms are a reference for consistent terminology. Use them where they apply and translate everything else normally; this list is not complete.
