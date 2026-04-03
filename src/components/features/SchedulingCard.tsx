"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BookingForm } from "./BookingForm";
import { MoreSlotsDrawer } from "./MoreSlotsDrawer";
import { formatDateDisplay, getDayName, getNextSixDays, getSlotEndTime } from "@/lib/date-utils";

type InsuranceType = "health" | "term";

const springTransition = { type: "spring" as const, visualDuration: 0.3, bounce: 0.15 };
const instantTransition = { duration: 0 };

const variants = {
  enter: (dir: "forward" | "back") => ({
    opacity: 0,
    x: dir === "forward" ? 40 : -40,
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: "forward" | "back") => ({
    opacity: 0,
    x: dir === "forward" ? -40 : 40,
  }),
};

const EARLIEST_TIME = "1:00 PM";

export function SchedulingCard() {
  const earliestDate = useMemo(() => getNextSixDays()[0], []);

  const [activeTab, setActiveTab] = useState<InsuranceType>("health");
  const [view, setView] = useQueryState(
    "step",
    parseAsStringLiteral(["timeslot", "form", "success"] as const).withDefault("timeslot")
  );
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<{
    date: string; dayName: string; timeStart: string; timeEnd: string;
  } | null>(null);
  const reduced = useReducedMotion();

  const transition = reduced ? instantTransition : springTransition;

  const goToForm = () => {
    setDirection("forward");
    setView("form");
  };

  const goBack = () => {
    setDirection("back");
    setView("timeslot");
  };

  const goToSuccess = (slot: { date: string; dayName: string; timeStart: string; timeEnd: string }) => {
    setBookedSlot(slot);
    setDirection("forward");
    setView("success");
  };

  return (
    <>
      <motion.div
        layout
        transition={transition}
        className="relative w-[411px] overflow-hidden rounded-[30px] border border-ditto-grey-50 bg-white shadow-[0px_4px_13px_0px_rgba(0,0,0,0.03)]"
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {view === "timeslot" && (
            <motion.div
              key="timeslot"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-[411px]"
            >
              <TimeslotView
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onScheduleClick={goToForm}
                onPickSlots={() => setDrawerOpen(true)}
                earliestDate={earliestDate}
              />
            </motion.div>
          )}
          {view === "form" && (
            <motion.div
              key="form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-[411px]"
            >
              <BookingForm
                insuranceType={activeTab}
                selectedDate={formatDateDisplay(earliestDate)}
                selectedDayName={getDayName(earliestDate)}
                selectedTimeStart={EARLIEST_TIME}
                selectedTimeEnd={getSlotEndTime(EARLIEST_TIME)}
                showBackButton
                onBack={goBack}
                onSuccess={goToSuccess}
              />
            </motion.div>
          )}
          {view === "success" && (bookedSlot ? (
            <motion.div
              key="success"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-[411px]"
            >
              <SuccessView
                insuranceType={activeTab}
                bookedSlot={bookedSlot}
                onReschedule={goBack}
              />
            </motion.div>
          ) : <RedirectToTimeslot onRedirect={goBack} />)}
        </AnimatePresence>
      </motion.div>

      <MoreSlotsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeTab={activeTab}
        onScheduleSuccess={goToSuccess}
      />
    </>
  );
}

/* ─── Timeslot View ─── */

function TimeslotView({
  activeTab,
  onTabChange,
  onScheduleClick,
  onPickSlots,
  earliestDate,
}: {
  activeTab: InsuranceType;
  onTabChange: (tab: InsuranceType) => void;
  onScheduleClick: () => void;
  earliestDate: Date;
  onPickSlots: () => void;
}) {
  return (
    <>
      <div className="p-6">
        <div className="flex gap-2">
          <TabButton label="Health Insurance" active={activeTab === "health"} onClick={() => onTabChange("health")} />
          <TabButton label="Term Insurance" active={activeTab === "term"} onClick={() => onTabChange("term")} />
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-[21px] font-medium leading-tight tracking-tight text-ditto-black">
            Earliest Timeslot for {activeTab === "health" ? "Health" : "Term"} Insurance
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-ditto-yellow px-4 py-1.5">
            <Image src="/icons/lightning.png" alt="" width={25} height={25} />
            <span className="font-heading text-[17px] font-medium tracking-tight text-ditto-black">
              Quick Expert Guidance
            </span>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Image src="/icons/calendar-date.svg" alt="" width={20} height={20} />
            <span className="font-heading text-[15px] text-[#1a1a1a] opacity-70">
              {getDayName(earliestDate)}
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-medium tracking-tight text-[#2c2e30]">
            {formatDateDisplay(earliestDate)}
          </p>
        </div>

        <div className="my-5 border-t border-dashed border-ditto-grey-50" />

        <div>
          <div className="flex items-center gap-2">
            <Image src="/icons/clock-time.svg" alt="" width={20} height={20} />
            <span className="font-heading text-[15px] text-[#1a1a1a] opacity-70">Best Time</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <TimeDisplay time="1:00" period="PM" />
            <ArrowRight className="h-5 w-5 text-[#1a1a1a]" />
            <TimeDisplay time="1:30" period="PM" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6">
        <button
          onClick={onScheduleClick}
          className="flex h-[62px] w-full items-center justify-between rounded-[18px] bg-ditto-blue-dark px-6 font-heading text-xl font-medium text-white shadow-[0px_6px_12px_0px_rgba(30,37,75,0.06)] transition-colors hover:bg-ditto-blue-active"
        >
          <span>Schedule a Free Call</span>
          <Image src="/icons/phone-calendar.svg" alt="" width={21} height={20} />
        </button>
        <button
          onClick={onPickSlots}
          className="flex h-[62px] w-full items-center justify-between rounded-[18px] border border-ditto-grey-50 bg-white px-6 font-heading text-xl font-medium text-ditto-grey-600 shadow-[0px_4px_13px_0px_rgba(0,0,0,0.03)] transition-colors hover:bg-ditto-grey-100"
        >
          <span>Pick preferred time (30 slots)</span>
          <Image src="/icons/calendar-slot.svg" alt="" width={21} height={21} />
        </button>
      </div>
    </>
  );
}

/* ─── Success View ─── */

function SuccessView({
  insuranceType,
  bookedSlot,
  onReschedule,
}: {
  insuranceType: InsuranceType;
  bookedSlot: { date: string; dayName: string; timeStart: string; timeEnd: string };
  onReschedule: () => void;
}) {
  const label = insuranceType === "health" ? "Health" : "Term";
  const [timeVal, timePeriod] = bookedSlot.timeStart.split(" ");
  const [endVal, endPeriod] = bookedSlot.timeEnd.split(" ");

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Stamp */}
      <div className="mix-blend-multiply">
        <Image
          src="/images/stamp.png"
          alt={`Consultation booked for ${label} insurance`}
          width={124}
          height={124}
          className="-rotate-[10deg]"
        />
      </div>

      {/* Heading */}
      <h2 className="mt-4 text-center font-heading text-[26px] font-bold leading-tight tracking-tight text-[#33383b]">
        Insurance Advice
        <br />
        Scheduled!
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-[270px] text-center font-heading text-[17px] leading-[1.51] tracking-tight text-[#414141]">
        An advisor from Ditto will call you to discuss your insurance queries on
      </p>

      {/* Yellow date/time banner */}
      <div className="mt-6 flex h-[96px] w-full items-center rounded-[14px] border border-[#fff7ce] bg-ditto-yellow px-6">
        <div className="flex w-full gap-8">
          <div>
            <div className="flex items-center gap-1.5 opacity-70">
              <Image src="/icons/calendar-date.svg" alt="" width={18} height={18} className="-mt-1" />
              <span className="font-heading text-[14px] text-[#1a1a1a]">{bookedSlot.dayName}</span>
            </div>
            <p className="mt-1 font-heading text-[19px] font-medium text-[#2c2e30]">
              {bookedSlot.date}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 opacity-70">
              <Image src="/icons/clock-time.svg" alt="" width={18} height={18} className="-mt-0.5" />
              <span className="font-heading text-[14px] text-[#1a1a1a]">Timing</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-[19px] font-medium text-[#1a1a1a]">
                {timeVal} <sup className="text-[11px]">{timePeriod}</sup>
              </span>
              <span className="font-heading text-[20px] text-[#1a1a1a]">→</span>
              <span className="font-heading text-[19px] font-medium text-[#1a1a1a]">
                {endVal} <sup className="text-[11px]">{endPeriod}</sup>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Case Studies */}
      <button className="mt-8 flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl border border-[#efefef] bg-white shadow-[0px_3px_11px_0px_rgba(0,37,79,0.04)]">
        <Image src="/icons/list.svg" alt="" width={17} height={17} />
        <span className="font-heading text-[17px] font-medium text-[#1a1a1a]">
          View Case Studies
        </span>
      </button>

      {/* Reschedule */}
      <button
        onClick={onReschedule}
        className="mt-5 font-heading text-[17px] text-[#006ee4] underline"
      >
        Reschedule options
      </button>
    </div>
  );
}

/* ─── Redirect fallback (when ?step=success but no booked data) ─── */

function RedirectToTimeslot({ onRedirect }: { onRedirect: () => void }) {
  React.useEffect(() => { onRedirect(); }, [onRedirect]);
  return null;
}

/* ─── Helpers ─── */

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border-2 px-6 py-2.5 text-base font-semibold transition-all ${
        active
          ? "border-ditto-blue-active bg-ditto-blue-bg text-ditto-blue-active"
          : "border-ditto-grey-50 bg-white text-ditto-black hover:border-ditto-grey-400"
      }`}
    >
      {label}
    </button>
  );
}

function TimeDisplay({ time, period }: { time: string; period: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-heading text-2xl font-medium text-[#1a1a1a]">{time}</span>
      <span className="font-heading text-[13px] font-medium text-[#1a1a1a]">{period}</span>
    </div>
  );
}
