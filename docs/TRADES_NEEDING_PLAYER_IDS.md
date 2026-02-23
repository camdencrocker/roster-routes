# Trades With Unmapped Player IDs

**Total trades affected:** 1023  
**Unique players needing IDs:** 1255 (see `docs/UNMAPPED_PLAYER_IDS.json`)

**Fix:** Add entries to `app/data/player-id-mappings.json` in format:
```json
"placeholderId": "nbaId"
```
Then run: `node scripts/apply-player-id-mappings.mjs`

**NBA ID lookup:** Basketball Reference or NBA Stats. Use numeric ID when available.

---

## 20260205-BOS-BKN | 2026-02-05 | BOS ↔ BKN

- **Josh Minott** — `name-josh-minott` → need NBA ID

## 2024-25-bbr-0788 | 2025-06-30 | CHI ↔ LAL

- **Rocco Zikarsky** — `name-rocco_zikarsky` → need NBA ID
- **Lachlan Olbrich** — `name-lachlan_olbrich` → need NBA ID

## 2024-25-bbr-0789 | 2025-06-30 | CHO ↔ PHO

- **Liam McNeeley** — `name-liam_mcneeley` → need NBA ID

## 2024-25-bbr-0785 | 2025-06-26 | LAC ↔ NYK

- **Mohamed Diawara** — `name-mohamed_diawara` → need NBA ID
- **Luka Mitrovic** — `name-luka_mitrovic` → need NBA ID
- **Kobe Sanders** — `name-kobe_sanders` → need NBA ID

## 2024-25-bbr-0786 | 2025-06-26 | BOS ↔ ORL

- **Noah Penda** — `name-noah_penda` → need NBA ID
- **Max Shulga** — `name-max_shulga` → need NBA ID
- **Amari Williams** — `name-amari_williams` → need NBA ID

## 2024-25-bbr-0781 | 2025-06-25 | MEM ↔ POR

- **Hansen Yang** — `name-hansen_yang` → need NBA ID
- **Cedric Coward** — `name-cedric_coward` → need NBA ID

## 2024-25-bbr-0782 | 2025-06-25 | ATL ↔ NOP

- **Derik Queen** — `name-derik_queen` → need NBA ID
- **Asa Newell** — `name-asa_newell` → need NBA ID

## 2024-25-bbr-0783 | 2025-06-25 | OKC ↔ SAC

- **Nique Clifford** — `name-nique_clifford` → need NBA ID

## 2024-25-bbr-0784 | 2025-06-25 | UTA ↔ WAS

- **Will Riley** — `name-will_riley` → need NBA ID
- **Jamir Watkins** — `name-jamir_watkins` → need NBA ID
- **Walter Clayton Jr.** — `name-walter_clayton_jr` → need NBA ID

## 2024-25-bbr-0780 | 2025-06-17 | IND ↔ NOP

- **Asa Newell** — `name-asa_newell` → need NBA ID

## 2024-25-bbr-0779 | 2025-06-15 | MEM ↔ ORL

- **Yang Hansen** — `name-yang_hansen` → need NBA ID

## 2024-25-bbr-0770 | 2025-02-06 | LAC ↔ MIL

- **Kevin Porter Jr.** — `name-kevin_porter_jr` → need NBA ID

## 2024-25-bbr-0771 | 2025-02-06 | ATL ↔ LAC

- **Mohamed Diawara** — `name-mohamed_diawara` → need NBA ID
- **Bones Hyland** — `name-bones_hyland` → need NBA ID

## 2024-25-bbr-0772 | 2025-02-06 | ATL ↔ HOU

- **Alpha Kaba** — `name-alpha_kaba` → need NBA ID

## 2024-25-bbr-0773 | 2025-02-06 | MIL ↔ NYK

- **Hugo Besson** — `name-hugo_besson` → need NBA ID
- **Mathias Lessort** — `name-mathias_lessort` → need NBA ID
- **Bogoljub Markovic** — `name-bogoljub_markovic` → need NBA ID
- **Patrick Baldwin Jr.** — `name-patrick_baldwin_jr` → need NBA ID

## 2024-25-bbr-0775 | 2025-02-06 | NOP ↔ TOR

- **Bruce Brown** — `name-bruce_brown` → need NBA ID

## 2024-25-bbr-0777 | 2025-02-06 | DET ↔ PHI

- **K.J. Martin** — `name-kj_martin` → need NBA ID

## 2024-25-bbr-0778 | 2025-02-06 | DET ↔ UTA

- **K.J. Martin** — `name-kj_martin` → need NBA ID
- **Kasparas Jakucionis** — `name-kasparas_jakucionis` → need NBA ID

## 2024-25-multi-090 | 2025-02-06 | MIL ↔ NYK ↔ SAS ↔ WAS

- **Hugo Besson** — `name-hugo_besson` → need NBA ID
- **Mathias Lessort** — `name-mathias_lessort` → need NBA ID
- **Bogoljub Markovic** — `name-bogoljub_markovic` → need NBA ID
- **Patrick Baldwin Jr.** — `name-patrick_baldwin_jr` → need NBA ID

## 2024-25-multi-091 | 2025-02-06 | MEM ↔ SAC ↔ WAS

- **Walter Clayton Jr.** — `name-walter_clayton_jr` → need NBA ID
- **Marvin Bagley** — `name-marvin_bagley` → need NBA ID
- **Javon Small** — `name-javon_small` → need NBA ID

## 2024-25-multi-092 | 2025-02-06 | DET ↔ GSW ↔ MIA ↔ TOR ↔ UTA

- **K.J. Martin** — `name-kj_martin` → need NBA ID
- **Kasparas Jakucionis** — `name-kasparas_jakucionis` → need NBA ID

## 2025-26-033 | 2025-02-06 | MIL ↔ SWA

- **Khris Middleton** — `name-khris-middleton` → need NBA ID
- **A.J. Johnson** — `name-aj-johnson` → need NBA ID
- **Wizards option** — `name-wizards-option` → need NBA ID
- **Kyle Kuzma** — `name-kyle-kuzma` → need NBA ID
- **Jericho Sims** — `name-jericho-sims` → need NBA ID

## 2024-25-multi-071 | 2025-02-06 | MIL ↔ NYK ↔ SAS ↔ WAS

- **Hugo Besson** — `name-hugo_besson` → need NBA ID
- **Mathias Lessort** — `name-mathias_lessort` → need NBA ID
- **Patrick Baldwin Jr.** — `name-patrick_baldwin_jr` → need NBA ID

## 2024-25-multi-072 | 2025-02-06 | MEM ↔ SAC ↔ WAS

- **Marvin Bagley** — `name-marvin_bagley` → need NBA ID

## 2024-25-multi-073 | 2025-02-06 | DET ↔ GSW ↔ MIA ↔ TOR ↔ UTA

- **K.J. Martin** — `name-kj_martin` → need NBA ID

## 2024-25-bbr-0769 | 2025-02-04 | DAL ↔ PHI

- **Johni Broome** — `name-johni_broome` → need NBA ID

## 2024-25-multi-089 | 2025-02-03 | CHI ↔ SAC ↔ SAS

