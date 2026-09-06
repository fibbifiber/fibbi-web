const img = (f) => `/products/${f}`;

// Nutrition is identical across flavours within a line — declared once per line.
const NUTRITION = {
  crunch: {
    serve: 'per 35g serve',
    rows: [
      ['energy', '148 kcal'],
      ['protein', '3.4 g'],
      ['total carbohydrate', '22 g'],
      ['of which sugars', '4.1 g'],
      ['dietary fiber', '5 g'],
      ['total fat', '4.6 g'],
      ['of which saturated', '0.9 g'],
      ['sodium', '38 mg'],
    ],
  },
  og: {
    serve: 'per 6g serve',
    rows: [
      ['energy', '14 kcal'],
      ['protein', '0.2 g'],
      ['total carbohydrate', '5.1 g'],
      ['of which sugars', '0 g'],
      ['dietary fiber', '5 g'],
      ['total fat', '0.1 g'],
      ['sodium', '6 mg'],
    ],
  },
  cups: {
    serve: 'per 155g cup',
    rows: [
      ['energy', '186 kcal'],
      ['protein', '7.2 g'],
      ['total carbohydrate', '24 g'],
      ['of which sugars', '6.8 g'],
      ['dietary fiber', '5 g'],
      ['total fat', '5.4 g'],
      ['of which saturated', '1.6 g'],
      ['sodium', '62 mg'],
    ],
  },
};

// Product lines — heading + note shared by the shop grid and every product page.
export const LINES = {
  crunch: { id: 'crunch', title: 'Fibbi Crunch — The Hero', note: 'shelf stable · ships pan-india · 5g fiber per 35g serve', nutrition: NUTRITION.crunch },
  og:     { id: 'og',     title: 'Fibbi OG — The Signature Husk', note: 'proprietary blend · 95% micro-cut psyllium + prebiotic acacia', nutrition: NUTRITION.og },
  cups:   { id: 'cups',   title: 'Fibbi Cups — The Fresh Line', note: 'refrigerated · quick commerce · 155g (120g base + 35g topper)', nutrition: NUTRITION.cups },
};

