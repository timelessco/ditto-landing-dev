"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Flame, ChevronDown, ChevronUp, Info, Check } from "lucide-react";

/* ─── Types ─── */

type Gender = "male" | "female";
type YesNo = "yes" | "no";
type Education = "under-graduate" | "graduate" | "post-graduate";
type Employment = "salaried" | "self-employed";
type Income =
  | "0"
  | "3,00,000"
  | "5,00,000"
  | "7,00,000"
  | "10,00,000"
  | "12,00,000"
  | "15,00,000"
  | "20,00,000"
  | "25,00,000"
  | "50,00,000"
  | "1,00,00,000";

interface FormValues {
  gender: Gender;
  age: number;
  nri: YesNo;
  tobacco: YesNo;
  coverYears: number;
  coverAmount: number;
  education: Education;
  employment: Employment;
  pincode: string;
  income: Income;
}

const defaults: FormValues = {
  gender: "male",
  age: 23,
  nri: "no",
  tobacco: "no",
  coverYears: 75,
  coverAmount: 2.5,
  education: "under-graduate",
  employment: "salaried",
  pincode: "",
  income: "12,00,000",
};

const EDUCATION_OPTIONS: { value: Education; label: string }[] = [
  { value: "under-graduate", label: "Under Graduate" },
  { value: "graduate", label: "Graduate" },
  { value: "post-graduate", label: "Post Graduate" },
];

const EMPLOYMENT_OPTIONS: { value: Employment; label: string }[] = [
  { value: "salaried", label: "Salaried" },
  { value: "self-employed", label: "Self-Employed" },
];

const INCOME_OPTIONS: Income[] = [
  "3,00,000",
  "5,00,000",
  "7,00,000",
  "10,00,000",
  "12,00,000",
  "15,00,000",
  "20,00,000",
  "25,00,000",
  "50,00,000",
  "1,00,00,000",
];

const AGE_MIN = 18;
const AGE_MAX = 65;
const COVER_YEARS_MIN = 18;
const COVER_YEARS_MAX = 100;
const COVER_AMOUNT_MIN = 0.5;
const COVER_AMOUNT_MAX = 3;

/* ─── Main Component ─── */

type Status = "idle" | "loading" | "results";

const INCOME_LIMIT_CR = 5; // Demo rule: cover > 5Cr triggers income-exceeds error
const VALID_PINCODE = /^\d{6}$/;

