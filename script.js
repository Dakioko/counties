const KENYA_POP = 55;
const RC = {"Central":"#2563eb","Coast":"#0891b2","Eastern":"#4f46e5","Nairobi":"#7c3aed","North Eastern":"#ea580c","Nyanza":"#0284c7","Rift Valley":"#059669","Western":"#16a34a"};

const countiesData = {
  "Mombasa":{code:1,cap:"Mombasa",pop:"1.2M",popM:1.2,area:"212",region:"Coast",governor:"Abdulswamad Nassir",known:"Kenya's oldest city and primary seaport, Mombasa is a vibrant coastal trade hub with a deep Swahili cultural heritage dating back centuries of Indian Ocean commerce.",funfact:"Fort Jesus, built by the Portuguese in 1593, has changed hands nine times across different colonial powers and is now a UNESCO World Heritage Site.",landmarks:["Fort Jesus (UNESCO Heritage)","Mombasa Old Town","Haller Park","Nyali Beach"],industries:["Port & Trade","Tourism","Fishing","Real Estate"],gcp:"KES 380B",gcpTier:"high",gcpHighlights:["Second largest economy in Kenya","Home to the Port of Mombasa, handling 30M tonnes/yr","Major EPZA manufacturing zone"],geo:{terrain:"Coastal island & mainland",climate:"Tropical humid",elevation:"~17m above sea level",neighbours:"Kilifi, Kwale"},connectivity:["Mombasa–Nairobi SGR (Terminus)","Moi International Airport","A14 Highway (Mombasa–Nairobi)","Likoni Ferry Channel"],subcounties:["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu"]},
  "Kwale":{code:2,cap:"Kwale",pop:"866K",popM:0.866,area:"8,270",region:"Coast",governor:"Fatuma Achani",known:"A predominantly rural coastal county known for pristine beaches, marine ecosystems, and a rapidly growing tourism sector driven by Diani Beach.",funfact:"Kwale sits atop one of the largest titanium mineral deposits in the world, with Base Titanium mine being a major contributor to Kenya's mining revenues.",landmarks:["Diani Beach","Shimba Hills National Reserve","Kisite-Mpunguti Marine Park","Shimoni Caves"],industries:["Tourism","Mining","Agriculture","Fishing"],gcp:"KES 85B",gcpTier:"mid",gcpHighlights:["Base Titanium mine contributes significantly to county revenues","Diani Beach is Kenya's top-rated beach destination","Growing aquaculture sector"],geo:{terrain:"Coastal lowlands & Shimba Hills",climate:"Tropical humid",elevation:"0–460m",neighbours:"Mombasa, Kilifi, Taita Taveta"},connectivity:["A14 Highway","Ukunda Airstrip","Diani Beach Road","Shimba Hills access road"],subcounties:["Msambweni","Lunga Lunga","Matuga","Kinango"]},
  "Kilifi":{code:3,cap:"Kilifi",pop:"1.4M",popM:1.4,area:"12,246",region:"Coast",governor:"Gideon Mung'aro",known:"Kilifi stretches along 200km of coastline offering unspoilt beaches, creek ecosystems, ancient ruins, and some of Kenya's most accessible marine parks.",funfact:"The KEMRI–Wellcome Trust Research Programme in Kilifi is one of Africa's leading health research institutions, conducting global malaria and infectious disease studies.",landmarks:["Watamu Marine National Park","Gede Ruins (National Monument)","Kilifi Creek","Arabuko-Sokoke Forest"],industries:["Tourism","Horticulture","Fishing","Research"],gcp:"KES 95B",gcpTier:"mid",gcpHighlights:["Watamu is Kenya's fastest-growing marine tourism hub","Significant cashew nut and coconut production","KEMRI research hub drives health sector"],geo:{terrain:"Coastal strip & hinterland",climate:"Hot & humid",elevation:"0–200m",neighbours:"Mombasa, Kwale, Tana River, Malindi"},connectivity:["B8 Highway","Malindi Airport (nearby)","Kenya Ferry Services","Mombasa–Malindi Road"],subcounties:["Kilifi North","Kilifi South","Kaloleni","Rabai","Ganze","Magarini","Malindi","Makilindi"]},
  "Tana River":{code:4,cap:"Hola",pop:"315K",popM:0.315,area:"35,375",region:"Coast",governor:"Dhadho Godhana",known:"A vast, sparsely populated county dominated by the Tana River delta—Kenya's largest river system—and critical wildlife corridors linking coast to interior.",funfact:"The Tana River Primate National Reserve is the last refuge for two of the world's rarest primates—the Tana River Red Colobus and Crested Mangabey.",landmarks:["Tana River Primate Reserve","Arawale National Reserve","Tana River Delta","Kipini Wildlife Conservation Area"],industries:["Pastoralism","Irrigation Farming","Fishing","Hydropower"],gcp:"KES 28B",gcpTier:"low",gcpHighlights:["Major irrigation potential along Tana River","Significant livestock economy","Hydroelectric dams contribute to national grid"],geo:{terrain:"River delta, semi-arid plains",climate:"Semi-arid to arid",elevation:"0–300m",neighbours:"Kilifi, Garissa, Isiolo, Tharaka Nithi"},connectivity:["B8 Highway (Garsen junction)","Garsen–Lamu Road","Malindi–Lamu Ferry","Hola Airstrip"],subcounties:["Garsen","Galole","Bura"]},
  "Lamu":{code:5,cap:"Lamu",pop:"143K",popM:0.143,area:"6,498",region:"Coast",governor:"Issa Timamy",known:"Kenya's smallest county by population, Lamu is an ancient Swahili trading island whose old town is a UNESCO World Heritage Site and one of the best-preserved Swahili settlements in East Africa.",funfact:"Cars are almost entirely banned on Lamu Island—donkeys and boats are the primary modes of transport, preserving the medieval street layout unchanged for centuries.",landmarks:["Lamu Old Town (UNESCO)","Lamu Fort","Shela Beach","Manda Island","Lamu Museum"],industries:["Tourism","Fishing","Maritime","Dhow Building"],gcp:"KES 18B",gcpTier:"low",gcpHighlights:["LAPSSET Corridor port project set to transform the county","Heritage tourism is the primary economic driver","Artisanal fishing sustains coastal communities"],geo:{terrain:"Coastal islands & mainland",climate:"Tropical humid",elevation:"0–50m",neighbours:"Tana River, Garissa (sea border)"},connectivity:["Manda Island Airport","Sea ferry from Mokowe","LAPSSET Corridor (under development)","Lamu–Garissa Road (B8)"],subcounties:["Lamu East","Lamu West"]},
  "Taita Taveta":{code:6,cap:"Mwatate",pop:"340K",popM:0.340,area:"17,084",region:"Coast",governor:"Andrew Mwadime",known:"A county of dramatic contrasts—from the savannas of Tsavo, Kenya's largest national park, to the cool misty Taita Hills with their unique endemic biodiversity.",funfact:"The Taita Hills are home to three bird species found nowhere else on earth—making them one of Africa's most critical endemic bird hotspots in an area smaller than Nairobi.",landmarks:["Tsavo East National Park","Tsavo West National Park","Lake Jipe","Taita Hills Wildlife Sanctuary","Mzima Springs"],industries:["Wildlife Tourism","Mining","Sisal Farming","Horticulture"],gcp:"KES 42B",gcpTier:"low",gcpHighlights:["Tsavo parks are the most visited in Kenya","Mineral mining (fluorite, wollastonite) expanding","SGR passes through county, boosting logistics"],geo:{terrain:"Hills, savanna, plains",climate:"Semi-arid to highland",elevation:"600–2200m",neighbours:"Kwale, Kilifi, Makueni, Kajiado"},connectivity:["Mombasa–Nairobi SGR","A109 Highway (Mombasa Road)","Voi–Taveta Road","Voi Airstrip"],subcounties:["Taveta","Wundanyi","Mwatate","Voi"]},
  "Garissa":{code:7,cap:"Garissa",pop:"841K",popM:0.841,area:"44,175",region:"North Eastern",governor:"Nathif Jama",known:"A vast arid county along the Tana River, Garissa is the economic and administrative hub of northeastern Kenya with a significant cross-border trade economy.",funfact:"Garissa hosts Dadaab, one of the world's largest refugee camp complexes, which at its peak housed over 500,000 refugees—comparable to a large city.",landmarks:["Bura Irrigation Scheme","Tana River","Arawale National Reserve","Dadaab"],industries:["Livestock","Fishing","Cross-border Trade","Irrigation"],gcp:"KES 55B",gcpTier:"low",gcpHighlights:["Livestock is the backbone of the economy","Strategic location for Somalia border trade","Emerging solar energy projects"],geo:{terrain:"Arid lowland plains",climate:"Arid & semi-arid",elevation:"100–250m",neighbours:"Wajir, Mandera, Tana River, Isiolo, Lamu"},connectivity:["A3 Highway (Nairobi–Garissa)","Garissa Airport","Garissa–Dadaab Road","Tana River ferry crossings"],subcounties:["Garissa","Balambala","Lagdera","Dadaab","Fafi","Ijara"]},
  "Wajir":{code:8,cap:"Wajir",pop:"781K",popM:0.781,area:"55,840",region:"North Eastern",governor:"Ahmed Abdullahi",known:"One of Kenya's largest and most remote counties, Wajir is dominated by arid plains and a predominantly pastoralist Somali community with deep cultural traditions.",funfact:"Wajir has more camels than any other county in Kenya—camel milk is a dietary staple and a growing commercial product exported to Nairobi markets.",landmarks:["Wajir Borehole (Historic)","El Wak Area","North Horr Depression","Lorian Swamp"],industries:["Pastoralism","Trade","Camel Milk","Solar Energy"],gcp:"KES 38B",gcpTier:"low",gcpHighlights:["Camel milk value chain is growing nationally","Cross-border trade with Ethiopia and Somalia","Emerging solar energy investments"],geo:{terrain:"Arid plains & ephemeral rivers",climate:"Arid",elevation:"200–400m",neighbours:"Garissa, Mandera, Marsabit, Isiolo, Ethiopia, Somalia"},connectivity:["A13 Highway","Wajir Airport","Wajir–Mandera Road","Wajir–El Wak Road"],subcounties:["Wajir North","Wajir East","Tarbaj","Wajir West","Eldas","Wajir South"]},
  "Mandera":{code:9,cap:"Mandera",pop:"867K",popM:0.867,area:"25,797",region:"North Eastern",governor:"Mohamed Adan Khalif",known:"Kenya's northernmost county, sitting at the tri-border junction of Kenya, Ethiopia and Somalia, Mandera is a key cross-border trade corridor with a rapidly growing population.",funfact:"Mandera town is so close to the Ethiopian and Somali borders that mobile phones frequently switch networks between the three countries just by walking a few streets.",landmarks:["Kenya–Ethiopia–Somalia Tri-border","Mandera Town","Fino and Rhamu border posts"],industries:["Cross-border Trade","Livestock","Solar Energy","Water Projects"],gcp:"KES 32B",gcpTier:"low",gcpHighlights:["Tri-border position drives significant informal trade","Livestock exports to Gulf countries","Major government infrastructure investments underway"],geo:{terrain:"Flat arid plains",climate:"Hot & arid",elevation:"300–400m",neighbours:"Wajir, Ethiopia, Somalia"},connectivity:["Mandera Airport","A13 Highway","Mandera–Moyale Road","Border crossings to Ethiopia & Somalia"],subcounties:["Mandera East","Lafey","Mandera West","Mandera North","Mandera South","Banissa"]},
  "Marsabit":{code:10,cap:"Marsabit",pop:"459K",popM:0.459,area:"66,923",region:"Eastern",governor:"Mohamud Ali Gashen",known:"Kenya's largest county by area, Marsabit encompasses vast deserts, volcanic mountains, crater lakes, and diverse pastoralist communities in one of Africa's most remote landscapes.",funfact:"Marsabit was home to Ahmed—the most famous elephant in African history. His tusks weighed over 67kg each, and President Kenyatta granted him a personal presidential bodyguard.",landmarks:["Marsabit National Park & Reserve","Lake Paradise (Crater Lake)","Chalbi Desert","Lake Turkana (shore)","Moyale Border Post"],industries:["Pastoralism","Wind/Solar Energy","Tourism","Border Trade"],gcp:"KES 30B",gcpTier:"low",gcpHighlights:["Lake Turkana Wind Power (310MW) is Africa's largest wind farm","Strategic Moyale border trade with Ethiopia","Tourism in Marsabit reserve growing"],geo:{terrain:"Desert, volcanic mountains, crater lakes",climate:"Arid to semi-arid",elevation:"400–1700m",neighbours:"Turkana, Samburu, Isiolo, Wajir, Ethiopia"},connectivity:["A2 Highway (Ethiopia Road)","Marsabit Airport","Moyale border post","Marsabit–Isiolo Road"],subcounties:["North Horr","Moyale","Saku","Laisamis"]},
  "Isiolo":{code:11,cap:"Isiolo",pop:"268K",popM:0.268,area:"25,336",region:"Eastern",governor:"Abdi Ibrahim Guyo",known:"Known as the 'Gateway to the North', Isiolo is where Kenya's tarmac traditionally ended, serving as the last major supply town before the vast arid northern counties.",funfact:"Isiolo is being developed as a resort city under Kenya's Vision 2030—planned to rival Mombasa and Kisumu as a major tourist and conference destination.",landmarks:["Buffalo Springs National Reserve","Samburu National Reserve (border)","Shaba National Reserve","Isiolo Town","Ewaso Ng'iro River"],industries:["Tourism","Pastoralism","Trade","Resort City Dev"],gcp:"KES 22B",gcpTier:"low",gcpHighlights:["Vision 2030 resort city development underway","Gateway trade hub for northern Kenya","LAPSSET Corridor passes through the county"],geo:{terrain:"Semi-arid plains, riverine areas",climate:"Hot & semi-arid",elevation:"850–1100m",neighbours:"Marsabit, Wajir, Garissa, Tana River, Meru, Samburu"},connectivity:["A2 Highway (Ethiopia Road)","Isiolo Airport","Isiolo–Moyale Road","LAPSSET Corridor Road"],subcounties:["Isiolo North","Isiolo South"]},
  "Meru":{code:12,cap:"Meru",pop:"1.5M",popM:1.5,area:"6,936",region:"Eastern",governor:"Kawira Mwangaza",known:"A fertile agricultural powerhouse on the northeastern slopes of Mt. Kenya, Meru produces a wide diversity of cash crops and is famous for the miraa (khat) trade to Somalia and beyond.",funfact:"Meru County produces over 90% of Kenya's miraa (khat), a stimulant plant that is air-freighted daily from Meru to Somalia, earning millions of dollars for local farmers.",landmarks:["Meru National Park","Mt. Kenya (eastern slopes)","Meru National Polytechnic","Tana River headwaters","Nyambene Hills"],industries:["Miraa (Khat)","Horticulture","Tea & Coffee","Wildlife Tourism"],gcp:"KES 130B",gcpTier:"mid",gcpHighlights:["Miraa exports generate KES 10B+ annually","Among top 5 agricultural counties","Meru town is a major regional commercial center"],geo:{terrain:"Mt. Kenya slopes, hilly terrain",climate:"Highland, temperate",elevation:"1000–3000m",neighbours:"Isiolo, Tharaka Nithi, Embu, Nyeri, Laikipia"},connectivity:["A2 Highway (Nairobi–Meru)","Meru Airport","B6 Road (Meru–Nkubu)","Meru–Isiolo Road"],subcounties:["Imenti North","Imenti Central","Imenti South","Tigania East","Tigania West","Igembe North","Igembe Central","Igembe South","Buuri"]},
  "Tharaka Nithi":{code:13,cap:"Chuka",pop:"393K",popM:0.393,area:"2,609",region:"Eastern",governor:"Githinji Mwangi",known:"A small but agriculturally productive highland county on Mt. Kenya's southeastern slopes, known for subsistence and cash crop farming in a compact terrain.",funfact:"Tharaka Nithi is home to the Tharaka people, known for their distinctive beehive culture—traditional honey harvesting has been practised here for centuries.",landmarks:["Mt. Kenya (southeastern slopes)","Tharaka Wildlife Conservancy","Nithi Falls","Chuka University"],industries:["Tea Farming","Horticulture","Subsistence Farming","Honey Production"],gcp:"KES 28B",gcpTier:"low",gcpHighlights:["Emerging tea production zones","Significant horticulture for Nairobi markets","Chuka University driving education growth"],geo:{terrain:"Hilly, riverine valleys",climate:"Highland temperate",elevation:"900–2500m",neighbours:"Meru, Embu, Kitui, Isiolo"},connectivity:["B6 Road (Chuka–Meru)","Chuka–Marimba Road","Nithi Bridge","Chuka Airstrip"],subcounties:["Tharaka North","Tharaka South","Chuka/Igambang'ombe","Maara"]},
  "Embu":{code:14,cap:"Embu",pop:"608K",popM:0.608,area:"2,818",region:"Eastern",governor:"Cecily Mbarire",known:"Situated on the southern slopes of Mt. Kenya, Embu is a scenic highland county rich in agriculture, particularly coffee, tea, and food crops, with access to Mt. Kenya's forests.",funfact:"Embu County sits within the Embu–Meru–Kikuyu triangle that forms the cultural heartland of the Bantu-speaking people of Mt. Kenya's slopes.",landmarks:["Mt. Kenya National Park (SE Gate)","Tana River source","Runyenjes market","Ena/Siakago highlands"],industries:["Coffee & Tea","Food Crops","Horticulture","Hydropower"],gcp:"KES 50B",gcpTier:"low",gcpHighlights:["Coffee and tea are major export earners","Tana River hydroelectric schemes source from here","Growing small-scale manufacturing in Embu town"],geo:{terrain:"Mt. Kenya slopes, river valleys",climate:"Highland, moderate rainfall",elevation:"900–3000m",neighbours:"Meru, Kirinyaga, Machakos, Kitui, Tharaka Nithi"},connectivity:["A3 Highway (Embu–Nairobi)","B6 Road","Embu–Ishiara Road","Embu Airstrip"],subcounties:["Mbeere North","Mbeere South","Embu East","Embu West","Embu North","Runyenjes"]},
  "Kitui":{code:15,cap:"Kitui",pop:"1.1M",popM:1.1,area:"24,385",region:"Eastern",governor:"Julius Malombe",known:"A large semi-arid county with vast coal and mineral reserves, Kitui is transitioning from subsistence farming to a mineral-rich economy with significant untapped potential.",funfact:"Kitui has one of the largest coal deposits in East Africa—the Mui Basin contains an estimated 400 million tonnes of coal, though development remains pending environmental reviews.",landmarks:["Yatta Plateau (world's longest lava flow)","Kora National Reserve","Mui Basin","Kitui National Reserve"],industries:["Mining","Farming","Livestock","Coal Energy"],gcp:"KES 65B",gcpTier:"mid",gcpHighlights:["Mui Basin coal reserve could be transformative","Yatta Plateau tourism underdeveloped but growing","Significant sand harvesting along Tana River"],geo:{terrain:"Semi-arid plains, scattered hills",climate:"Semi-arid",elevation:"600–1600m",neighbours:"Embu, Tharaka Nithi, Garissa, Tana River, Machakos, Makueni, Meru"},connectivity:["A9 Highway","Kitui–Mutomo Road","Kitui–Mwingi Road","Kitui Airstrip"],subcounties:["Kitui Central","Kitui West","Kitui Rural","Kitui South","Kitui East","Mwingi North","Mwingi West","Mwingi Central"]},
  "Machakos":{code:16,cap:"Machakos",pop:"1.4M",popM:1.4,area:"5,952",region:"Eastern",governor:"Wavinya Ndeti",known:"Often called 'The Chosen Land', Machakos is a growing industrial and real estate hub in Nairobi's eastern orbit, with a fast-urbanising population and strong Kamba cultural heritage.",funfact:"Machakos town was the first inland capital of British East Africa and one of the earliest missionary and commercial outposts established by European colonists in the interior.",landmarks:["Machakos People's Park","Fourteen Falls (Ol Donyo Sabuk area)","Iveti Hills","Machakos Town Museum"],industries:["Manufacturing","Logistics","Horticulture","Real Estate"],gcp:"KES 120B",gcpTier:"mid",gcpHighlights:["Major industrial area along Mombasa Road","Athi River is a key manufacturing hub","Rapid real estate development driven by Nairobi spillover"],geo:{terrain:"Hills and semi-arid plains",climate:"Semi-arid, bimodal rainfall",elevation:"1000–1800m",neighbours:"Nairobi, Kiambu, Murang'a, Embu, Kitui, Makueni, Kajiado"},connectivity:["A109 Highway (Mombasa Road)","SGR Athi River Station","Jomo Kenyatta Int'l Airport (nearby)","Eastern Bypass"],subcounties:["Masinga","Yatta","Kangundo","Matungulu","Kathiani","Mavoko","Machakos","Mwala"]},
  "Makueni":{code:17,cap:"Wote",pop:"987K",popM:0.987,area:"8,008",region:"Eastern",governor:"Mutula Kilonzo Junior",known:"A semi-arid county southeast of Nairobi, Makueni has become a model county for innovative governance, fruit value chains, and community health financing.",funfact:"Makueni was the first county in Kenya to implement a universal health care scheme at county level, covering all residents for a nominal annual household fee of KES 500.",landmarks:["Chyulu Hills National Park","Kibwezi Forest","Makueni Fruit Processing Plant","Sultan Hamud","Amboseli (border area)"],industries:["Mango & Fruits","Food Crops","Sisal","Water Harvesting"],gcp:"KES 58B",gcpTier:"low",gcpHighlights:["County mango processing plant earns national awards","Model county for UHC and governance innovations","Chyulu Hills carbon credit projects"],geo:{terrain:"Semi-arid plains, hills",climate:"Semi-arid",elevation:"800–2000m",neighbours:"Machakos, Kitui, Kajiado, Taita Taveta"},connectivity:["A109 Highway (Mombasa Road)","SGR Sultan Hamud Station","Wote–Kibwezi Road","Makindu Airstrip"],subcounties:["Mbooni","Kilome","Kaiti","Makueni","Kibwezi West","Kibwezi East"]},
  "Nyandarua":{code:18,cap:"Ol Kalou",pop:"638K",popM:0.638,area:"3,107",region:"Central",governor:"Kiarie Badilisha",known:"A cool, high-altitude county in the Aberdare Range, Nyandarua is Kenya's potato basket and a key producer of vegetables and dairy products.",funfact:"Nyandarua was the site of Mau Mau freedom fighters' forest strongholds during Kenya's independence struggle—the Aberdare forests here are deeply embedded in national liberation history.",landmarks:["Aberdare National Park","Ol Kalou Arboretum","Lake Ol Bolossat","North Kinangop","Aberdare Ranges"],industries:["Potato Farming","Vegetables","Dairy Farming","Timber/Forestry"],gcp:"KES 48B",gcpTier:"low",gcpHighlights:["Nyandarua supplies 40% of Kenya's potato production","Significant dairy cooperative movement","Aberdare watershed is critical for Nairobi water supply"],geo:{terrain:"Highland plateau, Aberdare Range",climate:"Cold highland",elevation:"2100–3999m",neighbours:"Nyeri, Murang'a, Kiambu, Nakuru, Laikipia"},connectivity:["B5 Road (Ol Kalou–Nakuru)","C68 Road (Naivasha link)","Nyahururu–Ol Kalou Road","Ol Kalou Airstrip"],subcounties:["Kinangop","Kipipiri","Ol Kalou","Ndaragwa","Mirangine"]},
  "Nyeri":{code:19,cap:"Nyeri",pop:"759K",popM:0.759,area:"3,337",region:"Central",governor:"Mutahi Kahiga",known:"Set against the slopes of Mt. Kenya and the Aberdare Range, Nyeri is a scenic highland county famed for coffee, tea, tourism, and as the birthplace of Robert Baden-Powell's scouting movement.",funfact:"Robert Baden-Powell, founder of the global Scout movement, spent his final years in Nyeri and is buried at St. Peter's cemetery—his grave reads 'Robert Baden-Powell, Chief Scout of the World.'",landmarks:["Mt. Kenya National Park (Western Gate)","Aberdare National Park","Treetops Lodge","Outspan Hotel","Solio Ranch (Rhino Sanctuary)"],industries:["Coffee & Tea","Tourism","Horticulture","Dairy"],gcp:"KES 72B",gcpTier:"mid",gcpHighlights:["Nyeri coffee is among Kenya's highest-rated AA grade","Major tourism corridor between Mt. Kenya and Aberdares","Solio Ranch is Kenya's largest private rhino sanctuary"],geo:{terrain:"Highland, Mt. Kenya slopes, Aberdare foothills",climate:"Cool highland, heavy rainfall",elevation:"1500–3000m",neighbours:"Nyandarua, Murang'a, Embu, Meru, Laikipia, Kirinyaga"},connectivity:["A2 Highway (Nyeri–Nairobi)","Nyeri Airport","B5 Road (Nyeri–Nyahururu)","Mt. Kenya access roads"],subcounties:["Tetu","Kieni","Mathira","Othaya","Mukurweini","Nyeri Town"]},
  "Kirinyaga":{code:20,cap:"Kutus",pop:"610K",popM:0.610,area:"1,205",region:"Central",governor:"Anne Waiguru",known:"A compact, highly productive county on the southern slopes of Mt. Kenya, Kirinyaga is Kenya's top rice-growing region and a major tea and horticulture producer.",funfact:"Kirinyaga's Mwea Irrigation Scheme produces over 80% of Kenya's locally grown rice, covering 30,000 acres of paddies watered by glacial Mt. Kenya rivers.",landmarks:["Mwea National Reserve","Mt. Kenya (southern views)","Mwea Irrigation Scheme","Sagana River Rafting"],industries:["Rice Farming","Tea","Horticulture","Irrigation"],gcp:"KES 45B",gcpTier:"low",gcpHighlights:["Mwea Scheme: 80% of Kenya's domestic rice","Horticulture exports through Nairobi auction","Sagana water sports growing as tourism product"],geo:{terrain:"River plains, Mt. Kenya lower slopes",climate:"Moderate, high rainfall",elevation:"900–2500m",neighbours:"Nyeri, Murang'a, Embu, Machakos"},connectivity:["B6 Road (Sagana junction)","Sagana–Kagio Road","Kutus–Kerugoya Road","Sagana airstrip"],subcounties:["Gichugu","Ndia","Kirinyaga Central","Mwea"]},
  "Muranga":{code:21,cap:"Muranga",pop:"1.0M",popM:1.0,area:"2,326",region:"Central",governor:"Irungu Kang'ata",known:"A fertile central highlands county famed for its coffee and tea production, Murang'a has a deep historical connection to Kenya's independence movement and Kikuyu cultural heritage.",funfact:"Murang'a is the legendary birthplace of Gikuyu and Mumbi—the mythological ancestors of the Kikuyu people, making the county spiritually and culturally central to Kenya's largest ethnic group.",landmarks:["Gikuyu and Mumbi Cultural Centre","Fourteen Falls","Thika River","Aberdare Forest (border)","Murang'a Museum"],industries:["Coffee & Tea","Horticulture","Dairy","Manufacturing"],gcp:"KES 80B",gcpTier:"mid",gcpHighlights:["Major coffee cooperative movement (KPCU)","Thika road industrial corridor extends here","Significant cut-flower farms for export"],geo:{terrain:"Highland ridges, river valleys",climate:"Highland moderate",elevation:"1000–2600m",neighbours:"Nyeri, Kirinyaga, Embu, Machakos, Kiambu, Nyandarua"},connectivity:["A2 Highway (Thika–Muranga)","B6 Road","Muranga–Sagana Road","Murang'a Airstrip"],subcounties:["Kandara","Gatanga","Kiharu","Kigumo","Maragua","Mathioya"]},
  "Kiambu":{code:22,cap:"Kiambu",pop:"2.4M",popM:2.4,area:"2,449",region:"Central",governor:"Kimani Wamatangi",known:"Nairobi's northern neighbour, Kiambu is Kenya's most urbanised rural county, home to booming satellite towns, premium coffee estates, and a rapidly growing middle-class population.",funfact:"Kiambu was home to some of Kenya's first and most famous coffee estates—Limuru's Tigoni area produces some of the world's finest Arabica coffee at altitudes over 2,200m.",landmarks:["Karura Forest","Thika town","Limuru Tea Estates","Fourteen Falls","Kiambu Golf Club"],industries:["Real Estate","Coffee & Tea","Manufacturing","Retail/Services"],gcp:"KES 280B",gcpTier:"high",gcpHighlights:["Second only to Nairobi in economic output","Thika is a major industrial and manufacturing hub","Premium coffee from Limuru fetches top global prices"],geo:{terrain:"Highland ridges, Rift Valley escarpment",climate:"Highland moderate, good rainfall",elevation:"1500–2500m",neighbours:"Nairobi, Murang'a, Nyandarua, Nakuru, Kajiado, Machakos"},connectivity:["A2 Highway (Thika Superhighway)","A104 Highway (Limuru)","Nairobi Expressway links","JKIA (nearby)"],subcounties:["Thika Town","Ruiru","Juja","Gatundu South","Gatundu North","Githunguri","Kiambu","Kiambaa","Kabete","Kikuyu","Limuru","Lari"]},
  "Turkana":{code:23,cap:"Lodwar",pop:"926K",popM:0.926,area:"71,597",region:"Rift Valley",governor:"Felix Mariba",known:"Kenya's largest county by area and one of its most remote, Turkana borders four countries and Lake Turkana—the world's largest permanent desert lake—and has emerging oil reserves.",funfact:"Lake Turkana's Sibiloi National Park contains the world's largest known field of fossil hominid remains, including Turkana Boy—a nearly complete 1.6-million-year-old Homo erectus skeleton.",landmarks:["Lake Turkana (Jade Sea)","Sibiloi National Park (UNESCO)","Central Island National Park","Lodwar town","Kerio Valley"],industries:["Oil & Gas","Wind/Solar","Fishing","Pastoralism"],gcp:"KES 48B",gcpTier:"low",gcpHighlights:["Oil reserves discovered in Lokichar Basin—production pending","Lake Turkana Wind Power (310MW) feeds national grid","Artisanal fishing supports livelihoods of 100,000+"],geo:{terrain:"Desert, lake basin, mountains",climate:"Hot & arid",elevation:"360–1800m",neighbours:"Marsabit, Samburu, Baringo, West Pokot, Uganda, Ethiopia, South Sudan"},connectivity:["A1 Highway (Kitale–Lodwar)","Lodwar Airport","Lokichoggio Airstrip","Turkana–Marsabit Road"],subcounties:["Turkana Central","Loima","Turkana North","Turkana South","Kibish","Turkana East","Turkana West"]},
  "West Pokot":{code:24,cap:"Kapenguria",pop:"621K",popM:0.621,area:"9,169",region:"Rift Valley",governor:"Simon Kachapin",known:"A highland and semi-arid county in northwestern Kenya, West Pokot is home to the proud Pokot pastoralist community and scenic landscapes along the Rift Valley escarpment.",funfact:"West Pokot has one of Kenya's most dramatic landscapes—the Kerio Valley separates it from Elgeyo Marakwet with cliffs dropping nearly 2,000 metres in a few kilometres.",landmarks:["Kerio Valley","Kacheliba Market","Kamatira Forest","Nasiger Hills","Pokot Cultural Villages"],industries:["Pastoralism","Farming","Gemstone Mining","Tourism"],gcp:"KES 30B",gcpTier:"low",gcpHighlights:["Tourmaline and other gemstone mining growing","Livestock is primary economic backbone","Government investment in irrigation schemes"],geo:{terrain:"Mountains, valleys, semi-arid plains",climate:"Highland to semi-arid",elevation:"900–3000m",neighbours:"Turkana, Trans Nzoia, Elgeyo Marakwet, Baringo, Uganda"},connectivity:["A1 Highway","Kapenguria–Kitale Road","Kacheliba border road","Kapenguria Airstrip"],subcounties:["North Pokot","West Pokot","Central Pokot","South Pokot"]},
  "Samburu":{code:25,cap:"Maralal",pop:"310K",popM:0.310,area:"20,182",region:"Rift Valley",governor:"Jonathan Lelelit",known:"A remote, semi-arid county in northern Kenya, Samburu is home to the iconic Samburu people with their distinctive beadwork, and three world-famous wildlife reserves.",funfact:"The Samburu National Reserve is the only place in Kenya where you can find the 'Samburu Special Five'—Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk antelope.",landmarks:["Samburu National Reserve","Shaba National Reserve","Buffalo Springs Reserve","Maralal town","Nyahururu Falls (border)"],industries:["Wildlife Tourism","Pastoralism","Gemstones","Solar Energy"],gcp:"KES 20B",gcpTier:"low",gcpHighlights:["Samburu reserves are among Kenya's top wildlife destinations","Growing community conservancy model","Beadwork and cultural tourism emerging"],geo:{terrain:"Semi-arid plains, mountains",climate:"Hot & dry",elevation:"800–2500m",neighbours:"Marsabit, Isiolo, Laikipia, Baringo, Turkana"},connectivity:["A2 Highway","Maralal–Nyahururu Road","Maralal–Baragoi Road","Maralal Airstrip"],subcounties:["Samburu East","Samburu North","Samburu West"]},
  "Trans Nzoia":{code:26,cap:"Kitale",pop:"990K",popM:0.990,area:"2,494",region:"Rift Valley",governor:"George Natembeya",known:"Kenya's 'Maize Basket', Trans Nzoia's fertile plains around Kitale produce the highest volumes of maize in the country, anchoring national food security.",funfact:"Trans Nzoia's Kitale town hosts one of Africa's oldest agricultural shows—the Kitale Agricultural Show has been running since 1925, showcasing farming innovation.",landmarks:["Mt. Elgon National Park","Kitale Museum","Saiwa Swamp National Park (world's smallest park)","Kitale Nature Conservancy"],industries:["Maize & Grains","Horticulture","Dairy","Seed Farming"],gcp:"KES 78B",gcpTier:"mid",gcpHighlights:["Trans Nzoia produces 30%+ of Kenya's maize","Major certified seed production for national market","Significant dairy and beef sector"],geo:{terrain:"Fertile plains, Mt. Elgon slopes",climate:"Highland, high rainfall",elevation:"1700–2000m",neighbours:"Turkana, West Pokot, Elgeyo Marakwet, Uasin Gishu, Bungoma, Uganda"},connectivity:["A1 Highway (Eldoret–Kitale)","Kitale Airport","B2 Road (Uganda border)","Kitale–Lokichar Road"],subcounties:["Kiminini","Saboti","Kwanza","Cherangany","Trans Nzoia East","Trans Nzoia West"]},
  "Uasin Gishu":{code:27,cap:"Eldoret",pop:"1.1M",popM:1.1,area:"3,345",region:"Rift Valley",governor:"Jonathan Bii",known:"Home to Eldoret—Kenya's fifth-largest city—Uasin Gishu is synonymous with world-class athletics, producing more Olympic champions per capita than almost any region on earth.",funfact:"The area around Eldoret and Iten is known as the 'Home of Champions'—Kenyan long-distance runners from this Rift Valley highland region have won more Olympic medals than most countries combined.",landmarks:["High Altitude Athletics Training Centre","Eldoret Airport (Moi International)","Rupa Mall","Eldoret University Area","Kerio Valley views"],industries:["Athletics Industry","Wheat & Maize","Manufacturing","Logistics Hub"],gcp:"KES 140B",gcpTier:"mid",gcpHighlights:["Eldoret is a major logistics hub for East Africa","Home to Rivatex East Africa textile manufacturer","Agriculture remains the county's largest employer"],geo:{terrain:"High plateau, Rift Valley edge",climate:"Cool highland",elevation:"2000–2500m",neighbours:"Trans Nzoia, West Pokot, Elgeyo Marakwet, Nandi, Kericho, Nakuru"},connectivity:["Moi International Airport (Eldoret)","A104 Highway","SGR Eldoret Station (planned)","B2 Road (Uganda)"],subcounties:["Soy","Turbo","Moiben","Ainabkoi","Kapseret","Kesses"]},
  "Elgeyo Marakwet":{code:28,cap:"Iten",pop:"454K",popM:0.454,area:"3,030",region:"Rift Valley",governor:"Wisley Rotich",known:"A breathtaking highland county famous globally for producing elite marathon and distance runners, with the Kerio Valley below providing one of Kenya's most dramatic landscapes.",funfact:"Iten town is often called 'The Home of Champions'—more Olympic marathon medals have been won by athletes training at this 2,400m altitude camp than from any comparable small town globally.",landmarks:["Kerio Valley","Iten High Altitude Training Camp","Elgeyo Escarpment","Marakwet Irrigation System (ancient)","Chesongoch Gorge"],industries:["Athletics Training","Tea Farming","Subsistence Farming","Adventure Tourism"],gcp:"KES 28B",gcpTier:"low",gcpHighlights:["Iten is a global athletics mecca drawing training camps worldwide","Ancient Marakwet irrigation canals span 50km","Adventure tourism in Kerio Valley growing"],geo:{terrain:"Escarpment, valley, highlands",climate:"Cool highland to warm valley",elevation:"1000–3300m",neighbours:"Turkana, West Pokot, Trans Nzoia, Uasin Gishu, Nandi, Baringo"},connectivity:["C51 Road (Iten–Eldoret)","Iten–Kabarnet Road","Kerio Valley Road","Iten Airstrip"],subcounties:["Keiyo North","Keiyo South","Marakwet East","Marakwet West"]},
  "Nandi":{code:29,cap:"Kapsabet",pop:"885K",popM:0.885,area:"2,884",region:"Rift Valley",governor:"Stephen Sang",known:"A verdant highland county in the western Rift Valley, Nandi is a major tea-producing region and another athletics powerhouse with a deeply proud Nandi cultural heritage.",funfact:"The Nandi were the only community in sub-Saharan Africa to successfully resist British colonial advance for over a decade—the 'Nandi Resistance' of 1895–1906 is a celebrated chapter of African history.",landmarks:["Nandi Hills Tea Estates","Kipsigis Cultural Museum","Chemundu–Kaptumo Tea Zone","Nandi Forest","Kapsabet town"],industries:["Tea Farming","Athletics","Dairy","Maize"],gcp:"KES 68B",gcpTier:"mid",gcpHighlights:["Nandi Hills tea is among Kenya's finest","Major dairy cooperative movement","Several Olympic medalists hail from Nandi"],geo:{terrain:"Hilly highlands, tea zones",climate:"Cool highland, high rainfall",elevation:"1500–2200m",neighbours:"Uasin Gishu, Trans Nzoia, Elgeyo Marakwet, Baringo, Kericho, Kisumu, Vihiga, Kakamega"},connectivity:["A104 Highway","Kapsabet–Eldoret Road","Nandi Hills–Kisumu Road","Kapsabet Airstrip"],subcounties:["Tinderet","Aldai","Nandi Hills","Chesumei","Emgwen","Mosop"]},
  "Baringo":{code:30,cap:"Kabarnet",pop:"666K",popM:0.666,area:"11,075",region:"Rift Valley",governor:"Benjamin Cheboi",known:"A scenic Rift Valley county centred on the stunning Lake Baringo—one of Kenya's few freshwater Rift lakes—surrounded by arid and highland landscapes.",funfact:"Lake Baringo is home to over 470 species of birds and is one of the top birding destinations in Africa—including the rare, prehistoric-looking Goliath Heron and Verreaux's Eagle.",landmarks:["Lake Baringo","Lake Bogoria (Flamingos)","Kampi ya Samaki","Eldama Ravine","Marigat town"],industries:["Eco-Tourism","Pastoralism","Fishing","Geothermal"],gcp:"KES 38B",gcpTier:"low",gcpHighlights:["Lake Baringo is a growing eco-tourism destination","Lake Bogoria geothermal resources being explored","Significant livestock economy"],geo:{terrain:"Rift Valley floor, escarpment, highlands",climate:"Semi-arid floor, highland",elevation:"900–2600m",neighbours:"Turkana, Samburu, Laikipia, Nakuru, Uasin Gishu, Elgeyo Marakwet, Nandi, West Pokot"},connectivity:["A104 Highway","Kabarnet–Nakuru Road","Marigat–Loruk Road","Kabarnet Airstrip"],subcounties:["Tiaty","Baringo Central","Baringo North","Baringo South","Eldama Ravine","Mogotio"]},
  "Laikipia":{code:31,cap:"Rumuruti",pop:"518K",popM:0.518,area:"9,462",region:"Rift Valley",governor:"Joshua Irungu",known:"A unique highland plateau north of Mt. Kenya, Laikipia hosts Africa's densest network of private wildlife conservancies, offering luxury safari experiences outside of national parks.",funfact:"Laikipia has more black rhinos than any place outside a national park in Africa—the private conservancy model here has made it a global benchmark for community-based conservation.",landmarks:["Ol Pejeta Conservancy","Lewa Wildlife Conservancy (UNESCO)","Ol Jogi Conservancy","Solio Ranch","Ewaso Ng'iro River"],industries:["Conservation & Safari","Wheat Farming","Livestock Ranching","Luxury Tourism"],gcp:"KES 52B",gcpTier:"low",gcpHighlights:["Private conservancies generate premium tourism revenue","Ol Pejeta is the world's most visited rhino sanctuary","Carbon credit and conservation finance growing"],geo:{terrain:"Plateau, semi-arid savanna",climate:"Highland semi-arid",elevation:"1600–2600m",neighbours:"Samburu, Isiolo, Meru, Nyeri, Nyandarua, Nakuru, Baringo"},connectivity:["A2 Highway (Nanyuki junction)","Nanyuki Airport","Dol Dol–Rumuruti Road","Nanyuki–Isiolo Road"],subcounties:["Laikipia East","Laikipia North","Laikipia West","Nyahururu","Laikipia Central"]},
  "Nakuru":{code:32,cap:"Nakuru",pop:"2.1M",popM:2.1,area:"7,509",region:"Rift Valley",governor:"Susan Kihika",known:"Kenya's fourth-largest urban centre, Nakuru sits in the heart of the Rift Valley and is a major agricultural, industrial, and tourism hub famed for Lake Nakuru's flamingos.",funfact:"Lake Nakuru was once described as 'the world's greatest ornithological spectacle'—at its peak, up to 2 million flamingos would gather on the lake's alkaline waters simultaneously.",landmarks:["Lake Nakuru National Park","Menengai Crater","Hell's Gate (Naivasha)","Hyrax Hill Museum","Nakuru Town"],industries:["Agriculture","Manufacturing","Tourism","Dairy & Pyrethrum"],gcp:"KES 220B",gcpTier:"high",gcpHighlights:["Nakuru is Kenya's third-largest economy","Major flower and vegetable export zone","Significant industrial base around Nakuru town"],geo:{terrain:"Rift Valley floor, escarpment, highlands",climate:"Highland moderate",elevation:"1750–2500m",neighbours:"Nyandarua, Baringo, Laikipia, Nandi, Kericho, Narok, Nairobi, Kiambu"},connectivity:["A104 Highway (Nairobi–Nakuru–Eldoret)","Nakuru–Naivasha SGR","Nakuru Airport","B5 Road (Nakuru–Nyahururu)"],subcounties:["Molo","Rongai","Subukia","Njoro","Naivasha","Gilgil","Nakuru Town East","Nakuru Town West","Bahati","Kuresoi North","Kuresoi South"]},
  "Narok":{code:33,cap:"Narok",pop:"1.1M",popM:1.1,area:"17,921",region:"Rift Valley",governor:"Patrick Ole Ntutu",known:"The land of the Maasai, Narok is home to the world-famous Maasai Mara National Reserve—Africa's premier wildlife destination and the site of the legendary Great Wildebeest Migration.",funfact:"The Great Wildebeest Migration, where 1.5 million wildebeest cross the Mara River annually between Narok and Tanzania's Serengeti, is considered the greatest wildlife show on earth.",landmarks:["Maasai Mara National Reserve","Mara River","Oloolaimutia Gate","Narok town","Loita Hills"],industries:["Wildlife Tourism","Wheat Farming","Maasai Pastoralism","Floriculture"],gcp:"KES 115B",gcpTier:"mid",gcpHighlights:["Maasai Mara earns Kenya over USD 200M annually in tourism","Narok produces 60%+ of Kenya's wheat","Community conservancies are expanding rapidly"],geo:{terrain:"Open savanna, Mara plains, escarpment",climate:"Semi-arid to highland",elevation:"1600–2800m",neighbours:"Nakuru, Bomet, Kisii, Migori, Tanzania, Kajiado"},connectivity:["A104 Highway (junction)","B3 Road (Narok–Mara)","Keekorok Airstrip","Multiple Mara airstrips","Wilson Airport flights"],subcounties:["Kilgoris","Emurua Dikirr","Narok North","Narok East","Narok South","Narok West"]},
  "Kajiado":{code:34,cap:"Kajiado",pop:"1.1M",popM:1.1,area:"21,901",region:"Rift Valley",governor:"Joseph Lenku",known:"A sprawling Maasai county south of Nairobi bordering Tanzania, Kajiado combines Maasai culture with rapid urbanisation in satellite towns like Ongata Rongai and Kitengela.",funfact:"Amboseli National Park in Kajiado offers the most iconic view on the continent—elephants with Mt. Kilimanjaro (in Tanzania) as a backdrop—making it Kenya's most-photographed wildlife destination.",landmarks:["Amboseli National Park","Mt. Kilimanjaro views","Magadi Soda Lake","Olkejuado","Ongata Rongai"],industries:["Tourism","Livestock","Soda Ash Mining","Real Estate"],gcp:"KES 130B",gcpTier:"mid",gcpHighlights:["Amboseli is among Kenya's top 3 most visited parks","Magadi Soda (TATA Chemicals) is a major exporter","Rapid real estate growth driven by Nairobi overflow"],geo:{terrain:"Plains, savanna, semi-arid",climate:"Semi-arid",elevation:"600–2500m",neighbours:"Nairobi, Kiambu, Machakos, Makueni, Taita Taveta, Tanzania, Narok"},connectivity:["A104 Highway (Nairobi–Mombasa junction)","A109 Highway","JKIA (nearby)","Amboseli Airstrip","Magadi Road"],subcounties:["Kajiado Central","Kajiado North","Kajiado East","Kajiado West","Loitokitok"]},
  "Kericho":{code:35,cap:"Kericho",pop:"943K",popM:0.943,area:"2,479",region:"Rift Valley",governor:"Eric Mutai",known:"Kenya's Tea Capital, the endless green tea estates around Kericho produce some of the world's finest black tea under near-perfect growing conditions on the Rift Valley highland.",funfact:"Kericho's unique geography gives it 'two-handed rainfall' where it rains almost every afternoon, creating ideal tea-growing conditions year-round.",landmarks:["Kericho Tea Estates (Unilever/Finlays)","Chagaik Arboretum","Kaisugu Forest","Mau Forest (border)","Kericho town"],industries:["Tea Production","Tea Processing","Dairy","Forestry"],gcp:"KES 98B",gcpTier:"mid",gcpHighlights:["Kericho produces 20%+ of Kenya's tea export volume","Headquarters of Finlays and Unilever tea operations","Kenya Tea Packers (KETEPA) major plant here"],geo:{terrain:"Highland plateau, tea estates",climate:"Cool highland, high rainfall",elevation:"1900–2600m",neighbours:"Nandi, Uasin Gishu, Baringo, Nakuru, Narok, Bomet, Kisumu"},connectivity:["A1 Highway","B1 Road (Kericho–Kisumu)","Kericho Airstrip","B3 Road (Kericho–Bomet)"],subcounties:["Ainamoi","Belgut","Kipkelion East","Kipkelion West","Soin/Sigowet","Bureti"]},
  "Bomet":{code:36,cap:"Bomet",pop:"875K",popM:0.875,area:"1,997",region:"Rift Valley",governor:"Hillary Barchok",known:"A compact highland county in the southwestern Rift Valley, Bomet produces significant quantities of tea and dairy, and is home to the Kipsigis community with a proud pastoralist heritage.",funfact:"Bomet's Chepalungu Forest is one of the few remaining montane forests in the western Rift Valley and is a critical water tower for rivers feeding Lake Victoria.",landmarks:["Chepalungu Forest","Bomet town","Longisa Tea Zone","Ndanai–Abosi area","Sotik Tea Estates"],industries:["Tea Farming","Dairy Farming","Food Crops","Forestry"],gcp:"KES 62B",gcpTier:"mid",gcpHighlights:["Bomet-Sotik zone is a significant tea producing area","Dairy cooperative movement well established","Emerging avocado farming for export"],geo:{terrain:"Hilly highland",climate:"Cool highland, good rainfall",elevation:"1700–2400m",neighbours:"Kericho, Narok, Kisii, Nyamira, Nakuru"},connectivity:["B1 Road (Bomet–Kericho)","B3 Road (Bomet–Narok)","Bomet–Sotik Road","Bomet Airstrip"],subcounties:["Bomet Central","Bomet East","Chepalungu","Konoin","Sotik"]},
  "Kakamega":{code:37,cap:"Kakamega",pop:"1.8M",popM:1.8,area:"3,051",region:"Western",governor:"Fernandes Barasa",known:"Kenya's most populous county, Kakamega is home to the magnificent Kakamega Forest—East Africa's last remaining tropical rainforest and an extraordinary biodiversity hotspot.",funfact:"Kakamega Forest hosts over 300 species of birds, 400 species of butterflies, and rare species like the De Brazza's monkey—it is a relic of the ancient Congo Basin forest that once stretched across Africa.",landmarks:["Kakamega Forest National Reserve","Crying Stone of Ilesi","Kakamega Golf Hotel","Mumias Sugar Factory","Webuye Falls"],industries:["Sugarcane","Horticulture","Forestry","Manufacturing"],gcp:"KES 145B",gcpTier:"mid",gcpHighlights:["Largest county population drives consumer economy","Mumias Sugar Company historically dominant","Kakamega forest carbon credits gaining attention"],geo:{terrain:"Hilly, forest patches, plains",climate:"Tropical humid",elevation:"1300–2000m",neighbours:"Vihiga, Bungoma, Nandi, Siaya, Busia, Trans Nzoia"},connectivity:["A1 Highway (Eldoret–Kisumu)","Kakamega Airport","B13 Road","Kakamega–Kisumu Road"],subcounties:["Lugari","Likuyani","Malava","Lurambi","Navakholo","Mumias West","Mumias East","Matungu","Butere","Khwisero","Shinyalu","Ikolomani"]},
  "Vihiga":{code:38,cap:"Vihiga",pop:"590K",popM:0.590,area:"531",region:"Western",governor:"Wilber Ottichilo",known:"Kenya's smallest county by area, Vihiga is one of the most densely populated rural counties in Africa, known for its hilly terrain, Maragoli cultural heritage, and community spirit.",funfact:"Vihiga has a population density of over 1,000 people per square kilometre in parts—making it denser than many of Africa's major cities, yet it remains largely rural and agricultural.",landmarks:["Maragoli Hills","Vihiga Forest","Musanda Rock","Friends Church Kaimosi Mission","Hamisi town"],industries:["Horticulture","Tea","Subsistence Farming","Small Business"],gcp:"KES 32B",gcpTier:"low",gcpHighlights:["High diaspora remittances support local economy","Horticulture for Nairobi markets significant","Growing education and service sector"],geo:{terrain:"Hilly, small valleys",climate:"Highland humid",elevation:"1400–1800m",neighbours:"Kakamega, Siaya, Kisumu, Nandi"},connectivity:["B13 Road","Vihiga–Kisumu Road","Mbale–Luanda Road","Bus network to Kisumu"],subcounties:["Vihiga","Sabatia","Hamisi","Luanda","Emuhaya"]},
  "Bungoma":{code:39,cap:"Bungoma",pop:"1.6M",popM:1.6,area:"3,032",region:"Western",governor:"Ken Lusaka",known:"A fertile western county at the foot of Mt. Elgon, Bungoma is Kenya's sugarcane heartland and a regional commercial centre with strong cross-border trade with Uganda.",funfact:"Bungoma is home to Chetambe Fort, a pre-colonial stone fortress built by the Bukusu community—one of the few examples of indigenous stone military architecture in western Kenya.",landmarks:["Mt. Elgon National Park","Chetambe Fort","Malakisi River","Webuye Falls","Chwele Market"],industries:["Sugarcane","Maize","Cross-border Trade","Dairy"],gcp:"KES 110B",gcpTier:"mid",gcpHighlights:["West Kenya Sugar Company and other mills dominate","Major maize-producing county","Mt. Elgon tourism underdeveloped but growing"],geo:{terrain:"Plains, Mt. Elgon foothills",climate:"Highland humid",elevation:"1200–4321m (Mt. Elgon)"},connectivity:["A104 Highway (Eldoret link)","B2 Road (Uganda border)","Malaba border crossing","Bungoma–Kitale Road"],subcounties:["Mt. Elgon","Sirisia","Kabuchai","Bumula","Kanduyi","Webuye East","Webuye West","Kimilili","Tongaren"]},
  "Busia":{code:40,cap:"Busia",pop:"893K",popM:0.893,area:"1,695",region:"Western",governor:"Paul Otuoma",known:"A small but strategically vital county, Busia town is Kenya's busiest cross-border trade point with Uganda, handling billions of shillings in trade daily along the Northern Corridor.",funfact:"The Busia border crossing is the busiest land border in East Africa by volume of goods traded, with over 700 trucks crossing daily carrying goods to and from Uganda, Rwanda, DRC, and beyond.",landmarks:["Busia Border Post","Port Victoria (Lake Victoria)","Sio River","Funyula wetlands"],industries:["Border Trade","Fishing","Sugarcane","Food Crops"],gcp:"KES 48B",gcpTier:"low",gcpHighlights:["Busia border handles USD 500M+ in annual trade","Lake Victoria fishing economy significant","Sugar farming underpins rural livelihoods"],geo:{terrain:"Flat lowlands, lake shore",climate:"Hot & humid",elevation:"1100–1200m",neighbours:"Siaya, Kakamega, Bungoma, Uganda"},connectivity:["A104 Highway (Northern Corridor)","Malaba alternative border","Port Victoria ferry","Busia town road network"],subcounties:["Teso North","Teso South","Nambale","Matayos","Butula","Funyula","Budalangi"]},
  "Siaya":{code:41,cap:"Siaya",pop:"993K",popM:0.993,area:"2,531",region:"Nyanza",governor:"James Orengo",known:"A lakeside county on the shores of Lake Victoria, Siaya is home to the Luo community and is significant for its fishing economy, cultural heritage, and prominent political history.",funfact:"Siaya is the ancestral home of Barack Obama's father—Barack Obama Sr. was born in Kogelo village, and the village now draws thousands of international visitors as a heritage site.",landmarks:["Obama's Grandfather's Home (Kogelo)","Ndere Island National Park","Lake Victoria shore","Yala Swamp","Siaya town"],industries:["Fishing","Food Crops","Solar Energy","Trade"],gcp:"KES 58B",gcpTier:"low",gcpHighlights:["Fishing is the primary economic activity","Yala Swamp rice irrigation scheme","Significant diaspora remittances"],geo:{terrain:"Lowland, lake shore",climate:"Hot & humid",elevation:"1000–1500m",neighbours:"Busia, Kakamega, Vihiga, Kisumu, Homa Bay, Uganda"},connectivity:["A1 Highway","Siaya–Kisumu Road","Ndere Island ferry","Siaya Airstrip"],subcounties:["Gem","Ugunja","Ugenya","Alego Usonga","Bondo","Rarieda"]},
  "Kisumu":{code:42,cap:"Kisumu",pop:"1.1M",popM:1.1,area:"2,009",region:"Nyanza",governor:"Anyang' Nyong'o",known:"Kenya's third-largest city and the economic hub of western Kenya, Kisumu sits on Lake Victoria's Winam Gulf and is a growing tech, trade, and medical research centre.",funfact:"Kisumu was once served by a steamship named the SS William Mackinnon in the 1890s—it was dismantled in England, shipped in pieces to Mombasa, and reassembled 1,300km inland on Lake Victoria.",landmarks:["Kisumu Museum","Impala Sanctuary","Kisumu Waterfront","Dunga Beach","Ahero Rice Scheme"],industries:["Lake Trade","Fishing","Medical Research","Manufacturing"],gcp:"KES 160B",gcpTier:"mid",gcpHighlights:["Kisumu port revival boosts Lake Victoria trade","KEMRI Kisumu is East Africa's malaria research hub","Growing tech and startup ecosystem in Kisumu"],geo:{terrain:"Lake shore, flat plains",climate:"Hot & humid",elevation:"1100–1300m",neighbours:"Siaya, Vihiga, Nandi, Kericho, Homa Bay"},connectivity:["A1 Highway","Kisumu International Airport","Kisumu Port (Lake Victoria)","SGR Kisumu (planned)"],subcounties:["Kisumu Central","Kisumu East","Kisumu West","Seme","Nyando","Muhoroni","Nyakach"]},
  "Homa Bay":{code:43,cap:"Homa Bay",pop:"1.1M",popM:1.1,area:"3,183",region:"Nyanza",governor:"Gladys Wanga",known:"A scenic county along Lake Victoria's southern shores, Homa Bay features beautiful islands, rich fishing grounds, and is working to address significant healthcare challenges.",funfact:"Rusinga Island in Homa Bay is the burial site of Tom Mboya—one of Africa's most celebrated pan-Africanist politicians—and also where Mary Leakey discovered a 17-million-year-old primate skull.",landmarks:["Ruma National Park","Rusinga Island","Mfangano Island","Homa Bay town pier","Thimlich Ohinga (UNESCO)"],industries:["Fishing","Island Tourism","Agriculture","Solar Energy"],gcp:"KES 62B",gcpTier:"low",gcpHighlights:["Fishing industry employs over 200,000 people directly","Thimlich Ohinga is a UNESCO heritage site","Island tourism growing under Governor Wanga's push"],geo:{terrain:"Lake shore, islands, hills",climate:"Hot & humid",elevation:"1100–1500m",neighbours:"Kisumu, Migori, Kisii, Nyamira, Siaya"},connectivity:["A1 Highway","Homa Bay–Migori Road","Ferry services to islands","Kisii–Homa Bay Road"],subcounties:["Kabondo Kasipul","Karachuonyo","Kasipul","Mbita","Ndhiwa","Homa Bay Town","Rangwe","Suba North","Suba South"]},
  "Migori":{code:44,cap:"Migori",pop:"1.1M",popM:1.1,area:"2,586",region:"Nyanza",governor:"Ochilo Ayacko",known:"A border county south of Kisumu, Migori is notable for artisanal gold mining, Lake Victoria fishing, and significant cross-border trade with Tanzania.",funfact:"The area around Migori contains some of the oldest gold mining sites in East Africa—local Luo communities have mined gold here using traditional methods for over 200 years.",landmarks:["Macalder Gold Mines","Thimlich Ohinga","Isebania border crossing","Lake Victoria shore","Migori town"],industries:["Gold Mining","Fishing","Border Trade","Agriculture"],gcp:"KES 65B",gcpTier:"low",gcpHighlights:["Gold mining at Macalder employs thousands","Isebania is a major Kenya-Tanzania border crossing","Significant Lake Victoria fishing economy"],geo:{terrain:"Lake shore, hills, plains",climate:"Hot & humid",elevation:"1100–1600m",neighbours:"Homa Bay, Kisii, Narok, Tanzania"},connectivity:["A1 Highway","Isebania border post","Migori–Homabay Road","Kehancha–Migori Road"],subcounties:["Rongo","Awendo","Suna East","Suna West","Uriri","Nyatike","Kuria West","Kuria East"]},
  "Kisii":{code:45,cap:"Kisii",pop:"1.2M",popM:1.2,area:"1,317",region:"Nyanza",governor:"Simba Arati",known:"One of Kenya's most densely populated counties, Kisii is famous for its fertile highlands, Gusii soapstone carvings, and vibrant agricultural economy including tea, pyrethrum, and bananas.",funfact:"Kisii soapstone—a soft, multi-coloured stone found only in Kisii—is hand-carved into sculptures sold worldwide, making Kisii County one of Africa's most prolific centres of craft art.",landmarks:["Tabaka Soapstone Quarry","Kisii University","Manga Ridge","Gusii Highland Farms","Nyamira border hills"],industries:["Tea Farming","Banana & Avocado","Soapstone Carving","Pyrethrum"],gcp:"KES 82B",gcpTier:"mid",gcpHighlights:["Soapstone exports reach markets on 5 continents","Among Kenya's top banana and avocado producers","Tea is a major cash crop"],geo:{terrain:"Hilly highland",climate:"Cool highland, high rainfall",elevation:"1400–2100m",neighbours:"Nyamira, Bomet, Narok, Homa Bay, Migori"},connectivity:["A1 Highway","Kisii–Kisumu Road","B1 Road (Kisii–Kericho)","Kisii Airstrip"],subcounties:["Bonchari","South Mugirango","Bomachoge Borabu","Bobasi","Bomachoge Chache","Nyaribari Masaba","Nyaribari Chache","Kitutu Chache North","Kitutu Chache South"]},
  "Nyamira":{code:46,cap:"Nyamira",pop:"605K",popM:0.605,area:"912",region:"Nyanza",governor:"Amos Nyaribo",known:"A compact highland county bordering Kisii, Nyamira is a leading tea producer with lush rolling hills and a predominantly Gusii farming community.",funfact:"Nyamira has one of Kenya's highest literacy rates at county level, driven by decades of community investment in education and the influence of church missions in the region.",landmarks:["Nyamira Tea Estates","Manga Ridge","Ekerenyo area","Masaba Hills","Magombo Waterfalls"],industries:["Tea Farming","Horticulture","Coffee","Dairy"],gcp:"KES 42B",gcpTier:"low",gcpHighlights:["High tea production per capita","Strong dairy cooperative movement","Significant remittances from diaspora"],geo:{terrain:"Hilly highland",climate:"Cool highland, high rainfall",elevation:"1500–2100m",neighbours:"Kisii, Bomet, Kericho"},connectivity:["B1 Road (Kisii link)","Nyamira–Keroka Road","Nyamira–Bomet Road","Nyamira town roads"],subcounties:["Borabu","West Mugirango","North Mugirango","Manga"]},
  "Nairobi":{code:47,cap:"Nairobi",pop:"4.4M",popM:4.4,area:"696",region:"Nairobi",governor:"Johnson Sakaja",known:"Kenya's capital and Africa's fourth-largest city, Nairobi is East Africa's financial, technology, and diplomatic hub—home to the UN Environment Programme and UN-Habitat global headquarters.",funfact:"Nairobi is the only capital city in the world with a national park within its boundary—you can watch lions against the backdrop of a modern skyline at Nairobi National Park, just 7km from the CBD.",landmarks:["Nairobi National Park","Karen Blixen Museum","KICC","Westgate Mall","Kibera","Two Rivers Mall"],industries:["Finance & Banking","Tech & ICT","Aviation & Tourism","Diplomacy & Int'l Orgs"],gcp:"KES 2,100B",gcpTier:"high",gcpHighlights:["Contributes ~30% of Kenya's national GDP","Headquarters of 100+ multinational corporations","Silicon Savannah: growing tech startup ecosystem"],geo:{terrain:"Highland plateau",climate:"Mild highland, bimodal rainfall",elevation:"1600–1850m",neighbours:"Kiambu, Machakos, Kajiado"},connectivity:["Jomo Kenyatta International Airport","Wilson Airport","SGR Nairobi Terminus","Nairobi Expressway","Southern Bypass","Eastern Bypass"],subcounties:["Westlands","Dagoretti North","Dagoretti South","Lang'ata","Kibra","Roysambu","Kasarani","Ruaraka","Embakasi South","Embakasi North","Embakasi Central","Embakasi East","Embakasi West","Makadara","Kamukunji","Starehe","Mathare","Pumwani"]}
};

