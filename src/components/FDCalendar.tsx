"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  title: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  url: string;
  price: string;
  city: string;
  status: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function parseDate(dateStr: string) {
  const d = new Date(dateStr);
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

export default function FDCalendar({ events, eventTab, onEventClick }: {
  events: CalendarEvent[];
  eventTab: "all" | "LA" | "NY";
  onEventClick: (e: CalendarEvent) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (eventTab !== "all" && e.city !== eventTab) return false;
      if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) && !e.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [events, eventTab, searchQuery]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(e => {
      const { year, month, day } = parseDate(e.date);
      const key = `${year}-${month}-${day}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [filteredEvents]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); } else setViewMonth(viewMonth + 1); };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="w-full">
      {/* Search + Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm">←</button>
          <h3 className="text-lg font-bold text-white min-w-[180px] text-center">{MONTHS[viewMonth]} {viewYear}</h3>
          <button onClick={nextMonth} className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm">→</button>
        </div>
        <div className="flex items-center gap-2">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 w-44" />
          <button onClick={() => { const t = new Date(); setViewYear(t.getFullYear()); setViewMonth(t.getMonth()); }}
            className="px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">Today</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-zinc-800">
          {DAYS.map(d => <div key={d} className="p-2 text-center text-xs font-bold text-zinc-600 uppercase tracking-wider">{d}</div>)}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="min-h-[100px] p-1 border-b border-r border-zinc-800/50" />;
            const key = `${viewYear}-${viewMonth}-${day}`;
            const dayEvents = eventsByDate[key] || [];
            const isToday = key === todayKey;
            const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;

            return (
              <div key={key} className={`min-h-[100px] p-1 border-b border-r border-zinc-800/50 transition-colors ${isToday ? "bg-[#DF3131]/10" : isWeekend ? "bg-zinc-900/30" : ""} hover:bg-zinc-800/30`}>
                <div className={`text-xs font-bold mb-1 px-1.5 py-0.5 rounded-full w-fit ${isToday ? "bg-[#DF3131] text-white" : "text-zinc-500"}`}>{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((evt, ei) => (
                    <button key={ei}
                      onMouseEnter={(e) => { setHoveredEvent(evt); setHoverPos({ x: e.clientX, y: e.clientY }); }}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => onEventClick(evt)}
                      className={`w-full text-left p-1 rounded text-[10px] leading-tight truncate block transition-all hover:scale-[1.02] ${
                        evt.status === "upcoming"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                          : "bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/60"
                      }`}>
                      <span className="font-semibold">{evt.title.split(" in ")[0].split(" at ")[0].split(" – ")[0].substring(0, 25)}{evt.title.length > 25 ? "…" : ""}</span>
                    </button>
                  ))}
                  {dayEvents.length > 3 && <div className="text-[10px] text-zinc-600 text-center">+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event count */}
      <div className="mt-4 text-xs text-zinc-600 text-center">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} • {filteredEvents.filter(e => e.status === "upcoming").length} upcoming • {filteredEvents.filter(e => e.status === "past").length} past
      </div>

      {/* Hover popup */}
      <AnimatePresence>
        {hoveredEvent && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl max-w-xs pointer-events-none"
            style={{ left: Math.min(hoverPos.x, window.innerWidth - 300), top: Math.min(hoverPos.y - 120, window.innerHeight - 200) }}>
            <div className={`text-xs font-bold mb-1 ${hoveredEvent.status === "upcoming" ? "text-green-400" : "text-zinc-500"}`}>
              {hoveredEvent.dateLabel} • {hoveredEvent.time}
            </div>
            <div className="text-sm font-bold text-white mb-1">{hoveredEvent.title}</div>
            <div className="text-xs text-zinc-400 mb-1">{hoveredEvent.location}</div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${hoveredEvent.status === "upcoming" ? "text-green-400" : "text-zinc-500"}`}>{hoveredEvent.price}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${hoveredEvent.status === "upcoming" ? "bg-green-500/20 text-green-300" : "bg-zinc-800 text-zinc-500"}`}>
                {hoveredEvent.status === "upcoming" ? "Upcoming" : "Past"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
