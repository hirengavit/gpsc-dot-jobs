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
- Cell organelle → કોષીય અંગિકા
- Organelle → અંગિકા
- Eukaryotic cell → સુકોષકેન્દ્રીય કોષ
- Specialisation → વિશિષ્ટીકરણ
- Cytoplasm → કોષરસ
- Material → સામગ્રી
- Fluid → તરલ
- Ribosomes → રિબોઝોમ્સ
- Prokaryotic cell → આદિકોષકેન્દ્રીય કોષ
- Protein synthesis → પ્રોટીનસંશ્લેષણ
- Protein → પ્રોટીન
- Enzymes → એન્ઝાઇમ્સ
- Endoplasmic reticulum → અંતઃકોષરસજાળ
- Transport → પરિવહન
- Secretion → સ્રાવ
- Smooth endoplasmic reticulum → લીસી અંતઃકોષરસજાળ
- Lipids → લિપિડ્સ
- Liver → યકૃત
- Cell membrane → કોષરસપટલ
- Golgi apparatus → ગોલ્ગી પ્રસાધન
- Lysosome → લાયસોઝોમ
- Digestion → પાચન
- Digestive enzyme → પાચક ઉત્સેચક
- Biology → જીવશાસ્ત્ર
- Suicide → આત્મહત્યા
- Recycling → પુનઃચક્રણ
- Energy → ઊર્જા
- Cellular respiration → કોષીય શ્વસન
- Adenosine triphosphate → એડિનોસાઇન ટ્રાયફોસ્ફેટ
- Currency → ચલણ
- Mitochondrion → કણાભસૂત્ર
- Surface area → સપાટીનું ક્ષેત્રફળ
- DNA → ડી.એન.એ.
- Organism → સજીવ
- Photosynthesis → પ્રકાશસંશ્લેષણ
- Plant cell → વનસ્પતિકોષ
- Algae → શેવાળ
- Chloroplast → હરિતકણ
- Chlorophyll → હરિતદ્રવ્ય
- Light energy → પ્રકાશઊર્જા
- Chemical energy → રાસાયણિક ઊર્જા
- Pigment → રંજકદ્રવ્ય
- Starch → સ્ટાર્ચ
- Production → ઉત્પાદન
- Vacuoles → રસધાનીઓ
- Central vacuole → કેન્દ્રસ્થ રસધાની
- Vacuole → રસધાની
- Pressure → દબાણ
- Unicellular organism → એકકોષી સજીવ
- Food vacuole → અન્નધાની
- Supply → પુરવઠો
- Prelims focus → પરીક્ષાલક્ષી મુદ્દા
- Trap: → ધ્યાન રાખો:
- Chromosomes → રંગસૂત્રો
- Genes → જનીનતત્ત્વો
- Hereditary → વંશપરંપરાગત
- Nuclear membrane → કોષકેન્દ્રપટલ
- Chromatin → રંગસૂત્રીય દ્રવ્ય
- Genetic material → આનુવંશિક પદાર્થ
- Deoxyribonucleic acid → ડી-ઓક્સિરિબોન્યુક્લિક એસિડ
- Gene → જનીન
- Cell nucleus → કોષકેન્દ્ર
- Environmental conditions → પર્યાવરણીય પરિસ્થિતિઓ
- Nucleoid → ન્યુક્લિઓઇડ
- Cell division → કોષવિભાજન
- Multicellular organism → બહુકોષીય સજીવ
- Tissue → પેશી
- Nerve cell → ચેતા કોષ
- Muscle cell → સ્નાયુકોષ
- Chromosome → રંગસૂત્ર
- Red blood cell → રક્તકણ
- Maturation → પરિપક્વતા
- Haemoglobin → હિમોગ્લોબિન
- Oxygen → ઓક્સિજન
- Plant tissue → વનસ્પતિ પેશી
- Simple permanent tissue → સરળ સ્થાયી પેશી
- Permanent tissue → સ્થાયી પેશી
- Cell wall → કોષદીવાલ
- Intercellular space → આંતરકોષીય અવકાશ
- Differentiation → વિભેદીકરણ
- Apical meristem → અગ્રસ્થ વર્ધનશીલ પેશી
- Length → લંબાઈ
- Root tip → મૂળાગ્ર
- Soil → જમીન
- Intercalary meristem → આંતરવિષ્ટ વર્ધનશીલ પેશી
- Lateral meristem → પાર્શ્વીય વર્ધનશીલ પેશી
- Diameter → વ્યાસ
- Complex permanent tissue → જટિલ સ્થાયી પેશી
- Parenchyma → મૃદુત્તક
- Aerenchyma → વાયુત્તક પેશી
- Gas → વાયુ
- Collenchyma → સ્થૂલકોણક પેશી
- Epidermis → અધિસ્તર
- Sclerenchyma → દઢોત્તક પેશી
- Lignin → લિગ્નીન
- Maturity → પરિપક્વતા
- Leaf vein → પર્ણશિરા
- Coconut → નાળિયેર
- Plant fibres → વનસ્પતિના રેસા
These terms are a reference for consistent terminology. Use them where they apply and translate everything else normally; this list is not complete.
