"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";
import Link from "next/link";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 10); // 10AM-7PM

export default function PhotoshootCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [duration, setDuration] = useState("1hr");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDay, daysInMonth]);

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isWeekend = (day: number) => {
    const d = new Date(viewYear, viewMonth, day).getDay();
    return d === 0;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name || !email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "photoshoot-booking",
          data: {
            date: selectedDate.toISOString(),
            time: selectedTime,
            name,
            email,
            phone,
            duration,
            notes,
            submittedAt: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        logger.warn("photoshoot-page", `Form submit failed: ${data.error || res.status}`);
        toast.error(data.error || "Booking failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch (e) { logger.warn("photoshoot-page", `Form submit failed: ${e}`); toast.error("Booking failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <>
<main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-16 h-16 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-white mb-6 sm:mb-8">Booking Confirmed</h1>
            <p className="text-[#666665] dark:text-white/70 mb-2">Your photoshoot is scheduled for:</p>
            <p className="text-xl font-bold text-[#DF3131] mb-1">
              {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-lg text-[#333333] dark:text-white mb-6">{selectedTime}, {duration}</p>
            <p className="text-sm text-[#666665] dark:text-white/70 mb-8">A confirmation email has been sent to {email}. We will reach out within 24 hours to discuss creative direction and logistics.</p>
            <Link href="/" className="bg-[#333333] text-white px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-[#DF3131] transition-colors inline-block">
              Back to Home
            </Link>
          </div>
        </main>
</>
    );
  }

  return (
    <>
<main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm mb-2">Book a Session</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-white mb-6 sm:mb-8">
            Photoshoot Booking
          </h1>
          <p className="text-[#666665] dark:text-white/70 mb-10">$100/hr · 1-hour minimum · Includes 20 edited photos</p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 dark:border-[#444] p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="text-[#666665] dark:text-white/60 hover:text-[#DF3131] text-xl px-2">←</button>
                  <h2 className="text-lg font-heading font-bold tracking-[0.15em] uppercase mb-4">{monthNames[viewMonth]} {viewYear}</h2>
                  <button onClick={nextMonth} className="text-[#666665] dark:text-white/60 hover:text-[#DF3131] text-xl px-2">→</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666] dark:text-white/50 py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const disabled = isPast(day) || isWeekend(day);
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === viewMonth && selectedDate?.getFullYear() === viewYear;
                    return (
                      <button
                        key={day}
                        disabled={disabled}
                        onClick={() => { setSelectedDate(new Date(viewYear, viewMonth, day)); setSelectedTime(""); }}
                        className={`py-3 text-sm font-semibold transition-colors ${
                          disabled ? "text-[#ccc] cursor-not-allowed" :
                          isSelected ? "bg-[#DF3131] text-white" :
                          "text-[#333333] dark:text-[#e0e0e0] hover:bg-[#f5f5f5] dark:hover:bg-[#333]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-sm font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-3">Available Times</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {HOURS.map((h) => {
                      const time = `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
                      return (
                        <button
                          key={h}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-sm font-semibold border transition-colors ${
                            selectedTime === time
                              ? "border-[#DF3131] bg-[#DF3131] text-white"
                              : "border-gray-200 dark:border-[#444] text-[#333333] dark:text-[#e0e0e0] hover:border-[#DF3131]"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Booking form */}
            <div className="lg:col-span-2">
              <div className="bg-[#f5f5f5] dark:bg-[#252528] p-6 sticky top-28">
                <h3 className="text-lg font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-3">Your Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666665] dark:text-white/60 mb-1">Session Type</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 text-sm bg-white dark:bg-[#252528] dark:text-[#e0e0e0]">
                      <option value="1hr">1 Hour - $100</option>
                      <option value="2hr">2 Hours - $200</option>
                      <option value="half">Half Day (4hr) - $350</option>
                      <option value="full">Full Day (8hr) - $600</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666665] dark:text-white/60 mb-1">Full Name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 text-sm bg-white dark:bg-[#252528] dark:text-[#e0e0e0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666665] dark:text-white/60 mb-1">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 text-sm bg-white dark:bg-[#252528] dark:text-[#e0e0e0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666665] dark:text-white/60 mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 text-sm bg-white dark:bg-[#252528] dark:text-[#e0e0e0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold tracking-[0.1em] uppercase text-[#666665] dark:text-white/60 mb-1">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 text-sm resize-none bg-white dark:bg-[#252528] dark:text-[#e0e0e0]" placeholder="Location, style, special requests..." />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedTime || !name || !email || submitting}
                    className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                  {selectedDate && selectedTime && (
                    <p className="text-center text-sm text-[#666665] dark:text-white/60">
                      {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {selectedTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
</>
  );
}
