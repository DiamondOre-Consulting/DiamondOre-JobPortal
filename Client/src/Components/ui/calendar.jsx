import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-lg border border-slate-200 bg-white p-3 shadow-sm", className)}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        caption: cn("relative flex h-8 items-center justify-center px-8", defaultClassNames.caption),
        caption_label: cn("text-sm font-semibold text-slate-900", defaultClassNames.caption_label),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-8 items-center justify-between px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
          defaultClassNames.button_next
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("grid grid-cols-7", defaultClassNames.weekdays),
        weekday: cn("text-center text-[11px] font-medium text-slate-500", defaultClassNames.weekday),
        weeks: cn("mt-1 grid gap-1", defaultClassNames.weeks),
        week: cn("grid grid-cols-7 gap-1", defaultClassNames.week),
        day: cn("h-9 w-9 p-0 text-center text-sm", defaultClassNames.day),
        day_button: cn(
          "h-9 w-9 rounded-md p-0 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 aria-selected:bg-slate-900 aria-selected:text-white aria-selected:hover:bg-slate-900",
          defaultClassNames.day_button
        ),
        selected: cn(
          "bg-slate-900 text-white [&>button]:bg-slate-900 [&>button]:text-white [&>button:hover]:bg-slate-900 [&>button:hover]:text-white",
          defaultClassNames.selected
        ),
        today: cn("bg-slate-100 text-slate-900", defaultClassNames.today),
        outside: cn(
          "text-slate-300 opacity-70 [&>button]:text-slate-300",
          defaultClassNames.outside
        ),
        disabled: cn("cursor-not-allowed text-slate-300 opacity-60", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        range_middle: cn(
          "bg-slate-100 text-slate-900 [&>button]:bg-slate-100 [&>button]:text-slate-900",
          defaultClassNames.range_middle
        ),
        range_start: cn(
          "bg-slate-900 text-white [&>button]:bg-slate-900 [&>button]:text-white",
          defaultClassNames.range_start
        ),
        range_end: cn(
          "bg-slate-900 text-white [&>button]:bg-slate-900 [&>button]:text-white",
          defaultClassNames.range_end
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", iconClassName)} {...chevronProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", iconClassName)} {...chevronProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
