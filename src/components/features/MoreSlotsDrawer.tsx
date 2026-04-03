"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import {
  getNextSixDays,
  formatDateDisplay,
  getDayAbbreviation,
  getDayName,
  isSlotInPast,
  getSlotEndTime,
} from "@/lib/date-utils";

/* ─── Slot Data (hardcoded, 10 per section) ─── */

const MORNING_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
];

const AFTERNOON_SLOTS = [
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

const EVENING_SLOTS = [
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM",
  "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
];

/* ─── Props ─── */

interface MoreSlotsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "health" | "term";
  onScheduleSuccess?: (slot: { date: string; dayName: string; timeStart: string; timeEnd: string }) => void;
}

/* ─── Component ─── */

export function MoreSlotsDrawer({ open, onOpenChange, activeTab, onScheduleSuccess }: MoreSlotsDrawerProps) {
  const dates = getNextSixDays();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDate = dates[selectedDateIndex];

  const handleDateChange = (index: number) => {
    setSelectedDateIndex(index);
    setSelectedTime(null);
  };

  const handleSuccess = (slot: { date: string; dayName: string; timeStart: string; timeEnd: string }) => {
    onOpenChange(false);
    setSelectedTime(null);
    setSelectedDateIndex(0);
    onScheduleSuccess?.(slot);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-h-[90vh] !w-[calc(100vw-400px)] !min-w-[1000px] !max-w-none sm:!max-w-none gap-0 overflow-hidden rounded-[24px] !ring-0 bg-[#fdfdfd] p-0 shadow-[0px_-5px_18px_rgba(92,102,110,0.05),0px_3px_35px_rgba(92,102,110,0.04),0px_30px_40px_rgba(92,102,110,0.18)]">
        <DialogDescription className="sr-only">
          Pick a preferred time slot for your insurance consultation call.
        </DialogDescription>

        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[#eef0f2] px-9 py-6">
          <DialogTitle className="font-heading text-[22px] font-medium tracking-tight text-[#1f2127]">
            More Slots
          </DialogTitle>
          <DialogClose
            render={
              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#f9f9f9] transition-colors hover:bg-[#eee]"
                aria-label="Close"
              />
            }
          >
            <X className="h-5 w-5 text-[#1f2127]" />
          </DialogClose>
        </DialogHeader>

        {/* Two-panel layout */}
        <div className="flex overflow-hidden">
          {/* Left panel — slot picker */}
          <div className="flex-1 overflow-y-auto px-10 py-10">
            {/* Date row */}
            <div className="flex gap-3">
              {dates.map((date, i) => (
                <DatePill
                  key={i}
                  label={getDayAbbreviation(date, i === 0)}
                  dayNumber={date.getDate()}
                  selected={i === selectedDateIndex}
                  onClick={() => handleDateChange(i)}
                />
              ))}
            </div>

            <p className="mt-8 font-heading text-[18px] text-[#1f2127]">
              What time works for you?
            </p>

            <SlotSection icon="/icons/sunrise.svg" label="Morning" slots={MORNING_SLOTS} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={setSelectedTime} />
            <SlotSection icon="/icons/sun-afternoon.svg" label="Afternoon" slots={AFTERNOON_SLOTS} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={setSelectedTime} />
            <SlotSection icon="/icons/sunset.svg" label="Evening" slots={EVENING_SLOTS} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={setSelectedTime} />

            <p className="mt-8 text-[14px] leading-relaxed text-[#7b838c]">
              Average call usually lasts 30 minutes.
              <br />
              That is enough time to get all your queries addressed.
            </p>
          </div>

          {/* Right panel — form card */}
          <div className="m-10 w-[411px] shrink-0 self-start overflow-y-auto rounded-[30px] border border-[#fbfbfb] bg-white shadow-[0px_4px_13px_0px_rgba(0,0,0,0.03)]">
            <BookingForm
              insuranceType={activeTab}
              selectedDate={formatDateDisplay(selectedDate)}
              selectedDayName={getDayName(selectedDate)}
              selectedTimeStart={selectedTime ?? "—"}
              selectedTimeEnd={selectedTime ? getSlotEndTime(selectedTime) : "—"}
              submitDisabled={!selectedTime}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Date Pill ─── */

function DatePill({
  label,
  dayNumber,
  selected,
  onClick,
}: {
  label: string;
  dayNumber: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[63px] w-[65px] flex-col items-center justify-center rounded-[12px] transition-all ${
        selected
          ? "bg-[#1f2127] text-white shadow-[0px_1px_3px_rgba(0,0,0,0.08),0px_6px_9px_rgba(0,0,0,0.04)]"
          : "border border-[#e3e7ed] bg-white text-[#1f2127] shadow-[0px_1px_3px_rgba(0,0,0,0.08),0px_6px_9px_rgba(0,0,0,0.04)] hover:bg-[#f5f5f5]"
      }`}
    >
      <span className={`text-[11px] ${selected ? "text-white" : "text-[#a9adb7]"}`}>
        {label}
      </span>
      <span className="font-heading text-[21px] font-medium tracking-tight">
        {dayNumber}
      </span>
    </button>
  );
}

/* ─── Slot Section ─── */

function SlotSection({
  icon,
  label,
  slots,
  selectedDate,
  selectedTime,
  onSelect,
}: {
  icon: string;
  label: string;
  slots: string[];
  selectedDate: Date;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5">
        <Image src={icon} alt="" width={18} height={18} />
        <span className="font-heading text-[15px] text-[#6c7680]">{label}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {slots.map((slot) => {
          const disabled = isSlotInPast(selectedDate, slot);
          const active = selectedTime === slot;
          return (
            <button
              key={slot}
              disabled={disabled}
              onClick={() => onSelect(slot)}
              className={`flex h-[30px] w-[80px] items-center justify-center rounded-[10.6px] text-[13px] transition-all ${
                active
                  ? "bg-[#1f2127] font-medium text-white"
                  : disabled
                    ? "cursor-not-allowed bg-[#f8f8f8] text-[#b2b2b2]"
                    : "border border-[#e3e7ed] bg-white text-[#1f2127] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#f5f5f5]"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
