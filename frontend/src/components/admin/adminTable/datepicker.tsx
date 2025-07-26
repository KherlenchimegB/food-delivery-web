import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { isSameDay } from "date-fns";
import { DayMouseEventHandler, DayPicker } from "react-day-picker";
import { Input } from "@/components/ui/input";

// type DayMouseEventHandler = (
//   date: Date,
//   modifiers: Modifiers,
//   e: MouseEvent
// ) => void;

export const OrderDatePicker = () => {
  const [value, setValue] = useState<Date[]>([]);

  const handleDayClick: DayMouseEventHandler = (day, modifiers) => {
    const newValue = [...value];
    if (modifiers.selected) {
      const index = value.findIndex((d) => isSameDay(day, d));
      newValue.splice(index, 1);
    } else {
      newValue.push(day);
    }
    setValue(newValue);
  };

  const handleResetClick = () => setValue([]);

  let footer = <>Please pick one or more days.</>;

  if (value.length > 0)
    footer = (
      <>
        You selected {value.length} days.{" "}
        <button onClick={handleResetClick}>Reset</button>
      </>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none w-fit">
          {/* <input type="week" placeholder="Select date range" /> */}
          <Input type="week" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="center">
        <DropdownMenuItem>
          <DayPicker
            // className="w-full gap-1.5"
            navLayout="around"
            mode="range"
            onDayClick={handleDayClick}
            modifiers={{ selected: value }}
            footer={footer}
            animate
            disableNavigation={false}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