// ── MAP SETUP ──
let selectedCounty = null;
const mapWrap = document.getElementById('map-wrap');
let width = mapWrap.offsetWidth, height = mapWrap.offsetHeight;
const svg = d3.select("#svg-map");
const g = svg.append("g");
const tip = document.getElementById('hover-tip');

const projection = d3.geoMercator().center([37.9, 0.1]).scale(height * 4.5).translate([width/2, height/2]);
const path = d3.geoPath().projection(projection);
const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", e => g.attr("transform", e.transform));
svg.call(zoom);

function getRawName(d) { return d.properties.COUNTY_NAM || d.properties.COUNTY || d.properties.name || ""; }
function toTitle(s) { return s.toLowerCase().split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '); }
function findMatch(d) {
  let raw = getRawName(d).toLowerCase().replace(/[^a-z0-9]/g,'');
  if (raw.includes("keiyo") || raw.includes("elgeyo") || raw.includes("marakwet")) raw = "elgeyomarakwet";
  for (const key in countiesData) {
    if (key.toLowerCase().replace(/[^a-z0-9]/g,'') === raw) return { name: key, ...countiesData[key] };
  }
  return null;
}

d3.json("https://cdn.jsdelivr.net/gh/mikelmaron/kenya-election-data@master/data/counties.geojson").then(geoData => {
  g.selectAll("path")
    .data(geoData.features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "county-path")
    .attr("fill", d => { const m = findMatch(d); return m ? RC[m.region] : "#cbd5e1"; })
    .on("mouseover", (e, d) => { tip.textContent = toTitle(getRawName(d)); tip.style.display = 'block'; })
    .on("mousemove", e => { tip.style.left=(e.offsetX+14)+'px'; tip.style.top=(e.offsetY-10)+'px'; })
    .on("mouseout", () => tip.style.display = 'none')
    .on("click", function(e, d) { const m = findMatch(d); if(m) showCounty(m, this); });
});

// ── DENSITY CALC ──
function calcDensity(data) {
  const areaNum = parseInt(data.area.replace(/,/g,''));
  if (!areaNum) return '—';
  const pop = Math.round(data.popM * 1000000 / areaNum);
  return pop.toLocaleString();
}

// ── SHOW COUNTY ──
function showCounty(data, el) {
  selectedCounty = data;
  d3.selectAll(".county-path").classed("selected", false);
  if (el) { d3.select(el).classed("selected", true); }

  document.getElementById('placeholder').style.display = 'none';
  const panel = document.getElementById('county-panel');
  panel.classList.remove('active');
  void panel.offsetWidth;
  panel.classList.add('active');

  // Hero band + eyebrow
  const regionColor = RC[data.region] || '#8a8680';
  document.getElementById('c-band').style.background = regionColor;
  document.getElementById('c-eyebrow-dot').style.background = regionColor;
  document.getElementById('c-eyebrow-region').textContent = data.region + ' Region';
  document.getElementById('c-name').innerHTML = data.name + ' <em>County</em>';
  document.getElementById('c-code-badge').textContent = 'County No. ' + data.code;

  // Key facts
  document.getElementById('c-hq').textContent = data.cap;
  document.getElementById('c-pop').textContent = data.pop;
  document.getElementById('c-area').textContent = data.area;
  document.getElementById('c-density').textContent = calcDensity(data);
  document.getElementById('c-governor').textContent = data.governor || '—';

  // Population share pill
  const pct = ((data.popM / KENYA_POP) * 100).toFixed(2);
  document.getElementById('c-pct-pill').textContent = pct + '% of Kenya';

  // Overview
  document.getElementById('c-about').textContent = data.known;
  document.getElementById('c-fact').textContent = data.funfact || '—';
  document.getElementById('c-landmarks').innerHTML = (data.landmarks||[]).map(l=>`<div class="item-row">${l}</div>`).join('');

  // Economy
  document.getElementById('c-gcp').textContent = data.gcp || '—';
  const tierMap = {high:{cls:'tier-high',txt:'High GCP'},mid:{cls:'tier-mid',txt:'Mid GCP'},low:{cls:'tier-low',txt:'Developing'}};
  const t = tierMap[data.gcpTier] || tierMap.low;
  const tierEl = document.getElementById('c-tier');
  tierEl.className = 'gcp-tier-tag ' + t.cls;
  tierEl.textContent = t.txt;
  document.getElementById('c-highlights').innerHTML = (data.gcpHighlights||[]).map(h=>`<div class="econ-hl">${h}</div>`).join('');
  document.getElementById('c-industries').innerHTML = (data.industries||[]).map(i=>`<div class="chip">${i}</div>`).join('');

  // Geography
  const geo = data.geo || {};
  const geoFields = [{label:'Terrain',val:geo.terrain},{label:'Climate',val:geo.climate},{label:'Elevation',val:geo.elevation},{label:'Borders',val:geo.neighbours}];
  document.getElementById('c-geo').innerHTML = geoFields.filter(f=>f.val).map(f=>`<div class="geo-cell"><div class="geo-label">${f.label}</div><div class="geo-val">${f.val}</div></div>`).join('');
  document.getElementById('c-connect').innerHTML = (data.connectivity||[]).map(c=>`<div class="item-row">${c}</div>`).join('');

  // Sub-counties
  const subs = data.subcounties || [];
  document.getElementById('c-sc-title').textContent = `Sub-Counties (${subs.length})`;
  document.getElementById('c-sc').innerHTML = subs.map(s=>`<div class="sc-chip">${s}</div>`).join('');

  // Reset tabs
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.querySelector('[data-tab="overview"]').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');

  // Update pin button
  updatePinBtn(data.name);
}

// ── TABS ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
  });
});

