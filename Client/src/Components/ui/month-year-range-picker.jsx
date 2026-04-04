"use client"

import * as React from "react"
import { CalendarRange, ChevronDown, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

const formatRangeLabel = ({ value, monthNames }) => {
  const { fromMonth, fromYear, toMonth, toYear } = value

  const fromLabel =
    fromMonth && fromYear ? `${monthNames[fromMonth]} ${fromYear}` : null
  const toLabel = toMonth && toYear ? `${monthNames[toMonth]} ${toYear}` : null

  if (fromLabel && toLabel) {
    return `${fromLabel} - ${toLabel}`
  }

  if (fromLabel) {
    return `From ${fromLabel}`
  }

  if (toLabel) {
    return `Until ${toLabel}`
  }

  return "Filter by month range"
}

const formatSideLabel = ({ month, year, monthNames }) => {
  if (month && year) {
    return `${monthNames[month]} ${year}`
  }

  return "Not set"
}

const MonthYearRangePicker = ({
  value,
  years,
  monthNames,
  onChange,
  onApply,
  onReset,
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const hasActiveRange = Boolean(
    value.fromMonth || value.fromYear || value.toMonth || value.toYear
  )
  const rangeLabel = formatRangeLabel({ value, monthNames })
  const monthOptions = Object.entries(monthNames).map(([monthValue, monthLabel]) => ({
    monthValue: Number(monthValue),
    monthLabel,
    shortLabel: monthLabel.slice(0, 3),
  }))

  const setFieldValue = (field, nextValue) => {
    onChange?.(field, nextValue)
  }

  const clearSide = (side) => {
    if (side === "from") {
      setFieldValue("fromMonth", "")
      setFieldValue("fromYear", "")
      return
    }

    setFieldValue("toMonth", "")
    setFieldValue("toYear", "")
  }

  const handleApply = () => {
    const shouldClose = onApply?.()

    if (shouldClose !== false) {
      setOpen(false)
    }
  }

  const handleReset = () => {
    onReset?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 min-w-[280px] items-center justify-between gap-2 rounded-lg border border-slate-400 bg-white px-3 text-left text-sm shadow-sm shadow-slate-300/80 transition-colors hover:border-slate-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-0",
            className
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarRange className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-sm leading-5",
                  hasActiveRange ? "text-slate-900" : "text-slate-500"
                )}
              >
                {rangeLabel}
              </span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-500 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(92vw,680px)] overflow-hidden rounded-2xl border border-slate-400 shadow-xl p-0"
      >
        <div className="border-b border-slate-400 bg-gradient-to-r from-slate-100 via-white to-slate-50 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              Select a start and end month-year.
            </div>
            <div className="rounded-full border border-slate-400 bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm">
              {rangeLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-400 bg-white p-3.5 shadow-sm shadow-slate-300/60">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  From
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {formatSideLabel({
                    month: value.fromMonth,
                    year: value.fromYear,
                    monthNames,
                  })}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-400 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                onClick={() => clearSide("from")}
              >
                Clear
              </button>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-600">
                Year
              </label>
              <Select
                value={value.fromYear || "__all__"}
                onValueChange={(nextValue) =>
                  setFieldValue(
                    "fromYear",
                    nextValue === "__all__" ? "" : nextValue
                  )
                }
              >
                <SelectTrigger className="h-10 rounded-lg border-slate-400 text-[13px] focus:ring-blue-900">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={`from-year-${year}`} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3">
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-600">
                Month
              </label>
              <div className="grid grid-cols-4 gap-2">
                {monthOptions.map(({ monthValue, shortLabel }) => (
                  <button
                    key={`from-month-${monthValue}`}
                    type="button"
                    disabled={!value.fromYear}
                    onClick={() => setFieldValue("fromMonth", monthValue)}
                    className={cn(
                      "h-9 rounded-lg border text-[12px] font-medium transition-colors",
                      !value.fromYear &&
                        "cursor-not-allowed border-slate-400 bg-slate-100 text-slate-400",
                      value.fromYear &&
                        "border-slate-400 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50",
                      value.fromYear &&
                        Number(value.fromMonth) === monthValue &&
                        "border-blue-900 bg-blue-900 text-white hover:bg-blue-900"
                    )}
                  >
                    {shortLabel}
                  </button>
                ))}
              </div>
              {!value.fromYear && (
                <p className="mt-2 text-[11px] text-slate-500">
                  Pick a year first, then select a month.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-400 bg-white p-3.5 shadow-sm shadow-slate-300/60">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  To
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {formatSideLabel({
                    month: value.toMonth,
                    year: value.toYear,
                    monthNames,
                  })}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-400 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                onClick={() => clearSide("to")}
              >
                Clear
              </button>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-600">
                Year
              </label>
              <Select
                value={value.toYear || "__all__"}
                onValueChange={(nextValue) =>
                  setFieldValue("toYear", nextValue === "__all__" ? "" : nextValue)
                }
              >
                <SelectTrigger className="h-10 rounded-lg border-slate-400 text-[13px] focus:ring-blue-900">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={`to-year-${year}`} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3">
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-600">
                Month
              </label>
              <div className="grid grid-cols-4 gap-2">
                {monthOptions.map(({ monthValue, shortLabel }) => (
                  <button
                    key={`to-month-${monthValue}`}
                    type="button"
                    disabled={!value.toYear}
                    onClick={() => setFieldValue("toMonth", monthValue)}
                    className={cn(
                      "h-9 rounded-lg border text-[12px] font-medium transition-colors",
                      !value.toYear &&
                        "cursor-not-allowed border-slate-400 bg-slate-100 text-slate-400",
                      value.toYear &&
                        "border-slate-400 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50",
                      value.toYear &&
                        Number(value.toMonth) === monthValue &&
                        "border-blue-900 bg-blue-900 text-white hover:bg-blue-900"
                    )}
                  >
                    {shortLabel}
                  </button>
                ))}
              </div>
              {!value.toYear && (
                <p className="mt-2 text-[11px] text-slate-500">
                  Pick a year first, then select a month.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-400 bg-slate-50 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              {hasActiveRange
                ? "Apply to refresh the table from the server."
                : "No range selected. The table shows all goal sheet rows."}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-400 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-900 transition-colors hover:border-slate-500 hover:bg-slate-100"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
                onClick={handleApply}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MonthYearRangePicker
