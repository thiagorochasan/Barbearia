"use client";

import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Button } from "./ui/button";

type Props = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
};

export default function WeekSelector({ selectedDate, onSelect }: Props) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // começa na segunda
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
   <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((day) => (
        <Button
          key={day.toISOString()}
          onClick={() => onSelect(day)}
          variant={isSameDay(day, selectedDate) ? "default" : "outline"}
          className="rounded-full w-10 h-10 p-0 text-sm"
        >
          {day.getDate()}
        </Button>
      ))}
    </div>
  );
}
