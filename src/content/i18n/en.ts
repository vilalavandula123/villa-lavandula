/**
 * English texts. Same structure as bg.ts — TypeScript reports any missing key.
 */
import type { Dictionary } from "./bg";

const en: Dictionary = {
  meta: {
    siteName: "Villa Lavandula",
    defaultDescription:
      "Villa Lavandula — a detached house with a large green garden in Malko Tranovo, Stara Zagora Province, Bulgaria. The whole house is yours. Ask about dates.",
  },
  a11y: {
    skip: "Skip to main content",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
    langSwitch: "Change language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeLink: "Villa Lavandula — home",
    opensExternal: "(opens in a new tab)",
    quickActions: "Quick actions",
  },
  nav: {
    house: "The house",
    gallery: "Gallery",
    area: "The area",
    contact: "Contact",
    enquiry: "Dates & terms",
    privacy: "Privacy & cookies",
    home: "Home",
  },
  cta: {
    enquire: "Ask about dates",
    call: "Call",
    seeHouse: "Explore the house",
    allPhotos: "All photos",
    email: "Email",
    booking: "Booking.com listing",
    facebook: "Facebook page",
    map: "Open in Google Maps",
  },
  langNames: { bg: "Български", en: "English" },

  home: {
    title: "Villa Lavandula — a house in nature in Malko Tranovo, Bulgaria",
    heroTitleLine1: "Quiet, greenery",
    heroTitleLine2: "and time for yourselves.",
    heroPlace: "A detached house for up to 8 guests · 3 bedrooms · Malko Tranovo village, Stara Zagora Province",
    replyTime: "We reply within 12 hours with available dates, the price and terms.",
    heroText:
      "A large green garden, a covered veranda, a barbecue and room for long conversations with family and friends.",
    factsLabel: "The house at a glance",
    facts: {
      wholeHouse: "The whole house",
      wholeHouseSub: "just for your group",
      adults: (n: number) => `Up to ${n} adults`,
      adultsSub: "guests",
      bedrooms: (n: number) => `${n} bedrooms`,
      bedroomsSub: "with double beds",
      area: (n: number) => `${n} m²`,
      areaSub: "living space",
    },
    introTitle: "A place for quiet days",
    introText: [
      "Villa Lavandula is a detached house in Malko Tranovo, surrounded by trees and a large landscaped garden. During your stay the whole house is yours.",
      "There is a living and dining room with a fireplace, a fitted kitchen, three bedrooms, a bathroom with toilet, a covered veranda and a barbecue in the garden — enough space to be together and for everyone to find a quiet corner.",
    ],
    introNote: "The whole house for your stay",
    previewTitle: "Explore the house",
    previewText: "Real photos of the house, the rooms and the garden.",
    houseTitle: "What to expect",
    houseCards: [
      { title: "Bedrooms & bathroom", text: "Three bedrooms with double beds plus a sofa bed — room for up to eight adults. One bathroom with toilet." },
      { title: "Living room & kitchen", text: "A living room with a fireplace and a dining table for the whole group, and a kitchen with oven and hob." },
      { title: "Garden & veranda", text: "A large green garden with shady seating, a covered veranda, a barbecue and an outdoor fireplace." },
    ],
    houseLink: "More about the house and amenities",
    areaTitle: "The area",
    areaText:
      "Malko Tranovo is a quiet village in Stara Zagora Province. Midalidare in Mogilovo and the city of Stara Zagora with its museums are nearby.",
    areaLink: "What's nearby",
    ratingTitle: "Guest rating",
    ratingText: (n: number, date: string) => `On Booking.com, based on ${n} reviews (as of ${date}).`,
    ratingLink: "Reviews on Booking.com",
    enquiryTitle: "Availability and prices",
    enquiryText:
      "Send us an enquiry with your dates and number of guests. Sending an enquiry is not a confirmed booking.",
    faqTitle: "Frequently asked questions",
    contactTitle: "Get in touch",
    contactText: "Call or write to us — we will be happy to answer your questions.",
  },

  faq: [
    {
      q: "Do we rent the whole house?",
      a: "Yes. Villa Lavandula is let to one group at a time — you do not share the house or the garden with other guests.",
    },
    {
      q: "How do I find out if my dates are available?",
      a: "Send an enquiry through the form or give us a call. We reply within 12 hours with available dates, the price and terms.",
    },
    {
      q: "Is my booking confirmed once I send an enquiry?",
      a: "No. An enquiry is not a booking. A booking is confirmed only after we have agreed the dates, price and terms with you personally.",
    },
    {
      q: "How many bathrooms are there?",
      a: "The house has one bathroom with toilet.",
    },
    {
      q: "Can we bring a pet?",
      a: "Pets are welcome at no extra charge. Please mention them in your enquiry.",
    },
    {
      q: "Where exactly is the house?",
      a: "In the village of Malko Tranovo, Stara Zagora Province (postcode 6228). Please do not confuse it with the town of Malko Tarnovo in Strandzha — they are different places. We send exact arrival directions once your stay is confirmed.",
    },
    {
      q: "Can I also book through Booking.com?",
      a: "Yes, the house has a Booking.com listing. A direct enquiry puts you in touch with the hosts without an intermediary.",
    },
  ],

  housePage: {
    title: "The house",
    metaDescription:
      "A detached house with three bedrooms, a bathroom with toilet, a living room with fireplace, a fitted kitchen, a veranda and a large garden in Malko Tranovo, Bulgaria.",
    lead: "The whole house is yours — three bedrooms, a bathroom with toilet, a shared living room with fireplace, a kitchen, a veranda and a large landscaped garden.",
    spacesTitle: "The spaces",
    spaces: [
      {
        title: "Bedrooms",
        text: "Three bedrooms and a sofa bed. Bed linen and towels are provided.",
        photo: "bedroom-double-window",
      },
      {
        title: "Living & dining room",
        text: "A bright living room with a fireplace, a corner seating area and a dining table by the large windows, with room for the whole group.",
        photo: "dining-table-window",
      },
      {
        title: "Kitchen",
        text: "A fitted kitchen with oven and hob, open to the dining area — from morning coffee to a shared dinner.",
        photo: "dining-fireplace-kitchen",
      },
      {
        title: "Garden & veranda",
        text: "A large green garden with benches and shady corners, a covered veranda, a barbecue and an outdoor fireplace.",
        photo: "outdoor-dining-evening",
      },
    ],
    bedsTitle: "Sleeping arrangements",
    bathTitle: "Bathroom",
    bathText: "One bathroom with toilet.",
    amenitiesTitle: "Amenities",
    amenityGroups: [
      {
        title: "Kitchen & dining",
        items: [
          "Oven and hob",
          "Fridge",
          "Coffee machine",
          "Toaster",
          "Electric kettle",
          "Crockery and kitchenware",
          "Dining table",
          "High chair",
        ],
      },
      {
        title: "Comfort",
        items: [
          "Air conditioning",
          "Heating",
          "Fireplace in the living room",
          "Flat-screen TV with cable channels",
          "One bathroom with toilet",
          "Bed linen and towels",
          "Clothes storage",
          "Washing machine",
        ],
      },
      {
        title: "Garden & outdoors",
        items: [
          "Garden and courtyard",
          "Covered veranda",
          "Balcony and terrace",
          "Garden furniture",
          "Picnic area and outdoor dining",
          "Barbecue",
          "Outdoor fireplace",
          "Sun loungers",
        ],
      },
      {
        title: "Games",
        items: ["Board games", "Darts", "Badminton equipment"],
      },
      {
        title: "Practical",
        items: [
          "Free Wi-Fi throughout the house",
          "Free public parking nearby, no reservation needed",
          "Private entrance",
          "Pets allowed at no extra charge",
          "Non-smoking rooms and a designated smoking area",
          "Baby cot on request",
        ],
      },
      {
        title: "Languages spoken",
        items: ["Bulgarian", "English", "French", "Russian"],
      },
    ],
    amenitiesNote: "If something matters for your stay, mention it in your enquiry and we will give you a specific answer.",
  },

  galleryPage: {
    title: "Gallery",
    metaDescription: "Photos of Villa Lavandula — the house, bedrooms, living room and kitchen, garden and veranda.",
    lead: "A walk through the house in real photos — from the front and the living room, through the kitchen and bedrooms, to the veranda and garden.",
    filterLabel: "Show photos",
    all: "All",
    categories: {
      house: "The house",
      bedrooms: "Bedrooms",
      living: "Living & kitchen",
      garden: "Garden & veranda",
      atmosphere: "Atmosphere",
    },
    count: (n: number) => `${n} ${n === 1 ? "photo" : "photos"}`,
    open: (caption: string) => `Open photo: ${caption}`,
    dialogLabel: "Photo viewer",
    close: "Close",
    prev: "Previous photo",
    next: "Next photo",
    counter: (i: number, n: number) => `Photo ${i} of ${n}`,
  },

  areaPage: {
    title: "The area",
    metaDescription:
      "Malko Tranovo, Stara Zagora Province — what's nearby: Midalidare in Mogilovo, Stara Zagora, walking and cycling.",
    lead: "Malko Tranovo is a quiet village in Stara Zagora Province, among fields and low hills.",
    notConfuse:
      "Please do not confuse Malko Tranovo (Stara Zagora Province, postcode 6228) with the town of Malko Tarnovo in Strandzha.",
    nearbyTitle: "Nearby",
    nearbyNote: "Distances are approximate, based on Booking.com data.",
    nearby: [
      { name: "Midalidare, Mogilovo village", text: "A winery and the venue of the Midalidare Rock festival.", distance: "about 10 km" },
      { name: "Svoboda railway station", text: "The nearest railway station.", distance: "about 4 km" },
      { name: "Stara Zagora", text: "Regional History Museum and Art Gallery.", distance: "about 25 km" },
    ],
    arrivalTitle: "Arriving by plane",
    arrivalLead: "The nearest airports are in Plovdiv and Sofia. Approximate driving distances:",
    airports: {
      plovdiv: "Plovdiv Airport",
      sofia: "Sofia Airport",
    },
    km: (n: number) => `about ${n} km`,
    drive: (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      if (h === 0) return `about ${m} min by car`;
      return `about ${h} h${m ? ` ${m} min` : ""} by car`;
    },
    arrivalNote: (date: string) =>
      `Distances and times follow the recommended driving route in Google Maps from the centre of Malko Tranovo village (checked on ${date}). Times are without traffic and depend on the route and traffic.`,
    wikiLink: "More about Malko Tranovo village on Wikipedia",
    wikiNote: "An encyclopaedia article on Bulgarian Wikipedia (in Bulgarian) — not an official village website.",
    outdoorsTitle: "Outdoors",
    outdoorsText:
      "The countryside around the village is good for walking and cycling. In the garden there is room for games, rest in the shade and evenings by the fire.",
    mapTitle: "Finding us",
    mapText: "Open the village in Google Maps. We send exact directions to the house once your stay is confirmed.",
  },

  enquiryPage: {
    title: "Dates & terms",
    metaDescription:
      "Ask about available dates at Villa Lavandula. We reply personally about availability, price and terms.",
    lead: "Send us your preferred dates and number of guests — we will reply personally.",
    howTitle: "How it works",
    how: [
      { title: "You send an enquiry", text: "With dates, number of guests and how to reach you." },
      { title: "We reply within 12 hours", text: "With available dates, the price and terms." },
      { title: "We agree your stay", text: "The booking is confirmed only once we have agreed all the details." },
    ],
    pricesTitle: "Prices",
    pricesText: "The price depends on the dates, length of stay and number of guests. We send it in reply to your enquiry.",
    rulesTitle: "House rules",
    rulesNote: "Final terms are confirmed in our reply to your enquiry.",
    rules: {
      checkIn: (v: string) => `Check-in: ${v}, at a time agreed in advance`,
      checkOut: (v: string) => `Check-out: ${v}`,
      children: "Children are welcome; baby cot (ages 0–3) on request",
      pets: "Pets are welcome at no extra charge. Please mention them in your enquiry.",
      smoking: "Smoking is not allowed inside the house; there is a designated smoking area",
    },
    bookingAlt: "Prefer an intermediary? The house is also listed on Booking.com.",
  },

  form: {
    title: "Ask about dates",
    replyTime: "We reply within 12 hours with available dates, the price and terms.",
    disclaimer: "Sending an enquiry is not a confirmed booking.",
    required: "required",
    optional: "optional",
    arrival: "Arrival date",
    departure: "Departure date",
    adults: "Number of adults",
    children: "Number of children",
    childrenAges: "Children's ages",
    childrenAgesHint: "For example: 4 and 9 years",
    pets: "Will you bring a pet?",
    petsYes: "Yes",
    petsNo: "No",
    name: "Name",
    email: "Email",
    phone: "Phone",
    phoneHint: "If you would prefer us to call you",
    message: "Message",
    messageHint: "Occasion, questions or special needs",
    privacy: "We use the data from this form only to reply to your enquiry.",
    privacyLink: "How we handle personal data",
    honeypot: "Do not fill in this field",
    submit: "Send enquiry",
    submitting: "Sending…",
    errorSummary: "Please correct the following fields:",
    success: {
      title: "Enquiry received",
      text: "Thank you! We have received your enquiry and will reply within 12 hours with available dates, the price and terms. Your enquiry is not yet a confirmed booking.",
      another: "New enquiry",
    },
    notConfigured: {
      notice:
        "Online sending of enquiries is not active yet. Please contact us by phone or email — details are below.",
      result:
        "Your enquiry was not sent because online sending is not active yet. Please call or email us.",
    },
    failure: {
      generic:
        "Your enquiry could not be sent because of a technical error. Please try again or contact us by phone or email.",
      rateLimited: "Too many enquiries in a short time. Please try again in a few minutes or give us a call.",
      retry: "Try again",
    },
    fallback: "You can also contact us directly:",
    errors: {
      arrivalRequired: "Choose an arrival date.",
      arrivalPast: "The arrival date cannot be in the past.",
      departureRequired: "Choose a departure date.",
      departureOrder: "The departure date must be after the arrival date.",
      rangeTooFar: "Please choose dates within the next two years.",
      adults: "Enter at least 1 adult.",
      adultsMax: (n: number) => `The house sleeps up to ${n} adults. For a larger group, please contact us.`,
      children: "Enter the number of children (0 or more).",
      name: "Enter your name.",
      email: "Enter a valid email address.",
      phone: "Enter a valid phone number or leave the field empty.",
      tooLong: "The text is too long.",
      spam: "The enquiry cannot be sent. Please contact us by phone.",
    },
  },

  contactPage: {
    title: "Contact",
    metaDescription: "Phone, email and location of Villa Lavandula in Malko Tranovo, Stara Zagora Province, Bulgaria.",
    lead: "Call us, write to us or send an enquiry about dates.",
    phone: "Phone",
    email: "Email",
    address: "Location",
    languages: "We speak",
    online: "Online",
    enquiryBox: "Want to check available dates?",
  },

  privacyPage: {
    title: "Privacy & cookies",
    metaDescription: "How Villa Lavandula handles enquiry data and which cookies the website uses.",
    updated: (d: string) => `Last updated: ${d}`,
    sections: (p: { controller: string; email: string; phone: string; months: number }) => [
      {
        title: "Who processes your data",
        body: [
          `The data controller is ${p.controller}, Malko Tranovo 6228, Stara Zagora Province, Bulgaria. For questions about your data: ${p.email}, ${p.phone}.`,
        ],
      },
      {
        title: "What we collect",
        body: [
          "Through the enquiry form: name, email, phone (optional), preferred dates, number of guests, children's ages (optional, only where relevant to the terms), whether you bring a pet, and your message.",
          "We do not ask for identity documents and do not take payments through the website.",
        ],
      },
      {
        title: "Why we use it",
        body: [
          "Only to reply to your enquiry and, if you wish, to arrange a stay. The legal basis is taking steps at your request prior to entering into a contract (Art. 6(1)(b) GDPR).",
          "We do not use your data for advertising and do not sell it.",
        ],
      },
      {
        title: "Who receives it",
        body: [
          "Your enquiry is sent as an email to the hosts through Resend (Resend, Inc., USA), acting as a processor. The website is served by Cloudflare (Cloudflare, Inc.), which processes technical data (such as IP addresses) for security and abuse protection. Where data is transferred outside the EU, these providers apply the EU Standard Contractual Clauses.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          `Enquiries that do not lead to a stay are deleted within ${p.months} months of the last contact. If a stay takes place, data is kept as long as the law requires (for example for accounting and guest registration).`,
        ],
      },
      {
        title: "Your rights",
        body: [
          "You have the right of access, rectification, erasure, restriction and objection, and the right to data portability where applicable. Write to us at the email above.",
          "You may lodge a complaint with the Bulgarian Commission for Personal Data Protection (www.cpdp.bg).",
        ],
      },
      {
        title: "Cookies",
        body: [
          "This website uses no advertising or analytics cookies and does not track your visit. That is why there is no consent banner.",
          "External links (Booking.com, Facebook, Google Maps) lead to services with their own privacy policies, which apply when you open them.",
        ],
      },
    ],
  },

  notFound: {
    title: "Page not found",
    text: "The address may be wrong or the page may have moved.",
    back: "Back to home",
  },

  footer: {
    tagline: "A detached house with a large green garden in Malko Tranovo, Stara Zagora Province.",
    contactTitle: "Contact",
    pagesTitle: "Pages",
    followTitle: "Elsewhere",
    rights: "Villa Lavandula",
  },
};

export default en;
