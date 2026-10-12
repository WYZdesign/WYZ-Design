export const CATEGORY_META: Record<string, { label: string; desc: string }> = {
  Events: { label: "Events", desc: "Live shows, mixers, workshops, and community gatherings." },
  Outdoors: { label: "Outdoors", desc: "Natural light, urban landscapes, and open air portraits." },
  Studio: { label: "Studio", desc: "Controlled lighting, headshots, and creative studio work." },
  Boudoir: { label: "Boudoir", desc: "Intimate, editorial, and personal portrait sessions." },
  Bodypaint: { label: "Bodypaint", desc: "Body as canvas. Art, paint, texture, and expression." },
  Urbex: { label: "Urbex", desc: "Abandoned spaces, urban decay, and industrial textures." },
  Products: { label: "Products", desc: "Commercial product photography, mockups, and branding shots." },
  Conceptual: { label: "Conceptual", desc: "Idea driven work. Abstract, surreal, and experimental imagery." },
  Portraits: { label: "Portraits", desc: "Expressive portrait sessions capturing personality and emotion." },
  Concerts: { label: "Concerts", desc: "Live music performances, venue shoots, and artist coverage." },
  Street: { label: "Street", desc: "Urban storytelling through candid street photography." },
  Editorial: { label: "Editorial", desc: "Magazine-style shoots, fashion editorials, and styled storytelling." },
  Commercial: { label: "Commercial", desc: "Brand campaigns, product launches, and commercial advertising work." },
};