export function TermCalculator() {
  const [values, setValues] = useState<FormValues>(defaults);
  const [status, setStatus] = useState<Status>("idle");
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [incomeError, setIncomeError] = useState<string | null>(null);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const pincodeValid = VALID_PINCODE.test(values.pincode);
  const canSubmit = pincodeValid && !pincodeError && !incomeError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    let hasError = false;
    if (!pincodeValid) {
      setPincodeError("Enter a valid 6-digit pincode");
      hasError = true;
    }
    // Demo: income check fails when coverAmount exceeds what income can support
    const incomeNum = parseInt(values.income.replace(/,/g, ""), 10);
    const maxCoverCr = (incomeNum * 25) / 10000000; // 25x rule
    if (values.coverAmount > maxCoverCr) {
      setIncomeError("Annual income exceeds allowed limit");
      hasError = true;
    }
    if (hasError) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("results");
      setTimeout(() => {
        document.getElementById("result-card")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }, 1200);
  };

  // Reset on any change after submit
  useEffect(() => {
    if (status !== "idle") setStatus("idle");
    setPincodeError(null);
    setIncomeError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.gender,
    values.age,
    values.nri,
    values.tobacco,
    values.coverYears,
    values.coverAmount,
    values.education,
    values.employment,
    values.income,
    values.pincode,
  ]);

  const sharedProps = {
    values,
    set,
    status,
    pincodeError,
    incomeError,
    setPincodeError,
    setIncomeError,
    handleSubmit,
    canSubmit,
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-16">
      {/* Mobile lock-in banner (only mobile) */}
      <div className="flex items-center justify-center gap-1.5 px-4 pb-2 pt-5 lg:hidden">
        <Flame className="h-[14px] w-[14px] text-[#f56301]" fill="#f56301" strokeWidth={1.5} />
        <span className="font-heading text-[13px] font-medium tracking-tight text-[#f56301]">
          Lock in before the price hike.
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1300px] px-4 lg:px-[140px] lg:pt-10">
        <h1 className="font-heading text-[18px] font-semibold tracking-tight text-[#2e2e30] lg:text-[26px]">
          Term Insurance Premium Calculator
        </h1>

        {/* Mobile view */}
        <div className="lg:hidden">
          <MobileCalculator {...sharedProps} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 hidden flex-col gap-5 lg:mt-6 lg:flex lg:flex-row lg:items-start lg:gap-10"
        >
          {/* ── Left: Calculator Form ── */}
          <div className="relative w-full overflow-hidden rounded-[24px] border border-white bg-[rgba(255,255,255,0.94)] p-5 backdrop-blur-[26px] lg:w-[621px] lg:rounded-[36px] lg:p-0">
            <div className="lg:px-[38px] lg:pt-[30px] lg:pb-[30px]">
              {/* Orange pill */}
              <div className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#fff8f3] px-2 py-1.5">
                <Flame className="h-[15px] w-[15px] text-[#f56301]" fill="#f56301" strokeWidth={1.5} />
                <span className="font-heading text-[14px] font-medium tracking-tight text-[#f56301] lg:text-[16px]">
                  Lock in before the price hike
                </span>
              </div>

              <p className="mt-3.5 font-heading text-[17px] font-medium tracking-tight text-[#2e2e30] lg:mt-3.5 lg:text-[20px]">
                Fill in details to calculate your term premium.
              </p>

              <Divider className="mt-5 lg:mt-5" />

              {/* Gender + Age */}
              <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2 lg:gap-x-[44px] lg:pt-5">
                <FieldBlock label="Gender">
                  <RadioGroup
                    name="gender"
                    value={values.gender}
                    onChange={(v) => set("gender", v as Gender)}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
                </FieldBlock>
                <FieldBlock label="Age" info>
                  <NumberStepper
                    value={values.age}
                    min={AGE_MIN}
                    max={AGE_MAX}
                    unit="years"
                    onChange={(v) => set("age", v)}
                  />
                </FieldBlock>
              </div>

              <Divider className="mt-6" />

              {/* NRI + Tobacco */}
              <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2 lg:gap-x-[44px]">
                <FieldBlock label="Are you an NRI?">
                  <RadioGroup
                    name="nri"
                    value={values.nri}
                    onChange={(v) => set("nri", v as YesNo)}
                    options={[
                      { value: "no", label: "No" },
                      { value: "yes", label: "Yes" },
                    ]}
                  />
                </FieldBlock>
                <FieldBlock label="Consume tobacco?">
                  <RadioGroup
                    name="tobacco"
                    value={values.tobacco}
                    onChange={(v) => set("tobacco", v as YesNo)}
                    options={[
                      { value: "no", label: "No" },
                      { value: "yes", label: "Yes" },
                    ]}
                  />
                </FieldBlock>
              </div>

              <Divider className="mt-6" />

              {/* Cover upto + Cover Amount (sliders) */}
              <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2 lg:gap-x-[44px]">
                <div>
                  <div className="flex items-center justify-between">
                    <LabelWithInfo label="Cover upto" />
                    <ValuePill>{values.coverYears} Years</ValuePill>
                  </div>
                  <div className="mt-3">
                    <Slider
                      value={values.coverYears}
                      min={COVER_YEARS_MIN}
                      max={COVER_YEARS_MAX}
                      step={1}
                      onChange={(v) => set("coverYears", v)}
                    />
                  </div>
                  {values.coverYears > 65 && (
                    <div className="mt-3 rounded-[10px] bg-[#fefbeb] px-3 py-3">
                      <p className="font-heading text-[12px] font-medium leading-[1.33] tracking-[0.24px] text-[#30302e]">
                        Coverage should last until dependents need support (around 65&ndash;70). Beyond that may be unnecessary
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <LabelWithInfo label="Cover Amount" />
                    <ValuePill>₹ {formatCover(values.coverAmount)}</ValuePill>
                  </div>
                  <div className="mt-3">
                    <Slider
                      value={values.coverAmount}
                      min={COVER_AMOUNT_MIN}
                      max={COVER_AMOUNT_MAX}
                      step={0.25}
                      onChange={(v) => set("coverAmount", v)}
                    />
                  </div>
                </div>
              </div>

              <Divider className="mt-6" />

              {/* Education + Employment */}
              <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2 lg:gap-x-[44px]">
                <FieldBlock label="Education">
                  <Select
                    value={values.education}
                    onChange={(v) => set("education", v as Education)}
                    options={EDUCATION_OPTIONS}
                  />
                </FieldBlock>
                <FieldBlock label="Employment Type">
                  <Select
                    value={values.employment}
                    onChange={(v) => set("employment", v as Employment)}
                    options={EMPLOYMENT_OPTIONS}
                  />
                </FieldBlock>
              </div>

              <Divider className="mt-6" />

              {/* Pincode + Annual Income */}
              <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2 lg:gap-x-[44px]">
                <FieldBlock label="Pincode" info>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={values.pincode}
                    onChange={(e) =>
                      set("pincode", e.target.value.replace(/[^\d]/g, "").slice(0, 6))
                    }
                    placeholder="560012"
                    className={`h-[38px] w-full rounded-[9px] border bg-[#fbfbfb] px-3.5 font-heading text-[15px] font-medium text-[#2e2e30] outline-none transition-colors lg:h-[34px] ${
                      pincodeError
                        ? "border-[#ef4c4c] focus:border-[#ef4c4c]"
                        : "border-[#e5e5e5] focus:border-ditto-blue"
                    }`}
                  />
                  {pincodeError && (
                    <p className="mt-1.5 font-heading text-[12px] font-medium text-[#ef4c4c]">
                      {pincodeError}
                    </p>
                  )}
                </FieldBlock>
                <FieldBlock label="Annual Income" info>
                  <IncomeSelect
                    value={values.income}
                    onChange={(v) => set("income", v)}
                    hasError={!!incomeError}
                  />
                  {incomeError && (
                    <p className="mt-1.5 font-heading text-[12px] font-medium text-[#ef4c4c]">
                      {incomeError}
                    </p>
                  )}
                </FieldBlock>
              </div>

              {/* Captcha + CTA row */}
              <div className="mt-6 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <CloudflareMock />
                <button
                  type="submit"
                  disabled={!canSubmit || status === "loading"}
                  className={`flex h-[52px] w-full items-center justify-center rounded-[14px] font-heading text-[17px] font-medium tracking-tight text-white transition-colors lg:h-[56px] lg:w-[253px] lg:text-[18px] ${
                    canSubmit && status !== "loading"
                      ? "bg-[#087bf6] hover:bg-[#005cc6]"
                      : "cursor-not-allowed bg-[#b7daff]"
                  }`}
                >
                  Get Premium Estimates
                </button>
              </div>

              {/* Disclaimer */}
              <p className="mt-4 font-heading text-[13px] leading-[1.5] text-[#2e2e30] lg:mt-5 lg:text-[14px]">
                <span className="font-semibold">Disclaimer:</span>{" "}
                <span className="text-[#555]">
                  Insurers set an upper limit to your coverage based on your income and education.
                </span>
              </p>
            </div>
          </div>

          {/* ── Right: Result / Empty State ── */}
          <div className="w-full lg:flex-1" id="result-card">
            {status === "idle" && <EmptyResultCard />}
            {status === "loading" && <LoadingResultCard />}
            {status === "results" && <MultiPlanResults values={values} />}
          </div>
        </form>

        {/* Insurer-Specific Calculators (desktop only; mobile shown inside MobileCalculator) */}
        <div className="hidden lg:block">
          <InsurerSpecificSection />
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Calculator (3-step accordion) ─── */

type SharedProps = {
  values: FormValues;
  set: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
  status: Status;
  pincodeError: string | null;
  incomeError: string | null;
  setPincodeError: (v: string | null) => void;
  setIncomeError: (v: string | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
};

function MobileCalculator(props: SharedProps) {
  const { values, set, status, pincodeError, incomeError, handleSubmit } = props;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completed, setCompleted] = useState<{ 1: boolean; 2: boolean; 3: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  // Range slider: coverUpto value is the target age; lower bound is current age
  const targetAge = Math.max(values.age, values.coverYears);

  const goNext = (from: 1 | 2) => {
    if (from === 1 && !/^\d{6}$/.test(values.pincode)) {
      props.setPincodeError("Invalid Pin Code");
      return;
    }
    setCompleted((p) => ({ ...p, [from]: true }));
    setStep((from + 1) as 1 | 2 | 3);
  };

  const activeStep = status === "loading" || status === "results" ? 0 : step;

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <MobileAccordion
        n={1}
        title="Basic info"
        open={activeStep === 1}
        edited={completed[1]}
        onEdit={() => setStep(1)}
      >
        <MobileFieldLabel icon={<PersonIcon />} label="Gender" />
        <div className="mt-2">
          <RadioGroup
            name="gender-m"
            value={values.gender}
            onChange={(v) => set("gender", v as Gender)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <MobileFieldLabel icon={<GlobeIcon />} label="NRI" />
            <div className="mt-2">
              <RadioGroup
                name="nri-m"
                value={values.nri}
                onChange={(v) => set("nri", v as YesNo)}
                options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]}
              />
            </div>
          </div>
          <div>
            <MobileFieldLabel icon={<SmokeIcon />} label="Consume Tobacco" />
            <div className="mt-2">
              <RadioGroup
                name="tobacco-m"
                value={values.tobacco}
                onChange={(v) => set("tobacco", v as YesNo)}
                options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <MobileFieldLabel icon={<PinIcon />} label="Age" />
            <input
              type="text"
              inputMode="numeric"
              value={`${values.age} years`}
              onChange={(e) => {
                const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                if (!isNaN(n)) set("age", Math.max(AGE_MIN, Math.min(AGE_MAX, n)));
              }}
              className="mt-2 h-[40px] w-full rounded-[9px] border border-[#e5e5e5] bg-[#fbfbfb] px-3 font-heading text-[14px] font-medium text-[#2e2e30] outline-none focus:border-ditto-blue"
            />
          </div>
          <div>
            <MobileFieldLabel icon={<PinIcon />} label="Pin Code" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={values.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="620017"
              className={`mt-2 h-[40px] w-full rounded-[9px] border bg-[#fbfbfb] px-3 font-heading text-[14px] font-medium text-[#2e2e30] outline-none focus:border-ditto-blue ${
                pincodeError ? "border-[#ef4c4c] focus:border-[#ef4c4c]" : "border-[#e5e5e5]"
              }`}
            />
            {pincodeError && (
              <p className="mt-1.5 font-heading text-[12px] font-medium text-[#ef4c4c]">{pincodeError}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goNext(1)}
          className="mt-5 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-ditto-blue font-heading text-[16px] font-medium text-white transition-colors hover:bg-ditto-blue-dark"
        >
          Next
        </button>
      </MobileAccordion>

      <MobileAccordion
        n={2}
        title="Cover details"
        open={activeStep === 2}
        edited={completed[2]}
        onEdit={() => setStep(2)}
      >
        <div className="flex items-center justify-between">
          <LabelWithInfo label="Cover Upto" />
          <ValuePill>{targetAge} years</ValuePill>
        </div>
        <div className="mt-3">
          <RangeSlider
            minValue={values.age}
            maxValue={targetAge}
            min={AGE_MIN}
            max={COVER_YEARS_MAX}
            onChangeMax={(v) => set("coverYears", v)}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="rounded-[8px] bg-[#f0f0f0] px-3 py-1 font-heading text-[13px] font-medium text-[#2e2e30]">
              {values.age} years
            </span>
            <span className="rounded-[8px] bg-[#f0f0f0] px-3 py-1 font-heading text-[13px] font-medium text-[#2e2e30]">
              {targetAge} years
            </span>
          </div>
        </div>

        {targetAge > 65 && (
          <div className="mt-4 rounded-[10px] bg-[#fefbeb] px-3 py-3">
            <p className="font-heading text-[12px] font-medium leading-[1.33] tracking-[0.24px] text-[#30302e]">
              Coverage should last until dependents need support (around 65&ndash;70). Beyond that may be unnecessary
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <LabelWithInfo label="Cover amount" />
          <ValuePill>₹{formatCover(values.coverAmount)}</ValuePill>
        </div>
        <div className="mt-3">
          <Slider
            value={values.coverAmount}
            min={COVER_AMOUNT_MIN}
            max={COVER_AMOUNT_MAX}
            step={0.25}
            onChange={(v) => set("coverAmount", v)}
          />
        </div>

        <button
          type="button"
          onClick={() => goNext(2)}
          className="mt-6 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-ditto-blue font-heading text-[16px] font-medium text-white transition-colors hover:bg-ditto-blue-dark"
        >
          Next
        </button>
      </MobileAccordion>

      <MobileAccordion
        n={3}
        title="Other info"
        open={activeStep === 3}
        edited={completed[3]}
        onEdit={() => setStep(3)}
      >
        <MobileFieldLabel icon={<BriefcaseIcon />} label="Employment type" />
        <div className="mt-2">
          <RadioGroup
            name="emp-m"
            value={values.employment}
            onChange={(v) => set("employment", v as Employment)}
            options={[
              { value: "salaried", label: "Salaried" },
              { value: "self-employed", label: "Self - employed" },
            ]}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <MobileFieldLabel icon={<RupeeIcon />} label="Annual Income" info />
            <div className="mt-2">
              <IncomeSelect
                value={values.income}
                onChange={(v) => set("income", v)}
                hasError={!!incomeError}
              />
            </div>
            {incomeError && (
              <p className="mt-1 font-heading text-[12px] font-medium text-[#ef4c4c]">Exceeds allowed limit</p>
            )}
          </div>
          <div>
            <MobileFieldLabel icon={<CapIcon />} label="Education" />
            <div className="mt-2">
              <Select
                value={values.education}
                onChange={(v) => set("education", v as Education)}
                options={EDUCATION_OPTIONS}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CloudflareMock />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`mt-4 flex h-[48px] w-full items-center justify-center rounded-[12px] font-heading text-[16px] font-medium text-white transition-colors ${
            status === "loading" ? "bg-[#b7daff]" : "bg-ditto-blue hover:bg-ditto-blue-dark"
          }`}
        >
          Get Premium Estimates
        </button>

        <p className="mt-4 font-heading text-[13px] leading-[1.45] text-[#2e2e30]">
          <span className="font-semibold">Disclaimer:</span>{" "}
          <span className="text-[#555]">
            Insurers set an upper limit to your coverage based on your income and education.
          </span>
        </p>
      </MobileAccordion>

      {/* Mobile result card */}
      <div id="result-card-mobile">
        {status === "idle" && <EmptyResultCard />}
        {status === "loading" && <LoadingResultCard />}
        {status === "results" && (
          <>
            <MultiPlanResults values={values} />
            <div className="mt-5 flex flex-col items-stretch gap-3">
              <p className="text-center font-heading text-[13px] text-[#2e2e30]">
                Our advisors will help you pick the right plan
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-ditto-blue font-heading text-[14px] font-medium text-white"
                >
                  Book a Free Call
                </button>
                <button
                  type="button"
                  className="flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#25d366] font-heading text-[14px] font-medium text-white"
                >
                  Whatsapp Us
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Insurer-Specific on mobile */}
      <InsurerSpecificSection />
    </form>
  );
}

function MobileAccordion({
  n,
  title,
  open,
  edited,
  onEdit,
  children,
}: {
  n: number;
  title: string;
  open: boolean;
  edited: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white">
      <button
        type="button"
        onClick={edited && !open ? onEdit : undefined}
        className="flex w-full items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-[22px] w-[22px] items-center justify-center rounded-full font-heading text-[12px] font-semibold text-white ${
              open ? "bg-ditto-blue" : "bg-ditto-blue"
            }`}
          >
            {n}
          </span>
          <span
            className={`font-heading text-[15px] font-medium ${
              open ? "text-[#2e2e30]" : "text-[#79787b]"
            }`}
          >
            {title}
          </span>
        </div>
        {edited && !open && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="#79787b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      {open && <div className="px-4 pb-5">{children}</div>}
    </div>
  );
}

function MobileFieldLabel({ icon, label, info }: { icon: React.ReactNode; label: string; info?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#79787b]">{icon}</span>
      <span className="font-heading text-[14px] font-medium text-[#2e2e30]">{label}</span>
      {info && <Info className="h-[13px] w-[13px] text-[#c7c7c8]" strokeWidth={2} />}
    </div>
  );
}

/* ─── Range Slider (mobile cover-upto) ─── */

function RangeSlider({
  minValue,
  maxValue,
  min,
  max,
  onChangeMax,
}: {
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  onChangeMax: (v: number) => void;
}) {
  const minPct = ((minValue - min) / (max - min)) * 100;
  const maxPct = ((maxValue - min) / (max - min)) * 100;
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-[16px] -translate-y-1/2 rounded-full bg-[#f0f0f0]" />
      <div
        className="absolute top-1/2 h-[17px] -translate-y-1/2 rounded-full bg-[#d5d5d5]"
        style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
      />
      {/* Min thumb (fixed / visual only) */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#cacaca] bg-[#f6f6f7] shadow-[0_1px_8px_rgba(0,0,0,0.18)]"
        style={{ left: `${minPct}%` }}
      />
      {/* Max thumb — controlled by range input */}
      <input
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={(e) => onChangeMax(parseInt(e.target.value, 10))}
        aria-label="Cover upto"
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#cacaca] [&::-moz-range-thumb]:bg-[#f6f6f7] [&::-moz-range-thumb]:shadow-[0_1px_8px_rgba(0,0,0,0.18)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#cacaca] [&::-webkit-slider-thumb]:bg-[#f6f6f7] [&::-webkit-slider-thumb]:shadow-[0_1px_8px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
}

/* ─── Mobile Inline Icons ─── */

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.75"/></svg>
  );
}
function SmokeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17h14v3H3zM17 17v3M20 13v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/><path d="M17 13c2-1 2-3 0-4s-2-3 0-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z" stroke="currentColor" strokeWidth="1.75"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75"/></svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.75"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.75"/></svg>
  );
}
function RupeeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4h12M6 8h12M8 4c4 0 6 2 6 5s-2 5-6 5h-2l8 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}
function CapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 10l10-5 10 5-10 5L2 10z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
  );
}

/* ─── Divider ─── */

function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-[#eee] ${className}`} />;
}

/* ─── FieldBlock ─── */

function FieldBlock({
  label,
  info,
  children,
}: {
  label: string;
  info?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <LabelWithInfo label={label} info={info} />
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function LabelWithInfo({ label, info }: { label: string; info?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-heading text-[16px] font-medium tracking-tight text-[#2e2e30] lg:text-[18px]">
        {label}
      </span>
      {info && (
        <button type="button" aria-label={`${label} info`}>
          <Info className="h-[15px] w-[15px] text-[#c7c7c8]" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ─── Radio ─── */

function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex items-center gap-5">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
                selected
                  ? "border-ditto-blue bg-ditto-blue"
                  : "border-[1.8px] border-[#d6d7d8] bg-white"
              }`}
            >
              {selected && <span className="h-[7.2px] w-[7.2px] rounded-full bg-white" />}
            </span>
            <span className="font-heading text-[15px] font-medium text-[#2e2e30] lg:text-[16px]">
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ─── Value Pill (for slider headers) ─── */

function ValuePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[34px] min-w-[84px] items-center justify-center rounded-[9px] border border-[#e5e5e5] bg-[#fbfbfb] px-3 font-heading text-[15px] font-medium text-[#2e2e30] lg:text-[16px]">
      {children}
    </span>
  );
}

/* ─── Slider ─── */

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-[18px] -translate-y-1/2 rounded-full bg-[#f5f5f5]" />
      <div
        className="absolute left-0 top-1/2 h-[19px] -translate-y-1/2 rounded-full bg-[#d5d5d5]"
        style={{ width: `${percent}%` }}
      />
      {/* Tick marks */}
      <div
        className="pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2"
        style={{
          left: "5%",
          right: "5%",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 22px)",
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label="Slider"
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#cacaca] [&::-moz-range-thumb]:bg-[#f6f6f7] [&::-moz-range-thumb]:shadow-[0_1px_8px_rgba(0,0,0,0.23)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-webkit-appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#cacaca] [&::-webkit-slider-thumb]:bg-[#f6f6f7] [&::-webkit-slider-thumb]:shadow-[0_1px_8px_rgba(0,0,0,0.23)]"
      />
      {/* Thumb tick marks */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[2px]"
        style={{ left: `${percent}%` }}
      >
        <span className="h-[1.5px] w-[10px] rounded-full bg-[#bababa]" />
        <span className="h-[1.5px] w-[10px] rounded-full bg-[#bababa]" />
      </span>
    </div>
  );
}

/* ─── Number Stepper (Age) ─── */

function NumberStepper({
  value,
  min,
  max,
  unit,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-[38px] w-full items-center justify-between rounded-[9px] border border-[#e5e5e5] bg-[#fbfbfb] px-3.5 lg:h-[34px]">
      <span className="font-heading text-[15px] font-medium text-[#2e2e30] lg:text-[16px]">
        {value} {unit}
      </span>
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="Increase"
          className="flex h-3 w-4 items-center justify-center text-[#555] transition-colors hover:text-[#000]"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label="Decrease"
          className="flex h-3 w-4 items-center justify-center text-[#555] transition-colors hover:text-[#000]"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Select ─── */

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex h-[38px] w-full items-center justify-between rounded-[9px] border border-[#e5e5e5] bg-[#fbfbfb] px-3.5 font-heading text-[15px] font-medium text-[#2e2e30] transition-colors hover:border-[#c7c7c8] lg:h-[34px] lg:text-[16px]"
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`h-5 w-5 text-[#555] transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left font-heading text-[15px] font-medium transition-colors hover:bg-[#f5f5f5] ${
                opt.value === value ? "text-ditto-blue" : "text-[#2e2e30]"
              }`}
            >
              {opt.label}
              {opt.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Income Select (with ₹) ─── */

function IncomeSelect({
  value,
  onChange,
  hasError,
}: {
  value: Income;
  onChange: (v: Income) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`flex h-[38px] w-full items-center justify-between rounded-[9px] border bg-[#fbfbfb] px-3.5 font-heading text-[15px] font-medium text-[#2e2e30] transition-colors lg:h-[34px] lg:text-[16px] ${
          hasError ? "border-[#ef4c4c]" : "border-[#e5e5e5] hover:border-[#c7c7c8]"
        }`}
      >
        <span>₹ {value}</span>
        <div className="flex flex-col">
          <ChevronUp className="h-3 w-4 text-[#555]" strokeWidth={2} />
          <ChevronDown className="-mt-0.5 h-3 w-4 text-[#555]" strokeWidth={2} />
        </div>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[260px] overflow-y-auto rounded-[10px] border border-[#e5e5e5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {INCOME_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left font-heading text-[15px] font-medium transition-colors hover:bg-[#f5f5f5] ${
                opt === value ? "text-ditto-blue" : "text-[#2e2e30]"
              }`}
            >
              ₹ {opt}
              {opt === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Empty Result Card ─── */

function EmptyResultCard() {
  return (
    <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[24px] border border-white bg-white px-6 py-10 backdrop-blur-[26px] lg:min-h-[316px] lg:rounded-[30px] lg:px-6 lg:py-[61px]">
      <div
        aria-hidden
        className="flex h-[108px] w-[108px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#ffeab3] to-[#ffc24e] shadow-[0_8px_20px_rgba(255,178,0,0.18)]"
      >
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="6" fill="#2a2a2a" />
          <rect x="14" y="12" width="36" height="10" rx="2" fill="#f6f6f6" />
          <text x="44" y="20" fontSize="8" fontFamily="ui-monospace" fontWeight="700" fill="#fff">%</text>
          <rect x="14" y="28" width="8" height="8" rx="2" fill="#444" />
          <rect x="26" y="28" width="8" height="8" rx="2" fill="#444" />
          <rect x="38" y="28" width="8" height="8" rx="2" fill="#ff8c1a" />
          <rect x="14" y="40" width="8" height="8" rx="2" fill="#444" />
          <rect x="26" y="40" width="8" height="8" rx="2" fill="#444" />
          <rect x="38" y="40" width="8" height="8" rx="2" fill="#444" />
        </svg>
      </div>
      <p className="mt-6 max-w-[283px] text-center font-sans text-[16px] leading-[1.41] text-[#79787b] lg:text-[19px]">
        Fill in the input fields to get your Term insurance premium
      </p>
    </div>
  );
}

/* ─── Premium Result Card ─── */

function PremiumResultCard({ values }: { values: FormValues }) {
  const premium = calculatePremium(values);
  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-[#f7f7f7] bg-white shadow-[0_4px_38px_rgba(0,0,0,0.03)] lg:rounded-[20px]">
      {/* Header plan block */}
      <div className="bg-[#f8fbfe] p-4 lg:m-[13px] lg:rounded-[13px] lg:p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-[8px] border-[1.5px] border-[#f4f8fc] bg-white">
            <span className="font-heading text-[11px] font-semibold text-[#066ce1]">HDFC</span>
          </div>
          <div className="flex-1">
            <p className="font-heading text-[16px] font-medium text-[#2e2e30] lg:text-[18px]">
              HDFC Life Click 2 Protect Life
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-heading text-[13px] text-[#79787b] lg:text-[14px]">Base plan</span>
              <span className="font-heading text-[15px] font-bold text-[#066ce1]">
                ₹{premium.toLocaleString("en-IN")}/yr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key offerings */}
      <div className="px-6 pb-6 pt-3 lg:px-[23px] lg:pb-[23px]">
        <p className="font-heading text-[15px] font-medium tracking-tight text-[#79787b] lg:text-[16px]">
          Key offerings
        </p>
        <ul className="mt-3 space-y-3">
          {[
            "Zero cost option available",
            "Option to increase your cover with inflation",
            "Claim settlement assistance by Ditto",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eefbf0]">
                <Check className="h-3 w-3 text-[#19a54a]" strokeWidth={3} />
              </span>
              <span className="font-heading text-[15px] text-[#2e2e30] lg:text-[17px]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Loading Result Card ─── */

function LoadingResultCard() {
  return (
    <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[24px] border border-white bg-white px-6 py-10 lg:min-h-[316px] lg:rounded-[30px] lg:px-6 lg:py-[61px]">
      <div
        aria-hidden
        className="flex h-[108px] w-[108px] animate-pulse items-center justify-center rounded-[20px] bg-gradient-to-br from-[#ffeab3] to-[#ffc24e] shadow-[0_8px_20px_rgba(255,178,0,0.18)]"
      >
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="6" fill="#2a2a2a" />
          <rect x="14" y="12" width="36" height="10" rx="2" fill="#f6f6f6" />
          <rect x="14" y="28" width="8" height="8" rx="2" fill="#444" />
          <rect x="26" y="28" width="8" height="8" rx="2" fill="#444" />
          <rect x="38" y="28" width="8" height="8" rx="2" fill="#ff8c1a" />
          <rect x="14" y="40" width="8" height="8" rx="2" fill="#444" />
          <rect x="26" y="40" width="8" height="8" rx="2" fill="#444" />
          <rect x="38" y="40" width="8" height="8" rx="2" fill="#444" />
        </svg>
      </div>
      <p className="mt-6 text-center font-sans text-[16px] leading-[1.41] text-[#79787b] lg:text-[19px]">
        Calculating your Term premium...
      </p>
    </div>
  );
}

/* ─── Multi-Plan Results ─── */

type Plan = {
  id: string;
  productLabel: string;
  name: string;
  logo: string;
  perYear: number;
  perMonth: number;
  offerings: string[];
};

function MultiPlanResults({ values }: { values: FormValues }) {
  const basePremium = calculatePremium(values);
  const plans: Plan[] = [
    {
      id: "axis",
      productLabel: "Axis Smart Life",
      name: "Smart Secure Plus",
      logo: "/logos/axis.png",
      perYear: basePremium + 1000,
      perMonth: Math.round((basePremium + 1000) / 12 / 10) * 10,
      offerings: ["Flexible rider coverage", "Adjust cover for inflation", "Zero cost option", "Delay 12 months Premium"],
    },
    {
      id: "hdfc",
      productLabel: "HDFC Life",
      name: "HDFC Life Click 2 Protect Life",
      logo: "/logos/hdfc.png",
      perYear: basePremium,
      perMonth: Math.round(basePremium / 12 / 10) * 10,
      offerings: ["Flexible rider coverage", "Adjust cover for inflation", "Zero cost option", "Delay 12 months Premium"],
    },
    {
      id: "icici",
      productLabel: "ICICI Prudential",
      name: "ICICI Prudential smart",
      logo: "/logos/icici.png",
      perYear: basePremium - 1000,
      perMonth: Math.round((basePremium - 1000) / 12 / 10) * 10,
      offerings: ["Free health benefits", "Offers salaried discounts", "Strong Claim settlement record"],
    },
  ];

  return (
    <div className="w-full rounded-[24px] bg-white p-4 shadow-[0_4px_38px_rgba(0,0,0,0.03)] lg:rounded-[30px] lg:p-[18px]">
      <p className="px-2 pt-1 font-heading text-[16px] font-medium text-[#2e2e30] lg:text-[17px]">
        Premium estimates - base plan (indicative)
      </p>
      <div className="mt-3 flex flex-col gap-4 lg:gap-5">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#eee] bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#f8fbfe] px-4 py-[14px]">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border border-[#f4f8fc] bg-white">
          <Image
            src={plan.logo}
            alt={plan.productLabel}
            width={28}
            height={28}
            className="h-[26px] w-auto object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[11px] text-[#555]">{plan.productLabel}</p>
          <p className="mt-[2px] truncate font-heading text-[16px] font-medium leading-tight tracking-[-0.32px] text-[#2e2e30]">
            {plan.name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-[15px] font-bold leading-none text-[#2e2e30]">
            ₹{plan.perYear.toLocaleString("en-IN")}/yr
          </p>
          <p className="mt-[3px] font-sans text-[11px] leading-none text-[#79787b]">
            ₹{plan.perMonth.toLocaleString("en-IN")}/mo
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-3">
        <p className="font-heading text-[13px] font-medium text-[#79787b]">Key offerings</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {plan.offerings.map((o) => (
            <span
              key={o}
              className="rounded-[8px] bg-[#f5f5f5] px-3 py-[7px] font-heading text-[12px] leading-tight text-[#2e2e30]"
            >
              {o}
            </span>
          ))}
        </div>

        <div className="mt-[14px] h-px w-full bg-[#eee]" />

        {/* Action buttons */}
        <div className="mt-3 flex gap-2.5">
          <button
            type="button"
            className="flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[11px] border border-[#dff0ff] bg-[#eef5fb] font-heading text-[14px] font-medium text-[#005cc6] transition-colors hover:bg-[#dfeaf7]"
          >
            Plan Details
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            type="button"
            className="flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[11px] bg-[#087bf6] font-heading text-[14px] font-medium text-white transition-colors hover:bg-[#005cc6]"
          >
            Buy Now
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 3h2l1.5 8h7l1.5-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="13.5" r="1" fill="currentColor"/>
              <circle cx="12" cy="13.5" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Cloudflare Captcha Mock ─── */

function CloudflareMock() {
  return (
    <div className="relative h-[63px] w-[265px] max-w-full overflow-hidden rounded-[6px]">
      <Image src="/logos/cloudflare-captcha.png" alt="Cloudflare captcha" fill className="object-contain object-left" />
    </div>
  );
}

/* ─── Insurer-Specific Calculators ─── */

function InsurerSpecificSection() {
  const items = [
    { id: "hdfc", label: "HDFC Term Insurance Premium Calculator", logo: "/logos/hdfc.png" },
    { id: "icici", label: "ICICI Term Insurance Premium Calculator", logo: "/logos/icici.png" },
    { id: "axis", label: "Axis Term Insurance Premium Calculator", logo: "/logos/axis.png" },
  ];
  return (
    <div className="mt-10 w-full lg:mt-12 lg:w-[621px]">
      <h2 className="font-heading text-[18px] font-semibold tracking-tight text-[#17191c] lg:text-[20px]">
        Insurer-Specific Term Insurance Calculators
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className="flex items-center gap-3 rounded-[16px] border border-[#eee] bg-white px-4 py-4 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
          >
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] border border-[#f4f8fc] bg-white">
              <Image src={item.logo} alt="" width={24} height={24} className="h-[22px] w-auto object-contain" />
            </span>
            <span className="flex-1 font-heading text-[15px] font-medium text-[#2e2e30] lg:text-[16px]">
              {item.label}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#2e2e30" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function formatCover(cr: number): string {
  if (cr < 1) return `${Math.round(cr * 100)}L`;
  return `${cr}Cr`;
}

function calculatePremium(v: FormValues): number {
  // Dummy calculation — replace with real pricing API
  const base = 8000;
  const ageFactor = 1 + Math.max(0, v.age - 25) * 0.04;
  const coverFactor = 1 + v.coverAmount * 0.35;
  const yearsFactor = 1 + (v.coverYears - 60) * 0.015;
  const genderFactor = v.gender === "male" ? 1.08 : 1.0;
  const tobaccoFactor = v.tobacco === "yes" ? 1.6 : 1.0;
  return Math.round(
    (base * ageFactor * coverFactor * yearsFactor * genderFactor * tobaccoFactor) / 10
  ) * 10;
}
