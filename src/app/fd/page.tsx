"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import FDDriveBrowser from "@/components/FDDriveBrowser";
import FDCalendar from "@/components/FDCalendar";

const LOCAL_API = "http://localhost:8080";
const POLL_INTERVAL = 3000;
const MAX_POLLS = 160;

const LA_STUDIOS = [
  { name: "Olympic 1", building: "Olympic", feature: "Underwater photography studio - full submerged shoot capability for ethereal aquatic concepts", image: "/images/fd-studios/Olympic/Olympic_1.jpg", color: "#06B6D4" },
  { name: "Olympic 2", building: "Olympic", feature: "Versatile open space with cyclorama wall - infinite backdrop for fashion, portrait, and product", image: "/images/fd-studios/Olympic/Olympic_2.jpg", color: "#0EA5E9" },
  { name: "Olympic 3", building: "Olympic", feature: "Car turntable stage - rotating platform for automotive, dynamic motion, and product hero shots", image: "/images/fd-studios/Olympic/Olympic_3.webp", color: "#8B5CF6" },
  { name: "Olympic 4", building: "Olympic", feature: "Private jet interior set - luxury aviation cabin for high-fashion editorial and lifestyle campaigns", image: "/images/fd-studios/Olympic/Olympic_4.webp", color: "#EC4899" },
  { name: "Olympic 5", building: "Olympic", feature: "Large-format industrial bay with roll-up door - urban edge, natural light, vehicle access", image: "/images/fd-studios/Olympic/Olympic_5.webp", color: "#F59E0B" },
  { name: "Hill 1", building: "Hill", feature: "Bright white cyclorama - clean minimal aesthetic for beauty, portraits, and product", image: "/images/fd-studios/Hill/Hill_1.webp", color: "#F97316" },
  { name: "Hill 2", building: "Hill", feature: "Textured plaster walls with natural window light - editorial and lifestyle with organic feel", image: "/images/fd-studios/Hill/Hill_2.webp", color: "#14B8A6" },
  { name: "Hill 3", building: "Hill", feature: "Full-wall mirror array - infinite reflection, surreal portrait and fashion compositions", image: "/images/fd-studios/Hill/Hill_3.webp", color: "#06B6D4" },
  { name: "Hill 4", building: "Hill", feature: "Exposed brick with vintage furniture set - retro, gritty, character-driven portraits", image: "/images/fd-studios/Hill/Hill_4.webp", color: "#EF4444" },
  { name: "Hill 5", building: "Hill", feature: "Adjustable LED color backdrop wall - chroma-key flexibility for music, fashion, conceptual", image: "/images/fd-studios/Hill/Hill_5.webp", color: "#8B5CF6" },
  { name: "Hill 6", building: "Hill", feature: "Moroccan tile shower set - textured architectural detail for editorial and boudoir", image: "/images/fd-studios/Hill/Hill_6.webp", color: "#EC4899" },
  { name: "Hill 7", building: "Hill", feature: "Rain room - programmable overhead water system for dramatic wet-weather fashion and fine art", image: "/images/fd-studios/Hill/Hill_7.webp", color: "#3B82F6" },
  { name: "Hill 8", building: "Hill", feature: "Raw concrete gallery - brutalist industrial backdrop for avant-garde and street-style", image: "/images/fd-studios/Hill/Hill_8.webp", color: "#64748B" },
  { name: "Yukon 1", building: "Yukon", feature: "White seamless infinity cove - floating, boundary-less fashion and beauty looks", image: "/images/fd-studios/Yukon/Yukon_1.jpg", color: "#F9AD4D" },
  { name: "Yukon 2", building: "Yukon", feature: "Gritty warehouse corner with metal beams - urban industrial for streetwear and bands", image: "/images/fd-studios/Yukon/Yukon_2.webp", color: "#A855F7" },
  { name: "Yukon 3", building: "Yukon", feature: "Water studio - splash pool and wet surface for dynamic aquatic editorial", image: "/images/fd-studios/Yukon/Yukon_3.webp", color: "#0EA5E9" },
  { name: "Yukon 4", building: "Yukon", feature: "Abstract painted backdrop room - colorful expressionist walls for playful, artistic portraiture", image: "/images/fd-studios/Yukon/Yukon_4.jpg", color: "#F97316" },
  { name: "Yukon 5", building: "Yukon", feature: "RGB LED cave room - fully immersive programmable color environment for music, fashion, avant-garde", image: "/images/fd-studios/Yukon/Yukon_5.jpg", color: "#8B5CF6" },
  { name: "Art 1", building: "Art", feature: "Gallery white box with track lighting - museum-quality fine art and art reproduction", image: "/images/fd-studios/Art/Art_1.webp", color: "#14B8A6" },
  { name: "Art 2", building: "Art", feature: "Floor-to-ceiling window with northern light - natural light portrait and fine art nudes", image: "/images/fd-studios/Art/Art_2.webp", color: "#F59E0B" },
  { name: "Art 3", building: "Art", feature: "Dark moody set with theatrical spotlight - high-contrast dramatic portraiture and film noir", image: "/images/fd-studios/Art/Art_3.webp", color: "#EF4444" },
  { name: "Art 4", building: "Art", feature: "Minimalist white room with geometric shadow patterns - abstract fine art and modern editorial", image: "/images/fd-studios/Art/Art_4.webp", color: "#6366F1" },
  { name: "Loft 1", building: "Loft", feature: "Sun-drenched open loft with exposed ceiling - lifestyle, yoga, and organic editorial", image: "/images/fd-studios/Loft/Loft_1.webp", color: "#F97316" },
  { name: "Loft 2", building: "Loft", feature: "Vintage living room set with fireplace - cozy intimate portraits, lifestyle, family", image: "/images/fd-studios/Loft/Loft_2.webp", color: "#EC4899" },
  { name: "Loft 3", building: "Loft", feature: "Industrial kitchen set with stainless surfaces - culinary, lifestyle, commercial product", image: "/images/fd-studios/Loft/Loft_3.webp", color: "#06B6D4" },
  { name: "Loft 4", building: "Loft", feature: "Brick-walled bedroom set - intimate boudoir, editorial sleep scenes, lifestyle", image: "/images/fd-studios/Loft/Loft_4.webp", color: "#8B5CF6" },
  { name: "Loft 5", building: "Loft", feature: "Rooftop deck with skyline view - golden hour, cityscape, outdoor lifestyle and fashion", image: "/images/fd-studios/Loft/Loft_5.webp", color: "#F59E0B" },
  { name: "Loft 6", building: "Loft", feature: "White-washed studio with vintage distressed walls - shabby-chic editorial and fashion", image: "/images/fd-studios/Loft/Loft_6.webp", color: "#14B8A6" },
  { name: "Main A", building: "Main", feature: "Large cyclorama stage - full-body fashion, automotive, group shots, unlimited backdrop", image: "/images/fd-studios/Main/Main_A.webp", color: "#3B82F6" },
  { name: "Main B", building: "Main", feature: "Textured concrete with roll-up door - industrial edge for urban fashion and music video", image: "/images/fd-studios/Main/Main_B.webp", color: "#EF4444" },
  { name: "Main C", building: "Main", feature: "White brick gallery wall - clean editorial look with architectural character", image: "/images/fd-studios/Main/Main_C.webp", color: "#64748B" },
  { name: "Main D", building: "Main", feature: "Dark painted set with practical window light - moody portraiture and film-style scenes", image: "/images/fd-studios/Main/Main_D.jpg", color: "#A855F7" },
  { name: "Main E", building: "Main", feature: "Neutral beige cyclorama with softbox grid - beauty and commercial headshots", image: "/images/fd-studios/Main/Main_E.webp", color: "#F9AD4D" },
  { name: "Main F", building: "Main", feature: "High-key white infinity cove - floating product, beauty, and fashion on seamless white", image: "/images/fd-studios/Main/Main_F.webp", color: "#0EA5E9" },
];