// ── Local album definitions per category ──
// Each category has named albums, each album has image paths
export const CATEGORY_ALBUMS: Record<string, Array<{ name: string; images: string[] }>> = {
 Events: [
 { name: "Live Events", images: [
 "/images/events/event_0002.jpg", "/images/events/event_0003.jpg", "/images/events/event_0004.jpg",
 "/images/events/event_0005.jpg", "/images/events/event_0006.png", "/images/events/event_0007.jpg",
 "/images/events/event_1.jpg", "/images/events/event_2.jpg", "/images/events/event_3.jpg",
 "/images/events/event_4.JPG", "/images/events/event_5.jpg",
 ]},
 { name: "Event Coverage", images: [
 "/images/events/event_page_1.jpg", "/images/events/event_page_2.jpg", "/images/events/event_page_3.jpg",
 "/images/events/event_page_4.jpg", "/images/events/event_page_5.jpg", "/images/events/event_page_6.jpg",
 "/images/events/event_page_7.jpg", "/images/events/event_page_8.jpg", "/images/events/event_page_9.jpg",
 "/images/events/event_page_10.jpg", "/images/events/event_page_11.jpg", "/images/events/event_page_12.jpg",
 "/images/events/event_page_13.jpg", "/images/events/event_page_14.jpg", "/images/events/event_page_15.jpg",
 "/images/events/event_page_16.jpg", "/images/events/event_page_17.jpg", "/images/events/event_page_18.jpg",
 ]},
 { name: "Full Gallery", images: [
 "/images/events_full/AMFM_Event__Slump__6.jpg", "/images/events_full/AMFM_Event__Slump__7.jpg",
 "/images/events_full/AMFM_Event__Slump__8.jpg", "/images/events_full/BoW_3_10.jpg",
 "/images/events_full/BoW_3_9.jpg",
 ]},
 ],
 Outdoors: [
 { name: "Urban Sessions", images: [
 "/images/photography/carousel_1/wix_0216.jpg", "/images/photography/carousel_1/wix_0166.jpg",
 "/images/photography/carousel_1/wix_0168.jpg", "/images/photography/carousel_1/wix_0169.jpg",
 "/images/photography/carousel_1/wix_0174.jpg", "/images/photography/carousel_1/wix_0176.jpg",
 "/images/photography/carousel_1/wix_0181.jpg", "/images/photography/carousel_1/wix_0184.jpg",
 "/images/photography/carousel_1/wix_0188.jpg", "/images/photography/carousel_1/wix_0192.jpg",
 "/images/photography/carousel_1/wix_0195.jpg", "/images/photography/carousel_1/wix_0198.jpg",
 ]},
 { name: "Open Air", images: [
 "/images/photography/carousel_1/wix_0199.jpg", "/images/photography/carousel_1/wix_0200.jpg",
 "/images/photography/carousel_1/wix_0201.jpg", "/images/photography/carousel_1/wix_0203.jpg",
 "/images/photography/carousel_1/wix_0207.jpg", "/images/photography/carousel_1/wix_0210.jpg",
 "/images/photography/carousel_1/wix_0212.jpg", "/images/photography/carousel_1/wix_0213.jpg",
 "/images/photography/carousel_1/wix_0429.jpg", "/images/photography/carousel_1/wix_0431.jpg",
 "/images/photography/carousel_1/wix_0432.jpg", "/images/photography/carousel_1/wix_0434.jpg",
 ]},
 ],
 Studio: [
 { name: "Studio Portraits", images: [
 "/images/photography/carousel_2/wix_0281.jpg", "/images/photography/carousel_2/wix_0219.jpg",
 "/images/photography/carousel_2/wix_0222.jpg", "/images/photography/carousel_2/wix_0224.jpg",
 "/images/photography/carousel_2/wix_0225.jpg", "/images/photography/carousel_2/wix_0227.jpg",
 "/images/photography/carousel_2/wix_0231.jpg", "/images/photography/carousel_2/wix_0234.jpg",
 "/images/photography/carousel_2/wix_0235.jpg", "/images/photography/carousel_2/wix_0240.jpg",
 "/images/photography/carousel_2/wix_0242.jpg", "/images/photography/carousel_2/wix_0243.jpg",
 ]},
 { name: "Creative Work", images: [
 "/images/photography/carousel_2/wix_0245.jpg", "/images/photography/carousel_2/wix_0257.jpg",
 "/images/photography/carousel_2/wix_0259.jpg", "/images/photography/carousel_2/wix_0261.jpg",
 "/images/photography/carousel_2/wix_0264.jpg", "/images/photography/carousel_2/wix_0266.jpg",
 "/images/photography/carousel_2/wix_0273.jpg", "/images/photography/carousel_2/wix_0278.jpg",
 "/images/photography/carousel_2/wix_0447.jpg", "/images/photography/carousel_2/wix_0448.jpg",
 "/images/photography/carousel_2/wix_0331.jpg", "/images/photography/carousel_2/wix_0333.jpg",
 ]},
 ],
 Boudoir: [
 { name: "Intimate Sessions", images: [
 "/images/photography/carousel_3/wix_0329.jpg", "/images/photography/carousel_3/wix_0283.jpg",
 "/images/photography/carousel_3/wix_0285.jpg", "/images/photography/carousel_3/wix_0287.jpg",
 "/images/photography/carousel_3/wix_0289.jpg", "/images/photography/carousel_3/wix_0291.jpg",
 "/images/photography/carousel_3/wix_0294.jpg", "/images/photography/carousel_3/wix_0296.jpg",
 "/images/photography/carousel_3/wix_0298.jpg", "/images/photography/carousel_3/wix_0299.jpg",
 ]},
 { name: "Editorial", images: [
 "/images/photography/carousel_3/wix_0303.jpg", "/images/photography/carousel_3/wix_0305.jpg",
 "/images/photography/carousel_3/wix_0308.jpg", "/images/photography/carousel_3/wix_0309.jpg",
 "/images/photography/carousel_3/wix_0311.jpg", "/images/photography/carousel_3/wix_0319.jpg",
 "/images/photography/carousel_3/wix_0321.jpg", "/images/photography/carousel_3/wix_0324.jpg",
 "/images/photography/carousel_3/wix_0326.jpg", "/images/photography/carousel_3/wix_0328.jpg",
 ]},
 ],
 Bodypaint: [
 { name: "Action Sack Vol. 4", images: [
 "/images/events_full/Action_Sack_vol__4__bodypaint__0.jpg",
 "/images/events_full/Action_Sack_vol__4__bodypaint__1.jpg",
 "/images/events_full/Action_Sack_vol__4__bodypaint__2.jpg",
 ]},
 { name: "Action Sack Vol. 5", images: [
 "/images/events_full/Action_Sack_vol__5__bodypaint__3.jpg",
 "/images/events_full/Action_Sack_vol__5__bodypaint__4.jpg",
 "/images/events_full/Action_Sack_vol__5__bodypaint__5.jpg",
 ]},
 { name: "Farren Bodypaint", images: [
 "/images/models/FARREN/Bodypaint-37.jpg",
 "/images/models/FARREN/Bodypaint-133.jpg",
 "/images/models/FARREN/Bodypaint-135.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-37.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-133.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-135.jpg",
 ]},
 { name: "Arcana Bodypaint", images: [
 "/images/models/ARCANA/Bodypaint-262.JPG",
 "/images/models/ARCANA/Bodypaint-263.JPG",
 "/images/models/ARCANA/Bodypaint-266.JPG",
 ]},
 { name: "Citlali Bodypaint", images: [
 "/images/models/CITLALI/Bodypaint-73.JPG",
 "/images/models/CITLALI/Bodypaint-89.JPG",
 "/images/models/CITLALI/Bodypaint-126.JPG",
 ]},
 { name: "Jordan Bodypaint", images: [
 "/images/models/JORDAN/Bodypaint-42.JPG",
 "/images/models/JORDAN/Bodypaint-89.JPG",
 "/images/models/JORDAN/Bodypaint-119.JPG",
 ]},
 ],
 Urbex: (() => {
 const all = Array.from({ length: 85 }, (_, i) => `/images/photography/urbex/urbex_${String(i).padStart(3, "0")}.jpg`);
 return [
 { name: "Abandoned Spaces", images: all.slice(0, 20) },
 { name: "Urban Decay", images: all.slice(20, 45) },
 { name: "Industrial Textures", images: all.slice(45, 70) },
 { name: "Final explorations", images: all.slice(70) },
 ];
 })(),
 Products: [
 { name: "Product Shots", images: [
 "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
 "/images/photography/carousel_2/wix_0341.jpg", "/images/photography/carousel_2/wix_0348.jpg",
 "/images/photography/carousel_2/wix_0350.jpg",
 "/images/photography/carousel_1/wix_0438.jpg", "/images/photography/carousel_1/wix_0440.jpg",
 "/images/photography/carousel_1/wix_0444.jpg", "/images/photography/carousel_1/wix_0445.jpg",
 "/images/photography/carousel_1/wix_0446.jpg",
 ]},
 ],
 Conceptual: [
 { name: "Conceptual Work", images: [
 "/images/photography/carousel_3/wix_0329.jpg", "/images/photography/carousel_1/wix_0429.jpg",
 "/images/photography/carousel_1/wix_0431.jpg", "/images/photography/carousel_1/wix_0432.jpg",
 "/images/photography/carousel_2/wix_0447.jpg", "/images/photography/carousel_2/wix_0448.jpg",
 "/images/photography/carousel_3/wix_0352.jpg", "/images/photography/carousel_3/wix_0353.jpg",
 "/images/photography/carousel_3/wix_0355.jpg", "/images/photography/carousel_3/wix_0356.jpg",
 ]}],
 Portraits: [
 { name: "Studio Portraits", images: [
 "/images/photography/carousel_2/wix_0281.jpg", "/images/photography/carousel_2/wix_0219.jpg",
 "/images/photography/carousel_2/wix_0222.jpg", "/images/photography/carousel_2/wix_0224.jpg",
 "/images/photography/carousel_2/wix_0225.jpg", "/images/photography/carousel_2/wix_0227.jpg",
 "/images/photography/carousel_2/wix_0231.jpg", "/images/photography/carousel_2/wix_0234.jpg",
 ]},
 { name: "Outdoor Portraits", images: [
 "/images/photography/carousel_1/wix_0216.jpg", "/images/photography/carousel_1/wix_0166.jpg",
 "/images/photography/carousel_1/wix_0168.jpg", "/images/photography/carousel_1/wix_0169.jpg",
 "/images/photography/carousel_1/wix_0174.jpg", "/images/photography/carousel_1/wix_0176.jpg",
 ]},
 ],
 Concerts: [
 { name: "Live Performances", images: [
 "/images/events/event_0002.jpg", "/images/events/event_0003.jpg", "/images/events/event_0004.jpg",
 "/images/events/event_0005.jpg", "/images/events/event_0006.png", "/images/events/event_0007.jpg",
 "/images/events/event_1.jpg", "/images/events/event_2.jpg", "/images/events/event_3.jpg",
 ]},
 { name: "Event Coverage", images: [
 "/images/events/event_page_1.jpg", "/images/events/event_page_2.jpg", "/images/events/event_page_3.jpg",
 "/images/events/event_page_4.jpg", "/images/events/event_page_5.jpg", "/images/events/event_page_6.jpg",
 ]},
 ],
 Street: [
 { name: "Urban Exploration", images: [
 "/images/photography/carousel_1/wix_0199.jpg", "/images/photography/carousel_1/wix_0200.jpg",
 "/images/photography/carousel_1/wix_0201.jpg", "/images/photography/carousel_1/wix_0203.jpg",
 "/images/photography/carousel_1/wix_0207.jpg", "/images/photography/carousel_1/wix_0210.jpg",
 "/images/photography/carousel_1/wix_0212.jpg", "/images/photography/carousel_1/wix_0213.jpg",
 ]},
  { name: "Street Stories", images: [
  "/images/photography/carousel_1/wix_0429.jpg", "/images/photography/carousel_1/wix_0431.jpg",
  "/images/photography/carousel_1/wix_0432.jpg", "/images/photography/carousel_1/wix_0434.jpg",
  ]},
  ],
  Editorial: [
  { name: "Fashion Editorials", images: [
  "/images/photography/carousel_3/wix_0303.jpg", "/images/photography/carousel_3/wix_0305.jpg",
  "/images/photography/carousel_3/wix_0308.jpg", "/images/photography/carousel_3/wix_0309.jpg",
  "/images/photography/carousel_3/wix_0311.jpg", "/images/photography/carousel_3/wix_0319.jpg",
  "/images/photography/carousel_3/wix_0321.jpg", "/images/photography/carousel_3/wix_0324.jpg",
  "/images/photography/carousel_3/wix_0326.jpg", "/images/photography/carousel_3/wix_0328.jpg",
  ]},
  { name: "Styled Shoots", images: [
  "/images/photography/carousel_2/wix_0245.jpg", "/images/photography/carousel_2/wix_0257.jpg",
  "/images/photography/carousel_2/wix_0259.jpg", "/images/photography/carousel_2/wix_0261.jpg",
  "/images/photography/carousel_2/wix_0264.jpg", "/images/photography/carousel_2/wix_0266.jpg",
  ]},
  ],
  Commercial: [
  { name: "Brand Campaigns", images: [
  "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
  "/images/photography/carousel_2/wix_0341.jpg", "/images/photography/carousel_2/wix_0348.jpg",
  "/images/photography/carousel_2/wix_0350.jpg",
  "/images/photography/carousel_1/wix_0438.jpg", "/images/photography/carousel_1/wix_0440.jpg",
  "/images/photography/carousel_1/wix_0444.jpg", "/images/photography/carousel_1/wix_0445.jpg",
  "/images/photography/carousel_1/wix_0446.jpg",
  ]},
  { name: "Product Shots", images: [
  "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
  "/images/photography/carousel_2/wix_0341.jpg",
  ]},
  ],
};