export const CATALOG = {
  'crunch-berry-200': {
    name: 'Crunch Berry · 200g', title: 'Crunch Berry — 200g', line: 'crunch',
    price: 249, mrp: 299, sw: '#F5C4D8', img: img('fibbi-crunch-berry.webp'),
    tape: 'pink', badge: 'bestseller', per: 'the daily bag',
    specs: ['200g', '6 serves', '₹41.5/serve'],
    desc: 'Toasted oat-psyllium clusters with real berry pieces — the same topper that crowns the berry dahi cup.',
    long: 'Toasted oat and psyllium clusters baked with real berry pieces, sweetened only with dates. 35g on your dahi, curd bowl or straight from the pouch puts 5g of gel-forming fiber into your day without a single spoon of isabgol slime.',
    facts: ['5g fiber per 35g serve', 'no added sugar — dates only', 'stays crunchy in dahi', 'shelf stable, no cold chain'],
  },
  'crunch-coffee-200': {
    name: 'Crunch Coffee · 200g', title: 'Crunch Coffee — 200g', line: 'crunch',
    price: 269, mrp: 319, sw: '#E3D0B5', img: img('fibbi-crunch-coffee.webp'),
    per: 'the 8am crunch',
    specs: ['200g', '6 serves', 'caffeine'],
    desc: 'Slow-brew coffee clusters, dates doing the sweetening — the same topper as the cold coffee cup.',
    long: 'Slow-brew coffee folded into oat-psyllium clusters, with dates doing all the sweetening. Caffeine and 5g of fiber in the same handful, so the 8am ritual finally does two jobs at once.',
    facts: ['5g fiber per 35g serve', 'real slow-brew coffee', 'no added sugar — dates only', 'pairs with dahi, milk or oats'],
  },
  'crunch-cocoa-200': {
    name: 'Crunch Cocoa · 200g', title: 'Crunch Cocoa — 200g', line: 'crunch',
    price: 269, mrp: 319, sw: '#CDBBAC', img: img('fibbi-crunch-cocoa.webp'),
    tape: 'lav', per: "the treat that isn't",
    specs: ['200g', '6 serves', 'vegan'],
    desc: 'Clusters dusted in 100% dark cocoa — the same topper as the cocoa oat cup.',
    long: 'Oat-psyllium clusters dusted in 100% dark cocoa — no milk solids, no added sugar, fully plant-based. It eats like a dessert topping and behaves like a fiber supplement.',
    facts: ['5g fiber per 35g serve', '100% dark cocoa', 'vegan · dairy-free', 'no added sugar — dates only'],
  },
  'crunch-vanilla-200': {
    name: 'Crunch Vanilla · 200g', title: 'Crunch Vanilla — 200g', line: 'crunch',
    price: 269, mrp: 319, sw: '#EDE3C8', img: img('fibbi-crunch-vanilla.webp'),
    badge: 'new', badgeTone: 'var(--lav)', per: 'the mellow one',
    specs: ['200g', '6 serves', 'no added sugar'],
    desc: 'Madagascar vanilla clusters, gently sweetened with dates — the same topper as the vanilla dahi cup.',
    long: 'Madagascar vanilla baked into oat-psyllium clusters and gently sweetened with dates. The least loud flavour in the range — made for people who want fiber, not a dessert.',
    facts: ['5g fiber per 35g serve', 'real Madagascar vanilla', 'no added sugar — dates only', 'kid-friendly flavour'],
  },
  'og-jar-200': {
    name: 'OG Jar · 200g', title: 'OG Jar — 200g', line: 'og',
    price: 399, mrp: 449, sw: '#EAD9B4', img: img('fibbi-og-jar.webp'),
    tape: 'gold', per: 'the daily driver',
    specs: ['200g', '33 serves', '₹12.1/serve'],
    desc: '33 serves. Unflavoured or mint-lime. Stirs clean into water, milk, dahi.',
    long: '200g of micro-cut 99% pure psyllium husk blended with prebiotic acacia — 33 serves at ₹12 each. It stirs clean into water, milk or dahi instead of turning into the grainy sludge you remember.',
    facts: ['99% pure psyllium husk', '+ prebiotic acacia fiber', '33 serves per jar', 'unflavoured or mint-lime'],
  },
  'og-sticks-30': {
    name: 'OG Sticks · 30×6g', title: 'OG Sticks — 30 × 6g', line: 'og',
    price: 549, mrp: 599, sw: '#F3E7CE', img: img('fibbi-og-stick.webp'),
    tape: 'lav', per: 'convenience premium',
    specs: ['180g', '30 serves', '₹18.3/serve'],
    desc: 'Single-serve sachets for desks, gym bags, travel. Tear, stir, done.',
    long: 'The same og blend, portioned into 30 single-serve sachets for desk drawers, gym bags and travel. Tear, stir into whatever you are already drinking, done — no scoop, no jar, no measuring.',
    facts: ['30 × 6g sachets', '99% pure psyllium husk', '+ prebiotic acacia fiber', 'travel and desk friendly'],
  },
  'cup-berry': {
    name: 'Berry Dahi Cup', title: 'Berry Dahi Cup', line: 'cups',
    price: 99, mrp: 119, sw: '#F5C4D8', img: img('fibbi-cup-berry.webp'),
    tape: 'pink', per: 'the ritual cup',
    specs: ['155g', '5g fiber', 'live cultures'],
    desc: 'Thick unsweetened dahi, real berry pulp, twist-top crunch topper.',
    long: 'Thick unsweetened dahi with real berry pulp and a twist-top crunch topper you tip in yourself, so the clusters are still crunchy at the last bite. 155g, 5g fiber, live cultures — a full ritual in one cup.',
    facts: ['120g dahi base + 35g topper', '5g fiber per cup', 'live cultures', 'keep refrigerated'],
  },
  'cup-coffee': {
    name: 'Cold Coffee Cup', title: 'Cold Coffee Cup', line: 'cups',
    price: 99, mrp: 119, sw: '#E3D0B5', img: img('fibbi-cup-coffee.webp'),
    per: 'the 8am merger',
    specs: ['155g', '5g fiber', '60mg caffeine'],
    desc: 'Slow-brew coffee dahi, dates doing the sweetening. Caffeine + fiber, one cup.',
    long: 'Slow-brew coffee stirred through thick dahi, sweetened with dates, topped with coffee clusters. 60mg of caffeine and 5g of fiber in the same 155g cup — your morning coffee and your fiber, merged.',
    facts: ['120g dahi base + 35g topper', '5g fiber per cup', '60mg caffeine', 'keep refrigerated'],
  },
  'cup-cocoa': {
    name: 'Cocoa Oat Cup', title: 'Cocoa Oat Cup', titleNote: 'dairy-free', line: 'cups',
    price: 109, mrp: 129, sw: '#CDBBAC', img: img('fibbi-cup-cocoa.webp'),
    tape: 'lav', per: 'plant-based line',
    specs: ['155g', '5g fiber', 'vegan'],
    desc: 'Dark cocoa oat base, cocoa-dusted topper. The plant-based one.',
    long: 'A dark cocoa oat base under a cocoa-dusted crunch topper — the plant-based cup in the range, with no dairy anywhere in it. 155g, 5g fiber, and it still reads as dessert.',
    facts: ['120g oat base + 35g topper', '5g fiber per cup', 'vegan · dairy-free', 'keep refrigerated'],
  },
  'cup-vanilla': {
    name: 'Vanilla Dahi Cup', title: 'Vanilla Dahi Cup', line: 'cups',
    price: 99, mrp: 119, sw: '#EDE3C8', img: img('fibbi-cup-vanilla.webp'),
    per: 'the mellow cup',
    specs: ['155g', '5g fiber', 'live cultures'],
    desc: 'Thick unsweetened dahi, Madagascar vanilla, twist-top crunch topper.',
    long: 'Thick unsweetened dahi with Madagascar vanilla and a twist-top vanilla crunch topper. The quietest cup in the range — 155g, 5g fiber, live cultures, nothing shouting at you.',
    facts: ['120g dahi base + 35g topper', '5g fiber per cup', 'live cultures', 'keep refrigerated'],
  },
};