const PROMPTS = [
  { label: "Eccentric Mixers", prompt: "Generate 3 eccentric summer LA mixer ideas for FD Photo Studio using specific studio names and their unique conceptual features", icon: " ", color: "#8B5CF6" },
  { label: "Profitable Workshops", prompt: "Generate 3 profitable workshop ideas ($100-250 ticket) for FD Photo Studio LA using unique studio spaces", icon: " ", color: "#10B981" },
  { label: "TFP-Only Events", prompt: "Generate 3 TFP-model-only photography mixer ideas for FD Photo Studio LA using Olympic underwater, Hill rain room, and Yukon RGB cave", icon: " ", color: "#F59E0B" },
  { label: "Cross-Building", prompt: "Generate 3 creative event concepts combining multiple FD buildings in LA for maximum visual variety", icon: " ", color: "#EC4899" },
  { label: "Rain Room Ideas", prompt: "Generate 3 creative photo events specifically designed around Hill 7's rain room feature", icon: " ", color: "#3B82F6" },
  { label: "Night Concepts", prompt: "Generate 3 after-dark photo mixer concepts using Yukon's RGB cave, Olympic's car turntable, and Loft's rooftop", icon: " ", color: "#F97316" },
];

const BUILDINGS = [...new Set(LA_STUDIOS.map(s => s.building))];