- **Noa Essengue** — `name-noa_essengue` → need NBA ID
- **Maxime Raynaud** — `name-maxime_raynaud` → need NBA ID

## 2024-25-multi-088 | 2025-02-02 | DAL ↔ LAL ↔ UTA

- **John Tonje** — `name-john_tonje` → need NBA ID

## 2024-25-bbr-0766 | 2025-02-01 | LAC ↔ UTA

- **Mohamed Bamba** — `name-mohamed_bamba` → need NBA ID

## 2024-25-bbr-0765 | 2025-01-21 | PHO ↔ UTA

- **Liam McNeeley** — `name-liam_mcneeley` → need NBA ID

## 2024-25-bbr-0764 | 2025-01-15 | CHO ↔ PHO

- **Alex Toohey** — `name-alex_toohey` → need NBA ID

## 2024-25-bbr-0762 | 2024-12-15 | BRK ↔ GSW

- **Koby Brea** — `name-koby_brea` → need NBA ID
- **De'Anthony Melton** — `name-deanthony_melton` → need NBA ID

## 2024-25-multi-087 | 2024-10-02 | CHA ↔ MIN ↔ NYK

- **James Nnaji** — `name-james_nnaji` → need NBA ID
- **Alex Toohey** — `name-alex_toohey` → need NBA ID
- **Charlie Brown Jr.** — `name-charlie_brown_jr` → need NBA ID
- **Duane Washington Jr.** — `name-duane_washington_jr` → need NBA ID
- **Joan Beringer** — `name-joan_beringer` → need NBA ID

## 2024-25-793 | 2024-10-02 | CHA ↔ JAM

- **rights** — `name-rights` → need NBA ID
- **Charlie Brown Jr.** — `name-charlie-brown-jr` → need NBA ID
- **DaQuan Jeffries** — `name-daquan-jeffries` → need NBA ID
- **Duane Washington Jr.** — `name-duane-washington-jr` → need NBA ID

## 2024-25-multi-070 | 2024-10-02 | CHA ↔ MIN ↔ NYK

- **James Nnaji** — `name-james_nnaji` → need NBA ID
- **Charlie Brown Jr.** — `name-charlie_brown_jr` → need NBA ID
- **Duane Washington Jr.** — `name-duane_washington_jr` → need NBA ID

## 2024-25-bbr-0759 | 2024-07-19 | BRK ↔ MEM

- **Nemanja Dangubic** — `name-nemanja_dangubic` → need NBA ID

## 2024-25-bbr-0758 | 2024-07-18 | LAC ↔ UTA

- **Balsa Koprivica** — `name-balsa_koprivica` → need NBA ID

## 2024-25-multi-086 | 2024-07-08 | CHI ↔ SAC ↔ SAS

- **Rocco Zikarsky** — `name-rocco_zikarsky` → need NBA ID

## 2024-25-bbr-0748 | 2024-07-06 | ATL ↔ NOP

- **Larry Nance Jr.** — `name-larry_nance_jr` → need NBA ID
- **Drake Powell** — `name-drake_powell` → need NBA ID

## 2024-25-bbr-0749 | 2024-07-06 | CHO ↔ DAL

- **Johni Broome** — `name-johni_broome` → need NBA ID
- **Alex Toohey** — `name-alex_toohey` → need NBA ID

## 2024-25-bbr-0750 | 2024-07-06 | BRK ↔ NYK

- **Juan Pablo Vaulet** — `name-juan_pablo_vaulet` → need NBA ID
- **Ben Saraf** — `name-ben_saraf` → need NBA ID
- **Nolan Traoré** — `name-nolan_traor` → need NBA ID
- **Adou Thiero** — `name-adou_thiero` → need NBA ID

## 2024-25-bbr-0751 | 2024-07-06 | DET ↔ MEM

- **Cam Spencer** — `name-cam_spencer` → need NBA ID
- **Ulrich Chomche** — `name-ulrich_chomche` → need NBA ID
- **Bobi Klintman** — `name-bobi_klintman` → need NBA ID
- **Wendell Moore Jr.** — `name-wendell_moore_jr` → need NBA ID

## 2024-25-bbr-0752 | 2024-07-06 | CHO ↔ SAS

- **Ryan Kalkbrenner** — `name-ryan_kalkbrenner` → need NBA ID

## 2024-25-bbr-0753 | 2024-07-06 | POR ↔ WAS

- **Carlton Carrington** — `name-carlton_carrington` → need NBA ID

## 2024-25-bbr-0754 | 2024-07-06 | GSW ↔ POR

- **Quinten Post** — `name-quinten_post` → need NBA ID

## 2024-25-bbr-0755 | 2024-07-06 | DAL ↔ DET

- **Tim Hardaway** — `name-tim_hardaway` → need NBA ID
- **Chaz Lanier** — `name-chaz_lanier` → need NBA ID

## 2024-25-bbr-0756 | 2024-07-06 | IND ↔ SAS

- **Juan Nunez** — `name-juan_nunez` → need NBA ID
- **Johnny Furphy** — `name-johnny_furphy` → need NBA ID

## 2024-25-multi-085 | 2024-07-06 | DET ↔ MEM ↔ MIN ↔ TOR

- **Cam Spencer** — `name-cam_spencer` → need NBA ID
- **Ulrich Chomche** — `name-ulrich_chomche` → need NBA ID
- **Bobi Klintman** — `name-bobi_klintman` → need NBA ID
- **Wendell Moore Jr.** — `name-wendell_moore_jr` → need NBA ID

## 2024-25-792 | 2024-07-06 | MIN ↔ SWA

- **Timberwolves option** — `name-timberwolves-option` → need NBA ID

## 2024-25-bbr-0747 | 2024-06-28 | SAC ↔ TOR

- **Jamal Shead** — `name-jamal_shead` → need NBA ID
- **Sasha Vezenkov** — `name-sasha_vezenkov` → need NBA ID
- **Alijah Martin** — `name-alijah_martin` → need NBA ID

## 2024-25-bbr-0740 | 2024-06-27 | GSW ↔ OKC

- **Quinten Post** — `name-quinten_post` → need NBA ID

## 2024-25-bbr-0741 | 2024-06-27 | OKC ↔ POR

- **Quinten Post** — `name-quinten_post` → need NBA ID
- **Oso Ighodaro** — `name-oso_ighodaro` → need NBA ID

## 2024-25-bbr-0742 | 2024-06-27 | NYK ↔ OKC

- **Ajay Mitchell** — `name-ajay_mitchell` → need NBA ID
- **Oso Ighodaro** — `name-oso_ighodaro` → need NBA ID

## 2024-25-bbr-0743 | 2024-06-27 | DAL ↔ NYK

- **Ariel Hukporti** — `name-ariel_hukporti` → need NBA ID
- **Petteri Koponen** — `name-petteri_koponen` → need NBA ID
- **Melvin Ajinca** — `name-melvin_ajinca` → need NBA ID

## 2024-25-bbr-0744 | 2024-06-27 | NYK ↔ PHO

- **Osasere Ighodaro** — `name-osasere_ighodaro` → need NBA ID
- **Kevin McCullar Jr.** — `name-kevin_mccullar_jr` → need NBA ID