export const skusInLine = (line) => Object.keys(CATALOG).filter((id) => CATALOG[id].line === line);

export const FREE_SHIP = 499;

export const REVIEWS = [
  { stars: 5, tape: '',     text: 'badiya h dahi me daal ke roz kha rahi hu, crunch sach me last bite tak rehta hai', who: 'aditi · 24 · pune' },
  { stars: 4, tape: 'pink', text: "thought it'll taste like isabgol… it doesn't?? tastes like proper granola. thoda pricey but chalega", who: 'rehan · 27 · mumbai' },
  { stars: 5, tape: 'lav',  text: 'day 5 update: bloating genuinely kam hua. also the packaging is so cute yaar, kept the pouch', who: 'priyanka · 25 · indore' },
  { stars: 5, tape: 'gold', text: 'mummy ne pucha kahan se liya unhone bhi try kiya, ab do packet mangwane padenge', who: 'arjun · 23 · bengaluru' },
  { stars: 4, tape: '',     text: 'delivery took 5 days to noida but product is solid. cocoa wala > original imo', who: 'sneha · 26 · delhi ncr' },
  { stars: 3, tape: 'pink', text: 'achha hai, kaam karta hai. bas 200g jaldi khatam ho jata hai — bade pack lao pls', who: 'kabir · 28 · pune' },
  { stars: 5, tape: 'lav',  text: "can't do slimy isabgol water, never could. this is literally the fix. second order placed", who: 'ishita · 24 · ahmedabad' },
  { stars: 5, tape: 'gold', text: 'COD tha isliye risk le liya. no regrets — office snack drawer me permanent jagah mil gayi', who: 'rohit · 29 · hyderabad' },
];