// ── CSV ──
document.getElementById('btn-csv').onclick = () => {
  if (!selectedCounty) return;
  const d = selectedCounty;
  const rows = [["Field","Value"],["County",d.name],["Code",d.code],["County HQ",d.cap],["Population",d.pop],["Area (km²)",d.area],["Population Density (/km²)",calcDensity(d)],["Governor",d.governor],["GCP",d.gcp],["GCP Tier",d.gcpTier],["Industries",(d.industries||[]).join("; ")],["Notable Places",(d.landmarks||[]).join("; ")],["Sub-Counties",(d.subcounties||[]).join("; ")],["About",d.known]];
  const csv = rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(",")).join("\n");
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download = `${d.name}_County.csv`;
  a.click();
};

// ── SHARE ──
document.getElementById('btn-share').onclick = () => {
  if (!selectedCounty) return;
  const d = selectedCounty;
  const text = `${d.name} County | HQ: ${d.cap} | Pop: ${d.pop} | Density: ${calcDensity(d)}/km² | GCP: ${d.gcp} — Kenya County Explorer`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-share');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Share', 2000);
  });
};

// ── LEGEND ──
const leg = document.getElementById('legend');
leg.innerHTML = '<div class="leg-title">Regions</div>' +
  Object.entries(RC).map(([r,c])=>`<div class="leg-item"><div class="leg-dot" style="background:${c}"></div>${r}</div>`).join('');