## 2024-25-bbr-0745 | 2024-06-27 | NOP ↔ ORL

- **Antonio Reeves** — `name-antonio_reeves` → need NBA ID

## 2024-25-multi-084 | 2024-06-27 | ATL ↔ HOU ↔ MIA

- **A.J. Griffin** — `name-aj_griffin` → need NBA ID
- **Pelle Larsson** — `name-pelle_larsson` → need NBA ID
- **Nikola Djurisic** — `name-nikola_djurisic` → need NBA ID

## 2023-24-bbr-0735 | 2024-06-26 | DEN ↔ PHO

- **Ryan Dunn** — `name-ryan_dunn` → need NBA ID
- **Kevin McCullar Jr.** — `name-kevin_mccullar_jr` → need NBA ID
- **DaRon Holmes** — `name-daron_holmes` → need NBA ID

## 2023-24-bbr-0736 | 2024-06-26 | BRK ↔ HOU

- **Khaman Maluach** — `name-khaman_maluach` → need NBA ID
- **Danny Wolf** — `name-danny_wolf` → need NBA ID

## 2024-25-bbr-0737 | 2024-06-26 | NYK ↔ WAS

- **Kyshawn George** — `name-kyshawn_george` → need NBA ID
- **Melvin Ajinça** — `name-melvin_ajina` → need NBA ID

## 2024-25-bbr-0739 | 2024-06-26 | NYK ↔ OKC

- **Kobe Sanders** — `name-kobe_sanders` → need NBA ID

## 2023-24-bbr-0734 | 2024-06-21 | CHI ↔ OKC

- **Alex Caruso** — `name-alex_caruso` → need NBA ID
- **Josh Giddey** — `name-josh_giddey` → need NBA ID

## 2023-24-bbr-0717 | 2024-02-08 | DET ↔ UTA

- **Kevin Knox** — `name-kevin_knox` → need NBA ID
- **Gabriele Procida** — `name-gabriele_procida` → need NBA ID
- **Kyle Filipowski** — `name-kyle_filipowski` → need NBA ID

## 2023-24-bbr-0718 | 2024-02-08 | DET ↔ PHI

- **Danuel House** — `name-danuel_house` → need NBA ID
- **Cam Spencer** — `name-cam_spencer` → need NBA ID

## 2023-24-bbr-0719 | 2024-02-08 | TOR ↔ UTA

- **Kira Lewis Jr.** — `name-kira_lewis_jr` → need NBA ID
- **Isaiah Collier** — `name-isaiah_collier` → need NBA ID

## 2023-24-bbr-0720 | 2024-02-08 | BRK ↔ TOR

- **Spencer Dinwiddie** — `name-spencer_dinwiddie` → need NBA ID

## 2023-24-bbr-0721 | 2024-02-08 | DET ↔ NYK

- **Alec Burks** — `name-alec-burks` → need NBA ID
- **Ryan Arcidiacono** — `name-ryan_arcidiacono` → need NBA ID
- **Malachi Flynn** — `name-malachi_flynn` → need NBA ID
- **Evan Fournier** — `name-evan_fournier` → need NBA ID

## 2023-24-bbr-0722 | 2024-02-08 | GSW ↔ IND

- **Quinten Post** — `name-quinten_post` → need NBA ID

## 2023-24-bbr-0723 | 2024-02-08 | CHO ↔ DAL

- **P.J. Washington** — `name-pj_washington` → need NBA ID
- **Ariel Hukporti** — `name-ariel_hukporti` → need NBA ID
- **Grant Williams** — `name-grant_williams` → need NBA ID

## 2023-24-bbr-0725 | 2024-02-08 | DAL ↔ WAS

- **Daniel Gafford** — `name-daniel_gafford` → need NBA ID

## 2023-24-bbr-0727 | 2024-02-08 | MIL ↔ PHI

- **Cameron Payne** — `name-cameron_payne` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID

## 2023-24-bbr-0728 | 2024-02-08 | DET ↔ MIN

- **Monte Morris** — `name-monte_morris` → need NBA ID
- **Troy Brown Jr.** — `name-troy_brown_jr` → need NBA ID

## 2023-24-bbr-0729 | 2024-02-08 | BOS ↔ PHI

- **Adem Bona** — `name-adem_bona` → need NBA ID

## 2023-24-bbr-0730 | 2024-02-08 | BOS ↔ POR

- **Dalano Banton** — `name-dalano_banton` → need NBA ID

## 2023-24-bbr-0731 | 2024-02-08 | MIL ↔ SAC

- **Dimitrios Agravanis** — `name-dimitrios_agravanis` → need NBA ID

## 2023-24-bbr-0732 | 2024-02-08 | DEN ↔ LAC

- **Ismael Kamagate** — `name-ismael_kamagate` → need NBA ID

## 2023-24-bbr-0733 | 2024-02-08 | CHO ↔ OKC

- **Davis Bertans** — `name-davis_bertans` → need NBA ID
- **Tre Mann** — `name-tre_mann` → need NBA ID
- **KJ Simpson** — `name-kj_simpson` → need NBA ID
- **Johni Broome** — `name-johni_broome` → need NBA ID

## 2023-24-multi-082 | 2024-02-08 | IND ↔ PHI ↔ SAS

- **Furkan Korkmaz** — `name-furkan_korkmaz` → need NBA ID
- **Juan Nunez** — `name-juan_nunez` → need NBA ID

## 2023-24-multi-083 | 2024-02-08 | BKN ↔ MEM ↔ PHO

- **Royce O'Neale** — `name-royce_oneale` → need NBA ID
- **Vanja Marinkovic** — `name-vanja_marinkovic` → need NBA ID
- **Jordan Goodwin** — `name-jordan_goodwin` → need NBA ID
- **Chimezie Metu** — `name-chimezie_metu` → need NBA ID
- **Yuta Watanabe** — `name-yuta_watanabe` → need NBA ID

## 2024-25-790 | 2024-02-08 | CHA ↔ OKC

- **Gordon Hayward** — `name-gordon-hayward` → need NBA ID
- **Vasilije Micic** — `name-vasilije-micic` → need NBA ID
- **Tre Mann** — `name-tre-mann` → need NBA ID
- **Davis Bertans** — `name-davis-bertans` → need NBA ID

## 2024-25-791 | 2024-02-08 | DAL ↔ CHA

- **Grant Williams** — `name-grant-williams` → need NBA ID
- **Seth Curry** — `name-seth-curry` → need NBA ID
- **P.J. Washington** — `name-pj-washington` → need NBA ID

## 2023-24-multi-068 | 2024-02-08 | IND ↔ PHI ↔ SAS

- **Furkan Korkmaz** — `name-furkan_korkmaz` → need NBA ID

## 2023-24-bbr-0716 | 2024-02-07 | BOS ↔ MEM

- **Lamar Stevens** — `name-lamar_stevens` → need NBA ID
- **Xavier Tillman Sr.** — `name-xavier_tillman_sr` → need NBA ID

## 2023-24-bbr-0715 | 2024-02-01 | HOU ↔ MEM

