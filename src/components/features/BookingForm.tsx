"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

/* ─── Schema ─── */

const scheduleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(10, "Enter a valid phone number")
    .regex(/^\d+$/, "Only digits allowed"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email"
    ),
  note: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

/* ─── Props ─── */

interface BookingFormProps {
  insuranceType: "health" | "term";
  selectedDate: string;
  selectedDayName: string;
  selectedTimeStart: string;
  selectedTimeEnd: string;
  onSuccess?: (slot: { date: string; dayName: string; timeStart: string; timeEnd: string }) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  submitDisabled?: boolean;
}

/* ─── Component ─── */

export function BookingForm({
  insuranceType,
  selectedDate,
  selectedDayName,
  selectedTimeStart,
  selectedTimeEnd,
  onSuccess,
  showBackButton,
  onBack,
  submitDisabled,
}: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { name: "", phone: "", email: "", note: "" },
  });

  useEffect(() => {
    const t = setTimeout(() => setFocus("name"), 350);
    return () => clearTimeout(t);
  }, [setFocus]);

  const onSubmit = (data: ScheduleFormData) => {
    console.log("Schedule call:", {
      ...data,
      insuranceType,
      date: selectedDate,
      time: `${selectedTimeStart} - ${selectedTimeEnd}`,
    });
    toast.success("Call scheduled!", {
      description: `${selectedDate} at ${selectedTimeStart}`,
    });
    onSuccess?.({
      date: selectedDate,
      dayName: selectedDayName,
      timeStart: selectedTimeStart,
      timeEnd: selectedTimeEnd,
    });
    reset();
  };

  const insuranceLabel = insuranceType === "health" ? "Health" : "Term";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 lg:p-6" noValidate>
      {/* Back link */}
      {showBackButton && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-[14px] text-[#5F5F5F] transition-opacity hover:opacity-70"
        >
          <Image src="/icons/arrow-back.svg" alt="" width={12} height={11} className="-translate-y-[1.5px]" />
          <span className="font-heading">Go back</span>
        </button>
      )}

      {/* Yellow summary banner */}
      <div className="relative overflow-hidden rounded-[16px] border border-[#fff7ce] bg-ditto-yellow px-5 pb-5 pt-5">
        <Image
          src="/icons/lightning-large.png"
          alt=""
          width={92}
          height={92}
          className="absolute right-0 top-0"
        />
        <h3 className="relative z-10 text-[18px] font-semibold leading-tight tracking-tight text-[#33383b] lg:text-[20px]">
          {insuranceLabel} Insurance Advice
        </h3>
        <div className="relative z-10 mt-4 flex gap-4 sm:gap-8">
          <div>
            <div className="flex items-center gap-1.5">
              <Image src="/icons/calendar-date.svg" alt="" width={16} height={16} className="shrink-0 lg:h-[18px] lg:w-[18px]" />
              <span className="font-heading text-[13px] leading-none text-[#646259] lg:text-[14px] lg:text-[#1a1a1a] lg:opacity-70">{selectedDayName}</span>
            </div>
            <p className="mt-1 font-heading text-[17px] font-medium text-[#2c2e30] lg:text-[19px]">
              {selectedDate}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Image src="/icons/clock-time.svg" alt="" width={16} height={16} className="shrink-0 lg:h-[18px] lg:w-[18px]" />
              <span className="font-heading text-[13px] leading-none text-[#646259] lg:text-[14px] lg:text-[#1a1a1a] lg:opacity-70">Time</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <TimePart value={selectedTimeStart} />
              <span className="font-heading text-[18px] text-[#1a1a1a] lg:text-[20px]">→</span>
              <TimePart value={selectedTimeEnd} />
            </div>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="mt-5 flex flex-col gap-[14px]">
        <FormField fieldId="field-name" icon={<Image src="/icons/user.svg" alt="" width={20} height={20} />} error={errors.name?.message}>
          <input
            {...register("name")}
            id="field-name"
            aria-label="Full name"
            aria-describedby={errors.name ? "field-name-error" : undefined}
            aria-invalid={!!errors.name}
            placeholder="Enter your Name"
            className="w-full bg-transparent font-heading text-base text-[#222223] placeholder:text-[#999] focus:outline-none"
          />
        </FormField>

        <FormField fieldId="field-phone" prefix={"+91\u00a0-\u00a0"} icon={<Image src="/icons/mobile-phone.svg" alt="" width={18} height={20} />} error={errors.phone?.message}>
          <input
            {...register("phone")}
            id="field-phone"
            aria-label="Phone number"
            aria-describedby={errors.phone ? "field-phone-error" : undefined}
            aria-invalid={!!errors.phone}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Mobile Number"
            className="w-full bg-transparent font-heading text-base text-[#222223] placeholder:text-[#999] focus:outline-none"
          />
        </FormField>

        <FormField fieldId="field-email" icon={<Image src="/icons/email.svg" alt="" width={20} height={20} />} error={errors.email?.message}>
          <input
            {...register("email")}
            id="field-email"
            aria-label="Email address"
            aria-describedby={errors.email ? "field-email-error" : undefined}
            aria-invalid={!!errors.email}
            type="email"
            placeholder="Email Address"
            className="w-full bg-transparent font-heading text-base text-[#222223] placeholder:text-[#999] focus:outline-none"
          />
        </FormField>

        <div>
          <div className="overflow-hidden rounded-[14px] border-[1.5px] border-[#eeeeef]">
            <textarea
              {...register("note")}
              aria-label="Additional notes"
              placeholder="Enter your query"
              className="h-[80px] w-full resize-none bg-white px-4 py-3.5 font-heading text-base text-[#222223] placeholder:text-[#999] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-5">
        <button
          type="submit"
          disabled={isSubmitting || submitDisabled}
          className="flex h-[62px] w-full items-center justify-between rounded-[18px] bg-ditto-blue-dark px-6 font-heading text-xl font-medium text-white shadow-[0px_6px_12px_0px_rgba(30,37,75,0.06)] transition-colors hover:bg-ditto-blue-active disabled:opacity-50"
        >
          <span>Schedule a Free Call</span>
          <Image src="/icons/phone-calendar.svg" alt="" width={21} height={20} />
        </button>
      </div>
    </form>
  );
}

/* ─── FormField Helper ─── */

function FormField({
  children,
  icon,
  prefix,
  error,
  fieldId,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  prefix?: string;
  error?: string;
  fieldId: string;
}) {
  return (
    <div className="relative">
      <div
        className={`flex items-center overflow-hidden rounded-[14px] border-[1.5px] transition-colors ${
          error ? "border-red-400" : "border-[#eeeeef]"
        }`}
      >
        <div className="flex flex-1 items-center px-4 py-3.5">
          {prefix && (
            <span className="shrink-0 whitespace-nowrap font-heading text-base font-medium text-[#222223]">
              {prefix}
            </span>
          )}
          {children}
        </div>
        <div className="px-4">{icon}</div>
      </div>
      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          aria-live="assertive"
          className="absolute bottom-[-14px] left-4 text-[10px] leading-none text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function TimePart({ value }: { value: string }) {
  const parts = value.split(" ");
  if (parts.length < 2) {
    return <span className="font-heading text-[17px] font-medium text-[#1a1a1a] lg:text-[19px]">{value}</span>;
  }
  return (
    <span className="font-heading text-[17px] font-medium text-[#1a1a1a] lg:text-[19px]">
      {parts[0]} <sup className="text-[11px]">{parts[1]}</sup>
    </span>
  );
}
