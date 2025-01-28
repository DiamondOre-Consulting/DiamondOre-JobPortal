
import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-4 text-gray-950 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-50",
      className
    )}
    {...props} />
));
Label.displayName = "Label";

export { Label };