- **Ulrich Chomche** — `name-ulrich_chomche` → need NBA ID
- **Jaylen Wells** — `name-jaylen_wells` → need NBA ID
- **Will Richard** — `name-will_richard` → need NBA ID

## 2023-24-bbr-0714 | 2024-01-23 | CHO ↔ MIA

- **Terry Rozier** — `name-terry_rozier` → need NBA ID
- **Kyle Lowry** — `name-kyle_lowry` → need NBA ID

## 2023-24-bbr-0712 | 2024-01-17 | IND ↔ NOP

- **Kira Lewis Jr.** — `name-kira_lewis_jr` → need NBA ID
- **Enrique Freeman** — `name-enrique_freeman` → need NBA ID

## 2023-24-bbr-0713 | 2024-01-17 | IND ↔ TOR

- **Bruce Brown** — `name-bruce_brown` → need NBA ID
- **Kira Lewis Jr.** — `name-kira_lewis_jr` → need NBA ID
- **Jordan Nwora** — `name-jordan_nwora` → need NBA ID
- **Isaiah Collier** — `name-isaiah_collier` → need NBA ID
- **Ja'Kobe Walter** — `name-jakobe_walter` → need NBA ID
- **Pascal Siakam** — `name-pascal_siakam` → need NBA ID

## 2023-24-bbr-0711 | 2024-01-14 | DET ↔ WAS

- **Marvin Bagley** — `name-marvin_bagley` → need NBA ID
- **Isaiah Livers** — `name-isaiah_livers` → need NBA ID
- **Bogoljub Markovic** — `name-bogoljub_markovic` → need NBA ID

## 2023-24-bbr-0710 | 2023-12-30 | NYK ↔ TOR

- **R.J. Barrett** — `name-rj_barrett` → need NBA ID
- **Immanuel Quickley** — `name-immanuel_quickley` → need NBA ID
- **Jonathan Mogbo** — `name-jonathan_mogbo` → need NBA ID
- **Precious Achiuwa** — `name-precious_achiuwa` → need NBA ID
- **OG Anunoby** — `name-og_anunoby` → need NBA ID
- **Malachi Flynn** — `name-malachi_flynn` → need NBA ID

## 2023-24-bbr-0709 | 2023-11-01 | LAC ↔ SAC

- **Dimitrios Agravanis** — `name-dimitrios_agravanis` → need NBA ID

## 2023-24-multi-081 | 2023-11-01 | LAC ↔ OKC ↔ PHI

- **KJ Martin** — `name-kj_martin` → need NBA ID
- **Juan Nunez** — `name-juan_nunez` → need NBA ID

## 2023-24-744 | 2023-11-01 | PHI ↔ SWA

- **Filip Petrusev** — `name-filip-petrusev` → need NBA ID
- **76ers option** — `name-76ers-option` → need NBA ID
- **Nicolas Batum** — `name-nicolas-batum` → need NBA ID
- **Kenyon Martin Jr.** — `name-kenyon-martin-jr` → need NBA ID

## 2023-24-multi-067 | 2023-11-01 | LAC ↔ OKC ↔ PHI

- **KJ Martin** — `name-kj_martin` → need NBA ID

## 2023-24-bbr-0707 | 2023-10-17 | HOU ↔ OKC

- **Kevin Porter Jr.** — `name-kevin_porter_jr` → need NBA ID
- **Jeremiah Robinson-Earl** — `name-jeremiah_robinsonearl` → need NBA ID

## 2023-24-bbr-0706 | 2023-10-01 | BOS ↔ POR

- **Robert Williams** — `name-robert_williams` → need NBA ID
- **Bub Carrington** — `name-bub_carrington` → need NBA ID

## 2023-24-bbr-0704 | 2023-07-17 | PHO ↔ SAS

- **Cameron Payne** — `name-cameron_payne` → need NBA ID
- **Ryan Kalkbrenner** — `name-ryan_kalkbrenner` → need NBA ID

## 2023-24-748 | 2023-07-17 | SAS ↔ PHX

- **Cameron Payne** — `name-cameron-payne` → need NBA ID

## 2023-24-bbr-0703 | 2023-07-12 | ATL ↔ OKC

- **Usman Garuba** — `name-usman_garuba` → need NBA ID
- **Rudy Gay** — `name-rudy_gay` → need NBA ID
- **Ty Ty Washington** — `name-ty_ty_washington` → need NBA ID

## 2023-24-multi-079 | 2023-07-12 | BOS ↔ DAL ↔ SAS

- **Grant Williams** — `name-grant_williams` → need NBA ID
- **Adem Bona** — `name-adem_bona` → need NBA ID
- **Chaz Lanier** — `name-chaz_lanier` → need NBA ID

## 2023-24-749 | 2023-07-12 | DAL ↔ SWA

- **Spurs option** — `name-spurs-option` → need NBA ID
- **Grant Williams** — `name-grant-williams` → need NBA ID

## 2023-24-multi-066 | 2023-07-12 | BOS ↔ DAL ↔ SAS

- **Grant Williams** — `name-grant_williams` → need NBA ID

## 2023-24-bbr-0701 | 2023-07-11 | MEM ↔ PHO

- **Ryan Kalkbrenner** — `name-ryan_kalkbrenner` → need NBA ID
- **Isaiah Todd** — `name-isaiah_todd` → need NBA ID

## 2023-24-747 | 2023-07-11 | PHX ↔ MEM

- **Isaiah Todd** — `name-isaiah-todd` → need NBA ID

## 2023-24-bbr-0699 | 2023-07-08 | ATL ↔ HOU

- **Alpha Kaba** — `name-alpha_kaba` → need NBA ID
- **Usman Garuba** — `name-usman_garuba` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty_washington_jr` → need NBA ID
- **Mohamed Diawara** — `name-mohamed_diawara` → need NBA ID
- **Kenyon Martin** — `name-kenyon_martin` → need NBA ID
- **Josh Christopher** — `name-josh_christopher` → need NBA ID
- **KJ Simpson** — `name-kj_simpson` → need NBA ID
- **Vanja Marinkovic** — `name-vanja_marinkovic` → need NBA ID

## 2023-24-bbr-0700 | 2023-07-08 | CLE ↔ UTA

- **Damian Jones** — `name-damian_jones` → need NBA ID

## 2023-24-multi-078 | 2023-07-08 | ATL ↔ HOU ↔ LAC ↔ MEM ↔ OKC

- **Alpha Kaba** — `name-alpha_kaba` → need NBA ID
- **Usman Garuba** — `name-usman_garuba` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty_washington_jr` → need NBA ID
- **Mohamed Diawara** — `name-mohamed_diawara` → need NBA ID
- **Kenyon Martin** — `name-kenyon_martin` → need NBA ID
- **Josh Christopher** — `name-josh_christopher` → need NBA ID
- **KJ Simpson** — `name-kj_simpson` → need NBA ID
- **Vanja Marinkovic** — `name-vanja_marinkovic` → need NBA ID

## 2023-24-750 | 2023-07-08 | ATL ↔ ALP

