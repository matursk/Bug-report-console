export default function Podmienky(){
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Zmluvné podmienky a podmienky akcie „5€ za nahlásenie chyby“</h1>

      <p className="opacity-80">Účinnosť týchto podmienok: od 10.10.2025</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Úvod a akceptácia</h2>
        <p>
          Tieto zmluvné podmienky (ďalej len „Podmienky“) upravujú pravidlá používania služby Bug Console
          a špecificky aj podmienky marketingovej akcie „5€ za nahlásenie chyby“ (ďalej len „Akcia“).
          Používaním služby a/alebo účasťou na Akcii vyjadrujete súhlas s týmito Podmienkami a zaväzujete sa
          ich dodržiavať. Ak s Podmienkami nesúhlasíte, Akcie sa nezúčastňujte a službu nepoužívajte.
        </p>
        <p>
          Prevádzkovateľom služby je <strong>Matur</strong>, so sídlom na webe <strong>matur.sk</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Definície</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Prevádzkovateľ</strong>: subjekt, ktorý poskytuje službu Bug Console a organizuje Akciu.</li>
          <li><strong>Používateľ</strong>: fyzická alebo právnická osoba s registrovaným a aktívnym účtom.</li>
          <li><strong>Nahlásenie</strong> (report): oznámenie chyby prostredníctvom in‑app nastavení z účtu Používateľa.</li>
          <li><strong>Platné nahlásenie</strong>: nahlásenie spĺňajúce obsahové a kvalitatívne kritériá podľa týchto Podmienok.</li>
          <li><strong>Duplicitné nahlásenie</strong>: nahlásenie tej istej chyby, ktorá už bola platne nahlásená iným Používateľom.</li>
          <li><strong>Schválenie</strong>: rozhodnutie moderátora alebo administrátora, že nahlásenie je platné a spĺňa podmienky pre odmenu.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Trvanie Akcie a oznámenia</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Akcia platí od <strong>10.10.2025</strong> do odvolania Prevádzkovateľom.</li>
          <li>Ukončenie Akcie bude oznámené <strong>najmenej 14 dní vopred</strong> v aplikácii a na tejto stránke.</li>
          <li>Akékoľvek zmeny týchto Podmienok budú oznámené <strong>najmenej 3 dni vopred</strong> v aplikácii a na tejto stránke.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Oprávnenosť</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Účasť je podmienená existenciou aktívneho účtu Používateľa a súladom s právnymi predpismi.</li>
          <li>Používateľ potvrdzuje, že je spôsobilý na právne úkony a jeho účasť nie je obmedzená miestnymi predpismi.</li>
          <li>Prevádzkovateľ si vyhradzuje právo vyžiadať si overenie identity alebo doplnenie údajov na účely prevencie zneužitia.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Mechanizmus nahlásenia</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Odmena sa vzťahuje <strong>výlučne</strong> na chyby nahlásené <strong>z vášho účtu</strong> cez <strong>nastavenia v aplikácii</strong> (in‑app).</li>
          <li>Nahlásenie musí obsahovať jasný popis, kroky reprodukcie, očakávané vs. skutočné správanie a technické detaily (verzia aplikácie, platforma/zariadenie).</li>
          <li>Chyba musí byť <strong>reprodukovateľná</strong>; neúplné, nekoherentné alebo neoveriteľné nahlásenia môžu byť zamietnuté.</li>
          <li>Publikovanie detailov chyby mimo aplikácie pred opravou je v rozpore so zásadami zodpovedného nahlasovania.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Posúdenie nahlásení</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nahlásenia posudzujú moderátori/administrátori; rozhodnutie môže byť <em>schválené</em>, <em>čiastočné</em>, <em>zamietnuté</em> alebo <em>eskalované</em>.</li>
          <li>Rozhodnutie je Používateľovi oznámené v aplikácii; Prevádzkovateľ môže vyžiadať doplnenie informácií.</li>
          <li>Duplicitné nahlásenia sú bez nároku na odmenu; prioritu má <strong>prvé platné</strong> nahlásenie tej istej chyby.</li>
          <li>Prevádzkovateľ posúdi nahlásenie <strong>do 3 pracovných dní</strong> od jeho doručenia, pokiaľ mimoriadne okolnosti nebránia dodržaniu lehoty.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Odmena a výplata</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Za <strong>schválené</strong> nahlásenie sa priznáva odmena <strong>5 €</strong>, ktorá sa pripíše na zostatok účtu Používateľa.</li>
          <li>Za čiastočne uznané nahlásenia sa odmena nepriznáva, pokiaľ Prevádzkovateľ neustanoví inak.</li>
          <li>Výber odmien je možný prostredníctvom dostupných metód v časti <em>Výbery</em>. <strong>Minimálna suma na výber je 10 €</strong>.</li>
          <li><strong>Neúčtujeme poplatky</strong> za výplatu; poplatky tretích strán neaplikujeme.</li>
          <li>Po schválení výberu bude výplata spracovaná <strong>do 5 pracovných dní</strong>.</li>
          <li>Pri chybe väčšej závažnosti si Prevádzkovateľ vyhradzuje právo poskytnúť <strong>mimoriadnu (extra) odmenu</strong>.</li>
          <li>Prevádzkovateľ môže dočasne pozastaviť výplatu pri podozrení na zneužitie, až do ukončenia preverenia.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Limity a prevencia zneužitia</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hromadné, automatizované alebo zjavne špekulatívne nahlásenia môžu viesť k odmietnutiu či zablokovaniu účtu.</li>
          <li>Prevádzkovateľ je oprávnený obmedziť frekvenciu nahlásení alebo zaviesť dodatočné overovanie kvality.</li>
          <li><strong>Zamestnanci Prevádzkovateľa</strong> nie sú oprávnení získať odmenu v rámci Akcie.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. Neuznateľné nahlásenia</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Požiadavky na funkcie (feature requests), kozmetické nedostatky bez dopadu, drobné preklepy, či chyby mimo pôsobnosti služby.</li>
          <li>Problémy už uvedené v zozname známych chýb alebo chyby spôsobené nedodržaním návodu Používateľom.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">10. Zodpovedné nahlasovanie a bezpečnosť</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Používateľ sa zdrží konania, ktoré by viedlo k neoprávnenému prístupu, strate dát alebo narušeniu dostupnosti služby.</li>
          <li>Testovanie vykonávajte primerane a neprekračujte zákonné ani etické hranice.</li>
          <li><strong>Safe harbor</strong>: Pri nahlasovaní v dobrej viere a dodržaní týchto pravidiel nebudeme voči Používateľovi uplatňovať právne kroky týkajúce sa samotného nahlásenia.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">11. Dane a zákonné povinnosti</h2>
        <p>
          Používateľ je výhradne zodpovedný za splnenie všetkých daňových, odvodových a účtovných povinností
          vyplývajúcich z prijatia odmien. Prevádzkovateľ neposkytuje daňové poradenstvo.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">12. Duševné vlastníctvo a licencia</h2>
        <p>
          Odoslaním nahlásenia udeľujete Prevádzkovateľovi nevýlučnú, bezodplatnú, časovo a územne neobmedzenú licenciu
          na použitie obsahu nahlásenia (vrátane textu, obrázkov a príloh) na účely analýzy, testovania, opráv,
          dokumentácie a zlepšovania služby. Zodpovedáte za to, že zaslaný obsah neporušuje práva tretích osôb.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">13. Ochrana osobných údajov</h2>
        <p>
          Osobné údaje sú spracúvané v súlade s príslušnými právnymi predpismi a internými zásadami ochrany súkromia.
          Rozsah a účel spracúvania zahŕňa komunikáciu s Používateľom, vyhodnotenie nahlásenia a vedenie záznamov o odmenách.
          Údaje uchovávame <strong>na dobu neurčitú</strong> za účelom zlepšovania aplikácie a jej funkcií. Používateľ môže kedykoľvek
          požiadať o <strong>vymazanie (purge)</strong> svojich údajov; žiadosti budú posudzované v súlade s právnymi predpismi a
          technickými možnosťami.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">14. Záruky a zodpovednosť</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Služba a Akcia sa poskytujú „tak ako sú“, bez záruk akéhokoľvek druhu, či už výslovných alebo predpokladaných.</li>
          <li>V maximálnom rozsahu povolenom právom Prevádzkovateľ neodpovedá za nepriamu, následnú, mimoriadnu alebo sankčnú škodu.</li>
          <li>Žiadne ustanovenie týchto Podmienok nevylučuje ani neobmedzuje zodpovednosť, ktorú nie je možné vylúčiť podľa platného práva.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">15. Rozhodné právo a riešenie sporov</h2>
        <p>
          Tieto Podmienky sa spravujú právnym poriadkom Slovenskej republiky a Prevádzkovateľ sídli na území SR. Spory
          vyplývajúce z týchto Podmienok sa budú primárne riešiť zmierom; ak k dohode nedôjde, príslušným je súd podľa
          sídla Prevádzkovateľa, ak kogentné predpisy neustanovujú inak. Neustanovujeme žiadne dodatočné osobitné režimy
          pre spotrebiteľov nad rámec platných právnych predpisov.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">16. Záverečné ustanovenia</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Neplatnosť alebo nevykonateľnosť ktoréhokoľvek ustanovenia nemá vplyv na platnosť ostatných ustanovení.</li>
          <li>Prevádzkovateľ je oprávnený previesť práva a povinnosti zo vzťahu s Používateľom na nástupcu alebo prepojený subjekt.</li>
          <li>Tieto Podmienky predstavujú úplnú dohodu medzi stranami vo veci Akcie a používania služby.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">17. Kontakt a odvolanie</h2>
        <p>V prípade otázok alebo žiadostí nás kontaktujte prostredníctvom podpory v aplikácii. Odvolanie voči rozhodnutiu o nahlásení je možné podať prostredníctvom <strong>support ticketu</strong>.</p>
      </section>
    </div>
  )
}