// ── COMMAND PALETTE ──
const cmdOverlay = document.getElementById('cmd-overlay');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

function openCmd() { cmdOverlay.classList.add('open'); cmdInput.focus(); renderCmd(''); }
function closeCmd() { cmdOverlay.classList.remove('open'); cmdInput.value = ''; }

document.getElementById('nav-search-trigger').onclick = openCmd;
document.getElementById('cmd-esc').onclick = closeCmd;
cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCmd();
});

function renderCmd(term) {
  const q = term.toLowerCase().replace(/[^a-z0-9 ]/g,'');
  const allCounties = Object.entries(countiesData).map(([name, d]) => ({ name, ...d }));
  const filtered = !q ? allCounties : allCounties.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.region.toLowerCase().includes(q) ||
    (c.governor||'').toLowerCase().includes(q) ||
    (c.industries||[]).some(i => i.toLowerCase().includes(q)) ||
    (c.cap||'').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    cmdResults.innerHTML = '<div class="cmd-empty">No counties match your search.</div>';
    return;
  }

  // Group by region if no search
  if (!q) {
    const grouped = {};
    filtered.forEach(c => { if (!grouped[c.region]) grouped[c.region] = []; grouped[c.region].push(c); });
    cmdResults.innerHTML = Object.entries(grouped).map(([region, counties]) =>
      `<div class="cmd-section-label">${region}</div>` +
      counties.map(c => cmdItem(c)).join('')
    ).join('');
  } else {
    cmdResults.innerHTML = `<div class="cmd-section-label">${filtered.length} result${filtered.length!==1?'s':''}</div>` +
      filtered.map(c => cmdItem(c)).join('');
  }

  cmdResults.querySelectorAll('.cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.dataset.county;
      const data = { name, ...countiesData[name] };
      let pathEl = null;
      g.selectAll("path").each(function(d) { if (findMatch(d)?.name === name) pathEl = this; });
      showCounty(data, pathEl);
      closeCmd();
    });
  });
}