- **rights** — `name-rights` → need NBA ID
- **Usman Garuba** — `name-usman-garuba` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty-washington-jr` → need NBA ID

## 2023-24-multi-065 | 2023-07-08 | ATL ↔ HOU ↔ LAC ↔ MEM ↔ OKC

- **Alpha Kaba** — `name-alpha_kaba` → need NBA ID
- **Usman Garuba** — `name-usman_garuba` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty_washington_jr` → need NBA ID
- **Kenyon Martin** — `name-kenyon_martin` → need NBA ID
- **Josh Christopher** — `name-josh_christopher` → need NBA ID
- **Vanja Marinkovic** — `name-vanja_marinkovic` → need NBA ID

## 2023-24-bbr-0697 | 2023-07-07 | ATL ↔ UTA

- **Rudy Gay** — `name-rudy_gay` → need NBA ID

## 2023-24-bbr-0698 | 2023-07-07 | IND ↔ NYK

- **Obi Toppin** — `name-obi_toppin` → need NBA ID

## 2023-24-bbr-0689 | 2023-07-06 | DET ↔ WAS

- **Monte Morris** — `name-monte_morris` → need NBA ID

## 2023-24-bbr-0691 | 2023-07-06 | DAL ↔ SAC

- **Olivier-Maxence Prosper** — `name-oliviermaxence_prosper` → need NBA ID

## 2023-24-bbr-0692 | 2023-07-06 | DAL ↔ OKC

- **Davis Bertans** — `name-davis_bertans` → need NBA ID
- **Cason Wallace** — `name-cason_wallace` → need NBA ID
- **Dereck Lively II** — `name-dereck_lively_ii` → need NBA ID

## 2023-24-bbr-0693 | 2023-07-06 | GSW ↔ WAS

- **Patrick Baldwin Jr.** — `name-patrick_baldwin_jr` → need NBA ID
- **Ryan Rollins** — `name-ryan_rollins` → need NBA ID

## 2023-24-bbr-0696 | 2023-07-06 | BRK ↔ DET

- **Joe Harris** — `name-joe_harris` → need NBA ID

## 2023-24-multi-077 | 2023-07-06 | CLE ↔ MIA ↔ SAS

- **Cedi Osman** — `name-cedi_osman` → need NBA ID
- **Lamar Stevens** — `name-lamar_stevens` → need NBA ID
- **Max Strus** — `name-max_strus` → need NBA ID

## 2022-23-bbr-0684 | 2023-06-28 | BOS ↔ DET

- **Marcus Sasser** — `name-marcus_sasser` → need NBA ID
- **James Nnaji** — `name-james_nnaji` → need NBA ID
- **Noah Penda** — `name-noah_penda` → need NBA ID

## 2022-23-bbr-0685 | 2023-06-28 | BOS ↔ CHO

- **James Nnaji** — `name-james_nnaji` → need NBA ID
- **Mouhamed Gueye** — `name-mouhamed_gueye` → need NBA ID

## 2022-23-bbr-0686 | 2023-06-28 | BOS ↔ SAC

- **Anton Watson** — `name-anton_watson` → need NBA ID

## 2022-23-bbr-0687 | 2023-06-28 | ATL ↔ BOS

- **Mouhamed Gueye** — `name-mouhamed_gueye` → need NBA ID

## 2023-24-745 | 2023-06-24 | WAS ↔ SWA

- **Jordan Goodwin** — `name-jordan-goodwin` → need NBA ID
- **Isaiah Todd** — `name-isaiah-todd` → need NBA ID
- **Wizards option** — `name-wizards-option` → need NBA ID
- **Chris Paul** — `name-chris-paul` → need NBA ID

## 2022-23-bbr-0682 | 2023-06-23 | DEN ↔ LAL

- **Jalen Pickett** — `name-jalen_pickett` → need NBA ID
- **Julian Strawther** — `name-julian_strawther` → need NBA ID
- **Kevin McCullar Jr.** — `name-kevin_mccullar_jr` → need NBA ID
- **Isaiah Collier** — `name-isaiah_collier` → need NBA ID

## 2022-23-multi-074 | 2023-06-23 | BOS ↔ MEM ↔ WAS

- **Marcus Sasser** — `name-marcus_sasser` → need NBA ID
- **Bub Carrington** — `name-bub_carrington` → need NBA ID

## 2022-23-multi-075 | 2023-06-23 | DEN ↔ IND ↔ LAL ↔ OKC

- **Jalen Pickett** — `name-jalen_pickett` → need NBA ID
- **Julian Strawther** — `name-julian_strawther` → need NBA ID
- **Kevin McCullar Jr.** — `name-kevin_mccullar_jr` → need NBA ID
- **Isaiah Collier** — `name-isaiah_collier` → need NBA ID

## 2022-23-multi-076 | 2023-06-23 | IND ↔ PHO ↔ WAS

- **Bilal Coulibaly** — `name-bilal_coulibaly` → need NBA ID
- **Melvin Ajinça** — `name-melvin_ajina` → need NBA ID
- **Micah Peavy** — `name-micah_peavy` → need NBA ID
- **Jarace Walker** — `name-jarace_walker` → need NBA ID
- **Bradley Beal** — `name-bradley_beal` → need NBA ID
- **Jordan Goodwin** — `name-jordan_goodwin` → need NBA ID
- **Isaiah Todd** — `name-isaiah_todd` → need NBA ID

## 2023-24-742 | 2023-06-23 | BOS ↔ JUL

- **Marcus Smart** — `name-marcus-smart` → need NBA ID
- **rights** — `name-rights` → need NBA ID

## 2023-24-743 | 2023-06-23 | IND ↔ JAL

- **rights** — `name-rights` → need NBA ID

## 2023-24-746 | 2023-06-23 | DEN ↔ MAX

- **rights** — `name-rights` → need NBA ID

## 2022-23-multi-062 | 2023-06-23 | BOS ↔ MEM ↔ WAS

- **Marcus Sasser** — `name-marcus_sasser` → need NBA ID

## 2022-23-multi-063 | 2023-06-23 | DEN ↔ IND ↔ LAL ↔ OKC

- **Jalen Pickett** — `name-jalen_pickett` → need NBA ID
- **Julian Strawther** — `name-julian_strawther` → need NBA ID

## 2022-23-multi-064 | 2023-06-23 | IND ↔ PHO ↔ WAS

- **Bilal Coulibaly** — `name-bilal_coulibaly` → need NBA ID
- **Micah Peavy** — `name-micah_peavy` → need NBA ID
- **Jarace Walker** — `name-jarace_walker` → need NBA ID
- **Jordan Goodwin** — `name-jordan_goodwin` → need NBA ID
- **Isaiah Todd** — `name-isaiah_todd` → need NBA ID

## 2022-23-bbr-0678 | 2023-06-22 | MIL ↔ ORL

- **Andre Jackson** — `name-andre_jackson` → need NBA ID

## 2022-23-bbr-0667 | 2023-02-09 | CHO ↔ PHI

- **Cam Spencer** — `name-cam_spencer` → need NBA ID
- **Ryan Arcidiacono** — `name-ryan_arcidiacono` → need NBA ID
- **Cam Reddish** — `name-cam_reddish` → need NBA ID
- **Ante Tomic** — `name-ante_tomic` → need NBA ID
- **Kris Murray** — `name-kris_murray` → need NBA ID
- **Matisse Thybulle** — `name-matisse_thybulle` → need NBA ID
- **Dani Diez** — `name-dani_diez` → need NBA ID
- **Bojan Dubljevic** — `name-bojan_dubljevic` → need NBA ID

