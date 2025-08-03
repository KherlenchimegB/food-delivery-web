import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface OrderDatePickerProps {
  onDateRangeChange?: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
}

export const OrderDatePicker = ({
  onDateRangeChange,
}: OrderDatePickerProps) => {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (!date.from || (date.from && date.to)) {
      // First date selection or reset
      const newDate = {
        from: selectedDate,
        to: undefined,
      };
      setDate(newDate);
      onDateRangeChange?.(newDate);
    } else {
      // Second date selection
      const newDate = {
        from: date.from,
        to: selectedDate,
      };
      setDate(newDate);
      onDateRangeChange?.(newDate);
    }
  };

  const handleClear = () => {
    const newDate = {
      from: undefined,
      to: undefined,
    };
    setDate(newDate);
    onDateRangeChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date.from}
          selected={date}
          onSelect={(range) => {
            if (range?.from) {
              handleDateSelect(range.from);
            }
            if (range?.to) {
              handleDateSelect(range.to);
            }
          }}
          numberOfMonths={2}
        />
        <div className="flex justify-between p-3 border-t">
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" size="sm">
            This week
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