function cmdItem(c) {
  return `<div class="cmd-item" data-county="${c.name}">
    <div class="cmd-dot" style="background:${RC[c.region]}"></div>
    <div class="cmd-main">${c.name}</div>
    <div class="cmd-sub">${c.region} · ${c.cap}</div>
  </div>`;
}

cmdInput.addEventListener('input', e => renderCmd(e.target.value));

// ── ABOUT DRAWER ──
const aboutOverlay = document.getElementById('about-overlay');
const aboutDrawer = document.getElementById('about-drawer');

function openAbout() { aboutOverlay.classList.add('open'); aboutDrawer.classList.add('open'); }
function closeAbout() { aboutOverlay.classList.remove('open'); aboutDrawer.classList.remove('open'); }

document.getElementById('btn-about').onclick = openAbout;
document.getElementById('drawer-close').onclick = closeAbout;
aboutOverlay.addEventListener('click', closeAbout);

// ── COMPARE SYSTEM ──
let pinnedCounties = [];

function updatePinBtn(name) {
  const btn = document.getElementById('btn-pin-county');
  const isPinned = pinnedCounties.includes(name);
  btn.classList.toggle('pinned', isPinned);
  btn.innerHTML = isPinned
    ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg> Pinned`
    : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg> Compare`;
}

document.getElementById('btn-pin-county').onclick = () => {
  if (!selectedCounty) return;
  const name = selectedCounty.name;
  if (pinnedCounties.includes(name)) {
    pinnedCounties = pinnedCounties.filter(n => n !== name);
  } else {
    if (pinnedCounties.length >= 3) { pinnedCounties.shift(); }
    pinnedCounties.push(name);
  }
  updatePinBtn(name);
  renderCompareBar();
  updatePinnedPaths();
};