## 2022-23-bbr-0669 | 2023-02-09 | BOS ↔ OKC

- **Justin Jackson** — `name-justin_jackson` → need NBA ID
- **Keyonte Johnson** — `name-keyonte_johnson` → need NBA ID

## 2022-23-bbr-0670 | 2023-02-09 | NOP ↔ SAS

- **Adem Bona** — `name-adem_bona` → need NBA ID

## 2022-23-bbr-0671 | 2023-02-09 | ATL ↔ GSW

- **Rayan Rupert** — `name-rayan_rupert` → need NBA ID
- **Oso Ighodaro** — `name-oso_ighodaro` → need NBA ID
- **Kevin Knox** — `name-kevin_knox` → need NBA ID
- **Gary Payton II** — `name-gary_payton_ii` → need NBA ID

## 2022-23-bbr-0672 | 2023-02-09 | OKC ↔ PHO

- **Darius Bazley** — `name-darius_bazley` → need NBA ID

## 2022-23-bbr-0673 | 2023-02-09 | ATL ↔ HOU

- **Frank Kaminsky** — `name-frank_kaminsky` → need NBA ID
- **Ulrich Chomche** — `name-ulrich_chomche` → need NBA ID
- **Jahmai Mashack** — `name-jahmai_mashack` → need NBA ID
- **Garrison Mathews** — `name-garrison_mathews` → need NBA ID

## 2022-23-bbr-0674 | 2023-02-09 | BRK ↔ IND

- **T.J. Warren** — `name-tj_warren` → need NBA ID
- **Juan Vaulet** — `name-juan_vaulet` → need NBA ID
- **Jordan Nwora** — `name-jordan_nwora` → need NBA ID
- **Isaiah Wong** — `name-isaiah_wong` → need NBA ID
- **Quinten Post** — `name-quinten_post` → need NBA ID
- **Taelon Peter** — `name-taelon_peter` → need NBA ID
- **Noah Clowney** — `name-noah_clowney` → need NBA ID
- **Khaman Maluach** — `name-khaman_maluach` → need NBA ID

## 2022-23-bbr-0675 | 2023-02-09 | DEN ↔ LAC

- **Bones Hyland** — `name-bones_hyland` → need NBA ID
- **Davon Reed** — `name-davon_reed` → need NBA ID
- **Bronny James** — `name-bronny_james` → need NBA ID
- **John Tonje** — `name-john_tonje` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID

## 2022-23-bbr-0677 | 2023-02-09 | SAS ↔ TOR

- **Jakob Poeltl** — `name-jakob_poeltl` → need NBA ID
- **Khem Birch** — `name-khem_birch` → need NBA ID
- **Chaz Lanier** — `name-chaz_lanier` → need NBA ID

## 2022-23-multi-068 | 2023-02-09 | CHA ↔ NYK ↔ PHI ↔ POR

- **Cam Spencer** — `name-cam_spencer` → need NBA ID
- **Ryan Arcidiacono** — `name-ryan_arcidiacono` → need NBA ID
- **Cam Reddish** — `name-cam_reddish` → need NBA ID
- **Ante Tomic** — `name-ante_tomic` → need NBA ID
- **Kris Murray** — `name-kris_murray` → need NBA ID
- **Matisse Thybulle** — `name-matisse_thybulle` → need NBA ID
- **Dani Diez** — `name-dani_diez` → need NBA ID
- **Bojan Dubljevic** — `name-bojan_dubljevic` → need NBA ID

## 2022-23-multi-069 | 2023-02-09 | HOU ↔ LAC ↔ MEM

- **Cam Christie** — `name-cam_christie` → need NBA ID
- **Juan Nunez** — `name-juan_nunez` → need NBA ID

## 2022-23-multi-070 | 2023-02-09 | ATL ↔ DET ↔ GSW ↔ POR

- **Rayan Rupert** — `name-rayan_rupert` → need NBA ID
- **Oso Ighodaro** — `name-oso_ighodaro` → need NBA ID
- **Kevin Knox** — `name-kevin_knox` → need NBA ID
- **Gary Payton II** — `name-gary_payton_ii` → need NBA ID

## 2022-23-multi-071 | 2023-02-09 | BKN ↔ IND ↔ MIL ↔ PHO

- **T.J. Warren** — `name-tj_warren` → need NBA ID
- **Juan Vaulet** — `name-juan_vaulet` → need NBA ID
- **Jordan Nwora** — `name-jordan_nwora` → need NBA ID
- **Isaiah Wong** — `name-isaiah_wong` → need NBA ID
- **Quinten Post** — `name-quinten_post` → need NBA ID
- **Taelon Peter** — `name-taelon_peter` → need NBA ID
- **Noah Clowney** — `name-noah_clowney` → need NBA ID
- **Khaman Maluach** — `name-khaman_maluach` → need NBA ID

## 2022-23-multi-072 | 2023-02-09 | DEN ↔ LAC ↔ LAL ↔ ORL

- **Bones Hyland** — `name-bones_hyland` → need NBA ID
- **Davon Reed** — `name-davon_reed` → need NBA ID
- **Bronny James** — `name-bronny_james` → need NBA ID
- **John Tonje** — `name-john_tonje` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID

## 2022-23-multi-073 | 2023-02-09 | LAL ↔ MIN ↔ UTA

- **Bobi Klintman** — `name-bobi_klintman` → need NBA ID
- **Damian Jones** — `name-damian_jones` → need NBA ID
- **Juan Toscano-Anderson** — `name-juan_toscanoanderson` → need NBA ID
- **Malik Beasley** — `name-malik_beasley` → need NBA ID
- **Jarred Vanderbilt** — `name-jarred_vanderbilt` → need NBA ID
- **Rasheer Fleming** — `name-rasheer_fleming` → need NBA ID

## 2023-24-737 | 2023-02-09 | HOU ↔ SWA

- **Eric Gordon** — `name-eric-gordon` → need NBA ID
- **Rockets option** — `name-rockets-option` → need NBA ID
- **John Wall** — `name-john-wall` → need NBA ID
- **Danny Green** — `name-danny-green` → need NBA ID

## 2023-24-738 | 2023-02-09 | BKN ↔ SWA

- **T.J. Warren** — `name-tj-warren` → need NBA ID
- **Nets option** — `name-nets-option` → need NBA ID

## 2023-24-739 | 2023-02-09 | POR ↔ DAN

- **Josh Hart** — `name-josh-hart` → need NBA ID
- **rights** — `name-rights` → need NBA ID
- **Matisse Thybulle** — `name-matisse-thybulle` → need NBA ID
- **Ryan Arcidiacono** — `name-ryan-arcidiacono` → need NBA ID

## 2023-24-740 | 2023-02-09 | LAC ↔ SWA

- **John Wall** — `name-john-wall` → need NBA ID
- **Luke Kennard** — `name-luke-kennard` → need NBA ID
- **Grizzlies option** — `name-grizzlies-option` → need NBA ID
- **Eric Gordon** — `name-eric-gordon` → need NBA ID