const FD_EVENTS = [
  // ── 2026 UPCOMING ──
  { title: "October Cosplay Photo Mixer in Brooklyn", date: "2026-10-01", dateLabel: "Thu, Oct 1", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20-$55", city: "NY", status: "upcoming" },
  { title: "September Cosplay Photo Mixer in Brooklyn", date: "2026-09-03", dateLabel: "Thu, Sep 3", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20-$55", city: "NY", status: "upcoming" },
  { title: "Photography Masterclass with Anya Anti in NY", date: "2026-08-29", dateLabel: "Sat, Aug 29", time: "1:00 PM - 3:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "https://www.eventbrite.com/e/photography-masterclass-with-anya-anti-in-ny-tickets-1991842685090", price: "$165-$195", city: "NY", status: "upcoming" },
  { title: "August Cosplay Photo Mixer in Brooklyn", date: "2026-08-06", dateLabel: "Thu, Aug 6", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/e/cosplay-photo-mixer-in-brooklyn-tickets-1991954378167", price: "$20-$55", city: "NY", status: "upcoming" },

  // ── 2026 PAST ──
  { title: "Photography Masterclass with Tony Northrup in NY", date: "2026-07-12", dateLabel: "Sun, Jul 12", time: "12:00 PM - 3:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$210-$250", city: "NY", status: "past" },
  { title: "Rain Photography Workshop with Mermaid Model in LA", date: "2026-07-11", dateLabel: "Sat, Jul 11", time: "5:30 PM - 8:30 PM", location: "FD Photo Studio Yukon, Hawthorne CA", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$145-$170", city: "LA", status: "past" },
  { title: "Brooklyn Rooftop Photo Mixer", date: "2026-07-09", dateLabel: "Thu, Jul 9", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Scott, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20-$30", city: "NY", status: "past" },
  { title: "June Photo Mixer at FD Photo Studio LA", date: "2026-06-27", dateLabel: "Sat, Jun 27", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20-$30", city: "LA", status: "past" },
  { title: "Cosplay Photo Mixer in Brooklyn", date: "2026-06-05", dateLabel: "Fri, Jun 5", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20-$30", city: "NY", status: "past" },
  { title: "Candlelight Photo Mixer in LA", date: "2026-05-30", dateLabel: "Sat, May 30", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "https://www.eventbrite.com/e/candlelight-photo-mixer-la-tickets-1989165211695", price: "$15-$20", city: "LA", status: "past" },
  { title: "Retro Photo Mixer Event in New York", date: "2026-05-23", dateLabel: "Sat, May 23", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$15-$20", city: "NY", status: "past" },
  { title: "Racing Photo Mixer in Los Angeles", date: "2026-05-16", dateLabel: "Sat, May 16", time: "4:00 PM - 7:00 PM", location: "FD Photo Studio Olympic, Los Angeles CA", url: "https://www.eventbrite.com/e/racing-themed-photo-mixer-in-los-angeles-tickets-1988215082834", price: "$30-$55", city: "LA", status: "past" },
  { title: "Burlesque Photography Event in Astoria NY", date: "2026-05-17", dateLabel: "Sun, May 17", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "https://www.eventbrite.com/e/burlesque-photography-event-in-astoria-ny-tickets-1986944431281", price: "$20", city: "NY", status: "past" },
  { title: "Lighting for Portraits Masterclass with Ian Spanier", date: "2026-05-02", dateLabel: "Sat, May 2", time: "11:00 AM - 2:00 PM", location: "FD Photo Studio Yukon, Hawthorne CA", url: "https://www.eventbrite.com/e/lighting-for-portraits-masterclass-with-celebrity-photographer-ian-spanier-tickets-1986369880785", price: "$200", city: "LA", status: "past" },
  { title: "April Photo Mixer in Los Angeles", date: "2026-04-25", dateLabel: "Sat, Apr 25", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Hill, Los Angeles CA", url: "https://www.eventbrite.com/e/april-photo-mixer-in-los-angeles-tickets-1986567923135", price: "$15", city: "LA", status: "past" },
  { title: "Spring Photography Mixer Event in New York", date: "2026-04-11", dateLabel: "Sat, Apr 11", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "https://www.eventbrite.com/e/spring-photography-mixer-event-in-new-york-tickets-1983586757388", price: "$15", city: "NY", status: "past" },
  { title: "Rain Photography Workshop in Los Angeles", date: "2026-03-28", dateLabel: "Sat, Mar 28", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Olympic, Los Angeles CA", url: "https://www.fdphotostudio.com/events/rain-photography-workshop-in-los-angeles/", price: "$135", city: "LA", status: "past" },
  { title: "Brooklyn Photo Mixer – RGB & Rain Effects", date: "2026-03-26", dateLabel: "Thu, Mar 26", time: "5:00 PM - 8:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/e/brooklyn-photo-mixer-3-studios-including-rgb-lighting-rain-effects-tickets-1984404435084", price: "$15", city: "NY", status: "past" },
  { title: "Spring Photo Mixer at FD Photo Studio in DTLA", date: "2026-03-07", dateLabel: "Sat, Mar 7", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "https://www.eventbrite.com/e/spring-photo-mixer-event-at-fd-photo-studio-in-downtown-la-tickets-1983052930698", price: "$15", city: "LA", status: "past" },
  { title: "Creature Captures - Photo Mixer with Exotic Animals in NY", date: "2026-02-28", dateLabel: "Sat, Feb 28", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$25", city: "NY", status: "past" },
  { title: "Valentine's Day Photography Mixer in DTLA", date: "2026-02-14", dateLabel: "Sat, Feb 14", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$15", city: "LA", status: "past" },
  { title: "Valentine's Day Photography Mixer in Astoria NY", date: "2026-02-07", dateLabel: "Sat, Feb 7", time: "12:00 PM - 3:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$15", city: "NY", status: "past" },
  { title: "Photo Mixer Event with Vintage RV", date: "2026-01-17", dateLabel: "Sat, Jan 17", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Yukon, Hawthorne CA", url: "https://www.eventbrite.com/o/fd-photo-studio-14334915883", price: "$20", city: "LA", status: "past" },

  // ── 2025 HISTORICAL ──
  { title: "Christmas Photography Mixer in Astoria NY", date: "2025-12-06", dateLabel: "Sat, Dec 6", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Astoria, Queens NY", url: "", price: "$15-$20", city: "NY", status: "past" },
  { title: "Christmas Photography Mixer in DTLA", date: "2025-12-06", dateLabel: "Sat, Dec 6", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$15-$20", city: "LA", status: "past" },
  { title: "Fall into Focus: Autumn Mixer LIC NY", date: "2025-11-22", dateLabel: "Sat, Nov 22", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio LIC, Queens NY", url: "", price: "$15-$20", city: "NY", status: "past" },
  { title: "Photo Mixer at Metal Hangar in Los Angeles", date: "2025-11-08", dateLabel: "Sat, Nov 8", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Olympic, Los Angeles CA", url: "", price: "$15-$20", city: "LA", status: "past" },
  { title: "Halloween Photography Mixer Astoria NY", date: "2025-10-29", dateLabel: "Wed, Oct 29", time: "5:30 PM - 8:30 PM", location: "FD Photo Studio Astoria, Queens NY", url: "", price: "$15-$20", city: "NY", status: "past" },
  { title: "Halloween Photo Mixer in DTLA", date: "2025-10-25", dateLabel: "Sat, Oct 25", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "", price: "$15-$20", city: "LA", status: "past" },
  { title: "October Photo Mixer in Los Angeles", date: "2025-10-19", dateLabel: "Sun, Oct 19", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Hill, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Cosplay & Connect: Brooklyn Photography Mixer", date: "2025-10-12", dateLabel: "Sun, Oct 12", time: "4:00 PM - 7:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "", price: "$20", city: "NY", status: "past" },
  { title: "Cosplay & Connect: DTLA Photography Mixer", date: "2025-09-27", dateLabel: "Sat, Sep 27", time: "4:00 PM - 7:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "", price: "$20", city: "LA", status: "past" },
  { title: "Open Studio Photography Mixer – DTLA", date: "2025-09-13", dateLabel: "Sat, Sep 13", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Blackout Studio & RGB Lights Workshop w/ Aaron Ram", date: "2025-09-06", dateLabel: "Sat, Sep 6", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Yukon, Hawthorne CA", url: "", price: "$135", city: "LA", status: "past" },
  { title: "Ballerinas in Frame: Ballet-Themed Photoshoot", date: "2025-08-27", dateLabel: "Wed, Aug 27", time: "5:00 PM - 8:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "", price: "$25", city: "NY", status: "past" },
  { title: "Color Pop Social: NY Photography Mixer", date: "2025-08-24", dateLabel: "Sun, Aug 24", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio LIC, Queens NY", url: "", price: "$15", city: "NY", status: "past" },
  { title: "Creative Photo Mixer in DTLA", date: "2025-08-16", dateLabel: "Sat, Aug 16", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Sundown Shoot & Social: Brooklyn Rooftop Mixer", date: "2025-07-26", dateLabel: "Sat, Jul 26", time: "5:00 PM - 8:00 PM", location: "FD Photo Studio Scott, Brooklyn NY", url: "", price: "$20-$30", city: "NY", status: "past" },
  { title: "July Photo Mixer in DTLA Lofts", date: "2025-07-16", dateLabel: "Wed, Jul 16", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Loft, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Summer Photo Mixer Brooklyn NY", date: "2025-06-28", dateLabel: "Sat, Jun 28", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "", price: "$15", city: "NY", status: "past" },
  { title: "Photo Mixer Los Angeles", date: "2025-06-21", dateLabel: "Sat, Jun 21", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "FD METRO Grand Opening - Early Access NYC Mixer", date: "2025-04-08", dateLabel: "Tue, Apr 8", time: "5:00 PM - 8:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "", price: "Free", city: "NY", status: "past" },
  { title: "The Rain Room Workshop - Light & Capture Raindrops", date: "2025-03-05", dateLabel: "Wed, Mar 5", time: "6:00 PM - 9:00 PM", location: "FD Photo Studio Yukon, Hawthorne CA", url: "", price: "$85", city: "LA", status: "past" },
  { title: "Studio Lighting & 3-Light Set-Up Masterclass", date: "2025-02-20", dateLabel: "Thu, Feb 20", time: "7:00 PM - 9:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$75", city: "LA", status: "past" },
  { title: "Valentine's Day Photography Mixer", date: "2025-02-15", dateLabel: "Sat, Feb 15", time: "2:00 PM - 5:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Sweet Valentine's Beauty Photography Workshop", date: "2025-02-09", dateLabel: "Sun, Feb 9", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "", price: "$85", city: "LA", status: "past" },
  { title: "Chicago Photographers & Models Mixer", date: "2025-01-25", dateLabel: "Sat, Jan 25", time: "1:00 PM - 4:00 PM", location: "Chicago, IL", url: "", price: "$15", city: "NY", status: "past" },

  // ── 2024 HISTORICAL ──
  { title: "LA Holiday Mixer + GRAND OPENING", date: "2024-12-15", dateLabel: "Sun, Dec 15", time: "4:00 PM - 7:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "NYC Mixer + New FD Studio Early Access", date: "2024-12-14", dateLabel: "Sat, Dec 14", time: "5:00 PM - 8:00 PM", location: "FD Photo Studio Metro, Brooklyn NY", url: "", price: "Free", city: "NY", status: "past" },
  { title: "Beauty Photography Masterclass", date: "2024-12-08", dateLabel: "Sun, Dec 8", time: "1:00 PM - 4:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "", price: "$85", city: "LA", status: "past" },
  { title: "ROOM 6 - A Photographic Visual Halloween Experience", date: "2024-10-31", dateLabel: "Thu, Oct 31", time: "5:00 PM - 9:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$25", city: "LA", status: "past" },
  { title: "Sailboat Group Shoot - Agency Model on Catamaran", date: "2024-08-02", dateLabel: "Fri, Aug 2", time: "1:00 PM - 4:00 PM", location: "Los Angeles, CA", url: "", price: "$95", city: "LA", status: "past" },
  { title: "Rescue Mixer: Photography Event with Extra Feline", date: "2024-07-08", dateLabel: "Mon, Jul 8", time: "11:00 AM - 2:00 PM", location: "FD Photo Studio Art, Los Angeles CA", url: "", price: "$15", city: "LA", status: "past" },
  { title: "Group Shoot on a Sailboat", date: "2024-07-06", dateLabel: "Sat, Jul 6", time: "1:00 PM - 4:00 PM", location: "Los Angeles, CA", url: "", price: "$95", city: "LA", status: "past" },
  { title: "Colorful Editorial Shoot w/ Agency Models", date: "2024-06-30", dateLabel: "Sun, Jun 30", time: "3:00 PM - 6:00 PM", location: "FD Photo Studio Main, Los Angeles CA", url: "", price: "$35", city: "LA", status: "past" },

  // ── 2017 ORIGINALS ──
  { title: "Sunset Photography Mixer on the Rooftop", date: "2017-12-14", dateLabel: "Thu, Dec 14", time: "3:30 PM - 6:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "Studio Lighting Masterclass", date: "2017-12-12", dateLabel: "Tue, Dec 12", time: "7:00 PM - 9:00 PM", location: "Los Angeles, CA", url: "", price: "$45", city: "LA", status: "past" },
  { title: "Headshots Masterclass with Brandon Espy", date: "2017-11-30", dateLabel: "Thu, Nov 30", time: "7:00 PM - 9:00 PM", location: "Los Angeles, CA", url: "", price: "$45", city: "LA", status: "past" },
  { title: "Rooftop Photography Social Mixer", date: "2017-11-18", dateLabel: "Sat, Nov 18", time: "4:00 PM - 7:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "Complimentary Rooftop Shoot", date: "2017-10-26", dateLabel: "Thu, Oct 26", time: "5:00 PM - 7:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "Group Swimsuit Shoot with Alexis, Hilena & Moyra", date: "2017-10-19", dateLabel: "Thu, Oct 19", time: "5:00 PM - 8:00 PM", location: "Los Angeles, CA", url: "", price: "$35", city: "LA", status: "past" },
  { title: "Photographers Network Session + Rooftop Shoot", date: "2017-09-21", dateLabel: "Thu, Sep 21", time: "6:00 PM - 8:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "Portrait Photography Workshop - Beginner", date: "2017-09-14", dateLabel: "Thu, Sep 14", time: "7:00 PM - 9:00 PM", location: "Los Angeles, CA", url: "", price: "$35", city: "LA", status: "past" },
  { title: "Intro to Studio Lighting Workshop", date: "2017-09-07", dateLabel: "Thu, Sep 7", time: "7:00 PM - 9:00 PM", location: "Los Angeles, CA", url: "", price: "$35", city: "LA", status: "past" },
  { title: "Photography Networking Mixer", date: "2017-08-17", dateLabel: "Thu, Aug 17", time: "5:30 PM - 8:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
  { title: "Complimentary Studio Shoot with Agency Models", date: "2017-06-18", dateLabel: "Sun, Jun 18", time: "3:00 PM - 6:00 PM", location: "Los Angeles, CA", url: "", price: "Free", city: "LA", status: "past" },
];

interface Message {
  role: "user" | "assistant" | "system" | "error";
  content: string;
}

export default function FDOraclePage() {
  const [apiUrl, setApiUrl] = useState(LOCAL_API);
  const [online, setOnline] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [activeStudio, setActiveStudio] = useState<string | null>(null);
  const [activeBuilding, setActiveBuilding] = useState(BUILDINGS[0]);
  const [eventTab, setEventTab] = useState<"all" | "LA" | "NY">("all");
  const [selectedEvent, setSelectedEvent] = useState<typeof FD_EVENTS[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollDown = () => setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);

  const checkHealth = useCallback(async () => {
    // Try local bridge API
    try {
      const r = await fetch(`http://localhost:8080/fd/health`, { signal: AbortSignal.timeout(2000) });
      const d = await r.json();
      if (d.status === "online") { setOnline(true); return; }
    } catch (e) { console.warn("[fd-page] Local health check failed", e); }

    // Fall back to cloud Oracle
    try {
      const r = await fetch("/api/fd/oracle", { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      setOnline(d.status === "online");
    } catch { setOnline(false); }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  const addMsg = (role: Message["role"], content: string) => { setMessages(prev => [...prev, { role, content }]); scrollDown(); };

  const sendMessage = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text || generating) return;
    setGenerating(true); setInput(""); setJobStatus("Thinking...");
    addMsg("user", text);

    // Try local API first, fall back to cloud Oracle
    try {
      const r = await fetch(`${apiUrl}/fd/health`, { signal: AbortSignal.timeout(3000) });
      if (r.ok) {
        setJobStatus("Contacting Oracle...");
        const chatR = await fetch(`${apiUrl}/fd/chat`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: text }),
          signal: AbortSignal.timeout(10000),
        });
        const d = await chatR.json();
        setSessionId(d.session_id);
        let attempts = 0;
        setJobStatus("Generating ideas...");
        pollRef.current = setInterval(async () => {
          attempts++;
          try {
            const jr = await fetch(`${apiUrl}/fd/job/${d.job_id}`, { signal: AbortSignal.timeout(5000) });
            const job = await jr.json();
            if (job.status === "done") { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("assistant", job.response); }
            else if (job.status === "error") { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", job.error || "Generation failed"); }
            else if (attempts >= MAX_POLLS) { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", "Timed out."); }
          } catch { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", "Lost connection."); }
        }, POLL_INTERVAL);
        return;
      }
    } catch (e) { console.warn("[fd-page] Local chat API failed, falling back to cloud", e); }

    // Cloud fallback
    setJobStatus("Oracle (cloud)...");
    try {
      const r = await fetch("/api/fd/oracle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
        signal: AbortSignal.timeout(35000),
      });
      const d = await r.json();
      if (d.error) { setGenerating(false); setJobStatus(""); addMsg("error", d.error); }
      else { setSessionId(d.session_id); setGenerating(false); setJobStatus(""); addMsg("assistant", d.response); }
    } catch { setGenerating(false); setJobStatus(""); addMsg("error", "Oracle unavailable. Add OPENROUTER_API_KEY to Vercel env."); }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\[ANALYST\]/gi, '<div class="flex items-center gap-2 mt-4 mb-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="text-blue-400 font-bold text-xs tracking-wider">ANALYST</span></div>')
      .replace(/\[MUSE\]/gi, '<div class="flex items-center gap-2 mt-4 mb-2"><span class="w-2 h-2 rounded-full bg-purple-500"></span><span class="text-purple-400 font-bold text-xs tracking-wider">MUSE</span></div>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ═══ HERO — ORACLE GENERATOR ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(223,49,49,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(139,92,246,0.2) 0%, transparent 50%)" }} />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm mb-4">
                <span>FD Photo Studio LA  ·  AI Event Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tight mb-6 sm:mb-8">
                FD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF3131] to-[#F9AD4D]">ORACLE</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mt-3 max-w-2xl mx-auto">
                Event brainstorm engine. Describe what you want, get eccentric, profitable, shoot-ready concepts using FD&apos;s 37 LA stages.
              </p>
            </div>
          </motion.div>

          {/* Chat */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#DF3131] to-[#F9AD4D] flex items-center justify-center text-2xl">FD</div>
                      <p className="text-zinc-400 text-sm mb-6">The Oracle knows all 37 LA stages, your past events, and what sells. Start a conversation or use a prompt below.</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {PROMPTS.slice(0, 4).map(p => (
                          <button key={p.label} onClick={() => setInput(p.prompt)} className="px-3 py-1.5 text-xs rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`p-4 rounded-xl text-sm border-l-4 ${m.role === "user" ? "bg-amber-500/10 border-amber-500 ml-8" : m.role === "assistant" ? "bg-zinc-800/50 border-[#DF3131]" : m.role === "error" ? "bg-red-500/10 border-red-500" : "bg-zinc-800/50 border-zinc-600"}`}>
                    {m.role !== "user" && <div className="text-xs font-bold mb-1 text-zinc-500 uppercase tracking-wider">{m.role === "assistant" ? "Oracle" : m.role}</div>}
                    <div className="text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                  </div>
                ))}
                {generating && (
                  <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-zinc-500 text-sm">{jobStatus}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Buttons */}
              <div className="px-4 py-3 border-t border-zinc-800 flex flex-wrap gap-2">
                {PROMPTS.map(p => (
                  <button key={p.label} onClick={() => setInput(p.prompt)} className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-3">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Describe the event you want... (e.g., '3 ideas using Olympic underwater and Hill rain room')"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#DF3131] transition-all text-sm"
                    disabled={generating} />
                  <button onClick={() => sendMessage()} disabled={generating || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-[#DF3131] to-[#B82020] hover:from-[#B82020] hover:to-[#DF3131] text-white font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-2">
                    Generate
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-yellow-500"} ${online ? "" : "animate-pulse"}`} />
                    <span className="text-xs text-zinc-600">{online ? "Oracle Online" : "Oracle (cloud standby)"}</span>
                  </div>
                  <button onClick={() => setShowApiSettings(!showApiSettings)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Settings</button>
                </div>
                {showApiSettings && (
                  <div className="mt-3 flex gap-2">
                    <input type="text" value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-zinc-600" placeholder="API URL" />
                    <button onClick={() => checkHealth()}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-lg text-zinc-400 transition-all">Connect</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STUDIO EXPLORER ═══ */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">LA STUDIOS <span className="text-[#DF3131]">EXPLORER</span></h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">37 stages across 6 LA buildings. Select a building to browse its unique studios.</p>
            </div>
          </ScrollReveal>

          {/* Building Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {BUILDINGS.map((b, i) => {
              const count = LA_STUDIOS.filter(s => s.building === b).length;
              return (
                <button key={b} onClick={() => setActiveBuilding(b)}
                  className={`px-5 py-3 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeBuilding === b ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/20" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"}`}
                  style={activeBuilding === b ? { boxShadow: `0 0 30px ${LA_STUDIOS.find(s => s.building === b)?.color}30` } : {}}
                >
                  {b} <span className="text-xs opacity-60 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Active Building Header */}
          <div className="mb-8 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-400 text-sm">
              <span className="text-white font-bold">{activeBuilding}</span> - {" "}
              {activeBuilding === "Olympic" && "5 premium stages: underwater, car turntable, private jet, cyclorama, industrial bay"}
              {activeBuilding === "Hill" && "8 versatile stages: cyclorama, rain room, mirror array, LED cave, brick, concrete, tile, and more"}
              {activeBuilding === "Yukon" && "5 creative stages: infinity cove, warehouse, water studio, abstract painted, RGB cave room"}
              {activeBuilding === "Art" && "4 fine art spaces: gallery white box, northern light window, theatrical spotlight, geometric minimal"}
              {activeBuilding === "Loft" && "6 lifestyle stages: sun-lit loft, vintage living room, kitchen, bedroom, rooftop deck, distressed walls"}
              {activeBuilding === "Main" && "6 signature stages: cyclorama, concrete, brick gallery, dark set, beige cove, white infinity"}
            </p>
          </div>

          {/* Studio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LA_STUDIOS.filter(s => s.building === activeBuilding).map((studio, i) => (
              <ScrollReveal key={studio.name} animation="scaleIn" delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  onMouseEnter={() => setActiveStudio(studio.name)}
                  onMouseLeave={() => setActiveStudio(null)}
                  className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 cursor-pointer"
                  style={{ boxShadow: activeStudio === studio.name ? `0 0 30px ${studio.color}20` : "none" }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={studio.image} alt={studio.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white mb-3">{studio.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${studio.color}20`, color: studio.color }}>{studio.building}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{studio.feature}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE CALENDAR ═══ */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">EVENT <span className="text-[#DF3131]">CALENDAR</span></h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Interactive calendar, hover events for preview, click for full details. Filter by city and search.</p>
            </div>
          </ScrollReveal>

          <div className="flex justify-center gap-2 mb-10">
            {(["all", "LA", "NY"] as const).map(tab => (
              <button key={tab} onClick={() => setEventTab(tab)}
                className={`px-6 py-3 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${eventTab === tab ? "bg-[#DF3131] text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"}`}>
                {tab === "all" ? "All Cities" : tab === "LA" ? "Los Angeles" : "New York"}
              </button>
            ))}
          </div>

          <FDCalendar events={FD_EVENTS} eventTab={eventTab} onEventClick={(e) => { setSelectedEvent(e); setLightboxIndex(FD_EVENTS.indexOf(e)); }} />
        </div>
      </section>

      {/* ═══ EVENT LIGHTBOX ═══ */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${selectedEvent.status === "upcoming" ? "text-green-400" : "text-zinc-500"}`}>
                    {selectedEvent.status === "upcoming" ? "Upcoming" : "Past Event"}
                  </span>
                  <span className="text-xs text-zinc-500">{selectedEvent.dateLabel}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                  <span>🕐 {selectedEvent.time}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4">📍 {selectedEvent.location}</p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Price</p>
                    <p className="text-lg font-bold text-white">{selectedEvent.price}</p>
                  </div>
                  <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#DF3131] hover:bg-[#B82020] text-white text-sm font-bold rounded-lg transition-all">
                    {selectedEvent.status === "upcoming" ? "Get Tickets" : "View on Eventbrite"}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-900/50">
                <button onClick={() => {
                  const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab);
                  const idx = filtered.indexOf(selectedEvent);
                  const prev = idx > 0 ? filtered[idx - 1] : filtered[filtered.length - 1];
                  setSelectedEvent(prev); setLightboxIndex(FD_EVENTS.indexOf(prev));
                }} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">← Previous</button>
                <span className="text-xs text-zinc-600">{(() => { const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab); return `${filtered.indexOf(selectedEvent) + 1} / ${filtered.length}`; })()}</span>
                <button onClick={() => {
                  const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab);
                  const idx = filtered.indexOf(selectedEvent);
                  const next = idx < filtered.length - 1 ? filtered[idx + 1] : filtered[0];
                  setSelectedEvent(next); setLightboxIndex(FD_EVENTS.indexOf(next));
                }} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">Next →</button>
              </div>
              <button onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-all">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GOOGLE DRIVE ARCHIVE ═══ */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-950 to-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">FD EVENTS <span className="text-[#DF3131]">ARCHIVE</span></h2>
              <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                Browse the full FD event archive, clips, recap variants, photos, and production files organized by event.
                Everything is accessible to view and download directly from Google Drive.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-zinc-600">
                <span>🎬 Clips &amp; Videos</span>
                <span>📸 Photos &amp; Images</span>
                <span>📄 Documents</span>
                <span>📁 Event Folders</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 md:p-6">
            <FDDriveBrowser />
          </div>

          <div className="mt-6 text-center">
            <a href="https://drive.google.com/drive/folders/1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
              <span>Open in Google Drive</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 px-4 bg-black border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fadeUp">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4">HOW THE <span className="text-[#DF3131]">ORACLE</span> WORKS</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
                <h3 className="text-blue-400 font-bold text-lg mb-3">THE ANALYST</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />Checks 82+ past events for redundancy</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />Validates pricing and profitability</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />Ensures TFP/low-cost model viability</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />LA-only unless NY explicitly requested</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                <h3 className="text-purple-400 font-bold text-lg mb-3">THE MUSE</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Generates never-done-before concepts</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Leverages unique studio features (jet, underwater, RGB cave)</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Low-setup, high-creative-impact events</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Cross-building synergies for visual variety</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