function updatePinnedPaths() {
  g.selectAll("path").each(function(d) {
    const m = findMatch(d);
    d3.select(this).classed("pinned-path", m && pinnedCounties.includes(m.name) && m.name !== selectedCounty?.name);
  });
}

function renderCompareBar() {
  const bar = document.getElementById('compare-bar');
  const slots = document.getElementById('compare-slots');
  const goBtn = document.getElementById('compare-go-btn');

  if (!pinnedCounties.length) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');
  goBtn.disabled = pinnedCounties.length < 2;

  const slotHTML = pinnedCounties.map(name => {
    const d = countiesData[name];
    return `<div class="compare-slot filled">
      <span class="compare-slot-name" style="color:${RC[d.region]}">${name}</span>
      <button class="compare-slot-remove" data-name="${name}">×</button>
    </div>`;
  });
  // Empty slots
  for (let i = pinnedCounties.length; i < 3; i++) {
    slotHTML.push(`<div class="compare-slot"><span class="compare-slot-empty">+ Pin a county</span></div>`);
  }
  slots.innerHTML = slotHTML.join('');
  slots.querySelectorAll('.compare-slot-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      pinnedCounties = pinnedCounties.filter(n => n !== btn.dataset.name);
      if (selectedCounty) updatePinBtn(selectedCounty.name);
      renderCompareBar();
      updatePinnedPaths();
    });
  });
}