## 2023-24-741 | 2023-02-09 | IND ↔ JUA

- **rights** — `name-rights` → need NBA ID
- **Jordan Nwora** — `name-jordan-nwora` → need NBA ID
- **Serge Ibaka** — `name-serge-ibaka` → need NBA ID

## 2022-23-multi-056 | 2023-02-09 | CHA ↔ NYK ↔ PHI ↔ POR

- **Ryan Arcidiacono** — `name-ryan_arcidiacono` → need NBA ID
- **Ante Tomic** — `name-ante_tomic` → need NBA ID
- **Matisse Thybulle** — `name-matisse_thybulle` → need NBA ID
- **Dani Diez** — `name-dani_diez` → need NBA ID
- **Bojan Dubljevic** — `name-bojan_dubljevic` → need NBA ID

## 2022-23-multi-057 | 2023-02-09 | HOU ↔ LAC ↔ MEM

- **Juan Nunez** — `name-juan_nunez` → need NBA ID

## 2022-23-multi-058 | 2023-02-09 | ATL ↔ DET ↔ GSW ↔ POR

- **Oso Ighodaro** — `name-oso_ighodaro` → need NBA ID
- **Kevin Knox** — `name-kevin_knox` → need NBA ID
- **Gary Payton II** — `name-gary_payton_ii` → need NBA ID

## 2022-23-multi-059 | 2023-02-09 | BKN ↔ IND ↔ MIL ↔ PHO

- **T.J. Warren** — `name-tj_warren` → need NBA ID
- **Juan Vaulet** — `name-juan_vaulet` → need NBA ID
- **Jordan Nwora** — `name-jordan_nwora` → need NBA ID
- **Quinten Post** — `name-quinten_post` → need NBA ID
- **Taelon Peter** — `name-taelon_peter` → need NBA ID
- **Khaman Maluach** — `name-khaman_maluach` → need NBA ID

## 2022-23-multi-060 | 2023-02-09 | DEN ↔ LAC ↔ LAL ↔ ORL

- **Bones Hyland** — `name-bones_hyland` → need NBA ID
- **Davon Reed** — `name-davon_reed` → need NBA ID
- **John Tonje** — `name-john_tonje` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID

## 2022-23-multi-061 | 2023-02-09 | LAL ↔ MIN ↔ UTA

- **Damian Jones** — `name-damian_jones` → need NBA ID
- **Juan Toscano-Anderson** — `name-juan_toscanoanderson` → need NBA ID
- **Malik Beasley** — `name-malik_beasley` → need NBA ID
- **Jarred Vanderbilt** — `name-jarred_vanderbilt` → need NBA ID

## 2022-23-bbr-0664 | 2023-02-07 | BRK ↔ SAC

- **David Michineau** — `name-david_michineau` → need NBA ID

## 2022-23-bbr-0663 | 2023-02-06 | BRK ↔ DAL

- **Kyrie Irving** — `name-kyrie_irving` → need NBA ID
- **Spencer Dinwiddie** — `name-spencer_dinwiddie` → need NBA ID

## 2022-23-bbr-0662 | 2023-01-23 | LAL ↔ WAS

- **Kendrick Nunn** — `name-kendrick_nunn` → need NBA ID
- **Tristan Vukcevic** — `name-tristan_vukcevic` → need NBA ID
- **Rui Hachimura** — `name-rui_hachimura` → need NBA ID

## 2022-23-bbr-0661 | 2023-01-05 | BOS ↔ SAS

- **Noah Vonleh** — `name-noah_vonleh` → need NBA ID

## 2022-23-bbr-0660 | 2022-09-30 | HOU ↔ OKC

- **Sterling Brown** — `name-sterling_brown` → need NBA ID
- **Marquese Chriss** — `name-marquese_chriss` → need NBA ID
- **David Nwaba** — `name-david_nwaba` → need NBA ID
- **Ty Jerome** — `name-ty_jerome` → need NBA ID
- **Theo Maledon** — `name-theo_maledon` → need NBA ID

## 2022-23-bbr-0659 | 2022-09-27 | ATL ↔ OKC

- **Vit Krejci** — `name-vit_krejci` → need NBA ID

## 2022-23-bbr-0658 | 2022-09-22 | DET ↔ UTA

- **Saben Lee** — `name-saben_lee` → need NBA ID

## 2022-23-bbr-0657 | 2022-09-03 | CLE ↔ UTA

- **Lauri Markkanen** — `name-lauri_markkanen` → need NBA ID
- **Liam McNeeley** — `name-liam_mcneeley` → need NBA ID
- **Donovan Mitchell** — `name-donovan_mitchell` → need NBA ID

## 2022-23-bbr-0656 | 2022-08-25 | LAL ↔ UTA

- **Talen Horton-Tucker** — `name-talen_hortontucker` → need NBA ID
- **Stanley Johnson** — `name-stanley_johnson` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID

## 2022-23-bbr-0655 | 2022-07-11 | DET ↔ NYK

- **Nikola Radičević** — `name-nikola_radievi` → need NBA ID
- **Alec Burks** — `name-alec-burks` → need NBA ID
- **Nerlens Noel** — `name-nerlens_noel` → need NBA ID
- **James Nnaji** — `name-james_nnaji` → need NBA ID

## 2022-23-bbr-0654 | 2022-07-09 | BOS ↔ IND

- **Malik Fitts** — `name-malik_fitts` → need NBA ID
- **Juwan Morgan** — `name-juwan_morgan` → need NBA ID
- **Aaron Nesmith** — `name-aaron_nesmith` → need NBA ID
- **Julian Strawther** — `name-julian_strawther` → need NBA ID

## 2022-23-bbr-0647 | 2022-07-06 | MIN ↔ UTA

- **Malik Beasley** — `name-malik_beasley` → need NBA ID
- **Patrick Beverley** — `name-patrick_beverley` → need NBA ID
- **Leandro Bolmaro** — `name-leandro_bolmaro` → need NBA ID
- **Walker Kessler** — `name-walker_kessler` → need NBA ID
- **Jarred Vanderbilt** — `name-jarred_vanderbilt` → need NBA ID
- **Keyonte George** — `name-keyonte_george` → need NBA ID
- **Will Riley** — `name-will_riley` → need NBA ID
- **Rudy Gobert** — `name-rudy_gobert` → need NBA ID

## 2022-23-bbr-0648 | 2022-07-06 | DET ↔ POR

- **Jerami Grant** — `name-jerami_grant` → need NBA ID
- **Ismael Kamagate** — `name-ismael_kamagate` → need NBA ID
- **Gabriele Procida** — `name-gabriele_procida` → need NBA ID
- **Nolan Traoré** — `name-nolan_traor` → need NBA ID
- **Bogoljub Markovic** — `name-bogoljub_markovic` → need NBA ID

## 2022-23-bbr-0649 | 2022-07-06 | DEN ↔ WAS

- **Will Barton** — `name-will_barton` → need NBA ID
- **Monte Morris** — `name-monte_morris` → need NBA ID
- **Ish Smith** — `name-ish_smith` → need NBA ID

## 2022-23-bbr-0650 | 2022-07-06 | DEN ↔ POR

- **Ismael Kamagate** — `name-ismael_kamagate` → need NBA ID

## 2022-23-bbr-0652 | 2022-07-06 | ATL ↔ SAC

- **Derik Queen** — `name-derik_queen` → need NBA ID

## 2022-23-bbr-0653 | 2022-07-06 | DET ↔ NYK

- **Nolan Traoré** — `name-nolan_traor` → need NBA ID
- **Jalen Duren** — `name-jalen_duren` → need NBA ID

## 2021-22-bbr-0645 | 2022-06-30 | BRK ↔ UTA

- **Brice Sensabaugh** — `name-brice_sensabaugh` → need NBA ID
- **Royce O'Neale** — `name-royce_oneale` → need NBA ID

## 2021-22-bbr-0646 | 2022-06-30 | ATL ↔ SAS

- **Carter Bryant** — `name-carter_bryant` → need NBA ID

## 2022-23-690 | 2022-06-30 | UTA ↔ BKN

- **Royce O'Neale** — `name-royce-oneale` → need NBA ID

## 2021-22-bbr-0639 | 2022-06-24 | DAL ↔ HOU

- **Sterling Brown** — `name-sterling_brown` → need NBA ID
- **Marquese Chriss** — `name-marquese_chriss` → need NBA ID
- **Boban Marjanović** — `name-boban_marjanovi` → need NBA ID
- **Wendell Moore Jr.** — `name-wendell_moore_jr` → need NBA ID

## 2021-22-bbr-0640 | 2022-06-24 | MEM ↔ MIN

- **Walker Kessler** — `name-walker_kessler` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty_washington_jr` → need NBA ID
- **Gregory Jackson** — `name-gregory_jackson` → need NBA ID

## 2021-22-bbr-0641 | 2022-06-24 | IND ↔ MIN

- **Kendall Brown** — `name-kendall_brown` → need NBA ID

## 2021-22-bbr-0642 | 2022-06-24 | IND ↔ MIL

- **Hugo Besson** — `name-hugo_besson` → need NBA ID

## 2021-22-bbr-0643 | 2022-06-24 | HOU ↔ MIN

- **Wendell Moore Jr.** — `name-wendell_moore_jr` → need NBA ID
- **TyTy Washington Jr.** — `name-tyty_washington_jr` → need NBA ID
- **Mohamed Diawara** — `name-mohamed_diawara` → need NBA ID

## 2021-22-bbr-0644 | 2022-06-24 | MEM ↔ PHI

- **De'Anthony Melton** — `name-deanthony_melton` → need NBA ID

## 2021-22-bbr-0630 | 2022-06-23 | CLE ↔ SAC

- **Sasha Vezenkov** — `name-sasha_vezenkov` → need NBA ID
- **Isaiah Mobley** — `name-isaiah_mobley` → need NBA ID

## 2021-22-bbr-0631 | 2022-06-23 | NYK ↔ OKC

- **Nick Smith Jr.** — `name-nick_smith_jr` → need NBA ID
- **Joan Beringer** — `name-joan_beringer` → need NBA ID

## 2021-22-bbr-0632 | 2022-06-23 | CHO ↔ NYK

- **Jalen Duren** — `name-jalen_duren` → need NBA ID
- **Nick Smith Jr.** — `name-nick_smith_jr` → need NBA ID
- **Amari Bailey** — `name-amari_bailey` → need NBA ID
- **Jaylen Clark** — `name-jaylen_clark` → need NBA ID
- **Mouhamed Gueye** — `name-mouhamed_gueye` → need NBA ID
- **Cam Spencer** — `name-cam_spencer` → need NBA ID

## 2021-22-bbr-0633 | 2022-06-23 | DEN ↔ OKC

- **JaMychal Green** — `name-jamychal_green` → need NBA ID
- **Peyton Watson** — `name-peyton_watson` → need NBA ID

## 2021-22-bbr-0634 | 2022-06-23 | MEM ↔ SAS

- **Harrison Ingram** — `name-harrison_ingram` → need NBA ID
- **Kennedy Chandler** — `name-kennedy_chandler` → need NBA ID

## 2021-22-bbr-0635 | 2022-06-23 | DAL ↔ SAC

- **Anton Watson** — `name-anton_watson` → need NBA ID

## 2021-22-bbr-0636 | 2022-06-23 | CHO ↔ MIN

- **Josh Minott** — `name-josh-minott` → need NBA ID
- **Jaylen Clark** — `name-jaylen_clark` → need NBA ID
- **Bryce McGowens** — `name-bryce_mcgowens` → need NBA ID

## 2021-22-bbr-0637 | 2022-06-23 | ATL ↔ GSW

- **Ryan Rollins** — `name-ryan_rollins` → need NBA ID
- **Tyrese Martin** — `name-tyrese_martin` → need NBA ID

## 2021-22-bbr-0620 | 2022-02-10 | BOS ↔ SAS

- **Romeo Langford** — `name-romeo_langford` → need NBA ID
- **Derrick White** — `name-derrick_white` → need NBA ID

## 2021-22-bbr-0621 | 2022-02-10 | DAL ↔ WAS

- **Yannick Nzosa** — `name-yannick_nzosa` → need NBA ID
- **Davis Bertans** — `name-davis_bertans` → need NBA ID
- **Spencer Dinwiddie** — `name-spencer_dinwiddie` → need NBA ID

## 2021-22-bbr-0622 | 2022-02-10 | BRK ↔ PHI

- **Brice Sensabaugh** — `name-brice_sensabaugh` → need NBA ID

## 2021-22-bbr-0623 | 2022-02-10 | BOS ↔ HOU

- **Enes Freedom** — `name-enes_freedom` → need NBA ID

## 2021-22-bbr-0624 | 2022-02-10 | IND ↔ PHO

- **Torrey Craig** — `name-torrey_craig` → need NBA ID
- **Jalen Smith** — `name-jalen_smith` → need NBA ID
- **Hugo Besson** — `name-hugo_besson` → need NBA ID

## 2021-22-bbr-0625 | 2022-02-10 | DET ↔ MIL

- **Isaiah Wong** — `name-isaiah_wong` → need NBA ID
- **David Michineau** — `name-david_michineau` → need NBA ID
- **Vanja Marinkovic** — `name-vanja_marinkovic` → need NBA ID
- **Tyler Smith** — `name-tyler_smith` → need NBA ID

## 2021-22-bbr-0626 | 2022-02-10 | CHO ↔ WAS

- **Vernon Carey Jr.** — `name-vernon_carey_jr` → need NBA ID
- **Ish Smith** — `name-ish_smith` → need NBA ID
- **Montrezl Harrell** — `name-montrezl_harrell` → need NBA ID

## 2021-22-bbr-0627 | 2022-02-10 | PHO ↔ WAS

- **Aaron Holiday** — `name-aaron_holiday` → need NBA ID

... and 823 more trades.

Full JSON: run `node scripts/list-trades-with-unmapped-players.mjs > docs/TRADES_NEEDING_PLAYER_IDS.json`