document.getElementById('compare-clear-btn').onclick = () => {
  pinnedCounties = [];
  if (selectedCounty) updatePinBtn(selectedCounty.name);
  renderCompareBar();
  updatePinnedPaths();
};

document.getElementById('compare-go-btn').onclick = () => {
  if (pinnedCounties.length < 2) return;
  openCompareModal();
};

// ── COMPARE MODAL ──
const compareModal = document.getElementById('compare-modal');

function openCompareModal() {
  const counties = pinnedCounties.map(name => ({ name, ...countiesData[name] }));

  // Update modal subtitle
  document.querySelector('.modal-subtitle').textContent =
    counties.map(c => c.name).join(' · ');

  let html = `<div class="cmp-cards">`;

  counties.forEach(c => {
    const color = RC[c.region] || '#8a8680';
    const pct = ((c.popM / KENYA_POP) * 100).toFixed(2);
    const tierLabels = { high: 'High GCP', mid: 'Mid GCP', low: 'Developing' };
    const tierColors = { high: '#166534', mid: '#854d0e', low: '#475569' };
    const tierBg = { high: '#dcfce7', mid: '#fef9c3', low: '#f1f5f9' };

    html += `
    <div class="cmp-card">
      <div class="cmp-card-header">
        <div class="cmp-card-band" style="background:${color}"></div>
        <div class="cmp-card-title-row">
          <div class="cmp-card-region" style="color:${color}">${c.region}</div>
          <div class="cmp-card-name">${c.name}</div>
          <div class="cmp-card-hq">HQ: ${c.cap} &nbsp;·&nbsp; No. ${c.code}</div>
        </div>
      </div>

      <div class="cmp-big-stats">
        <div class="cmp-big-cell accent">
          <div class="cmp-big-label">Population</div>
          <div class="cmp-big-val accent">${c.pop}</div>
        </div>
        <div class="cmp-big-cell">
          <div class="cmp-big-label">GCP (est.)</div>
          <div class="cmp-big-val">${c.gcp}</div>
        </div>
        <div class="cmp-big-cell">
          <div class="cmp-big-label">Area km²</div>
          <div class="cmp-big-val">${c.area}</div>
        </div>
        <div class="cmp-big-cell">
          <div class="cmp-big-label">Density /km²</div>
          <div class="cmp-big-val">${calcDensity(c)}</div>
        </div>
      </div>

      <div class="cmp-facts">
        <div class="cmp-fact-row">
          <span class="cmp-fact-label">% of Kenya pop.</span>
          <span class="cmp-fact-val">${pct}%</span>
        </div>
        <div class="cmp-fact-row">
          <span class="cmp-fact-label">GCP tier</span>
          <span class="cmp-fact-val">
            <span style="background:${tierBg[c.gcpTier]};color:${tierColors[c.gcpTier]};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">
              ${tierLabels[c.gcpTier] || '—'}
            </span>
          </span>
        </div>
        <div class="cmp-fact-row">
          <span class="cmp-fact-label">Sub-counties</span>
          <span class="cmp-fact-val">${c.subcounties?.length || '—'}</span>
        </div>
        <div class="cmp-fact-row">
          <span class="cmp-fact-label">Climate</span>
          <span class="cmp-fact-val">${c.geo?.climate || '—'}</span>
        </div>
        <div class="cmp-fact-row">
          <span class="cmp-fact-label">Elevation</span>
          <span class="cmp-fact-val">${c.geo?.elevation || '—'}</span>
        </div>
      </div>

      <div class="cmp-chip-section">
        <div class="cmp-chip-label">Key Industries</div>
        <div class="cmp-chips">
          ${(c.industries||[]).map(i => `<span class="cmp-chip">${i}</span>`).join('')}
        </div>
      </div>

      <div class="cmp-governor">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <strong>${c.governor || '—'}</strong>
      </div>
    </div>`;
  });

  html += `</div>`;
  document.getElementById('compare-modal-body').innerHTML = html;
  compareModal.classList.add('open');
}

document.getElementById('compare-modal-close').onclick = () => compareModal.classList.remove('open');
compareModal.addEventListener('click', e => { if (e.target === compareModal) compareModal.classList.remove('open'); });
