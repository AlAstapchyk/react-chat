import { format, isThisYear, isToday, isYesterday } from "date-fns";
import React from "react";

interface DayLabelProps {
  date: Date;
}

const DayLabel: React.FC<DayLabelProps> = ({ date }) => {
  let formattedDate: string;

  if (isToday(date)) {
    formattedDate = "Today";
  } else if (isYesterday(date)) {
    formattedDate = "Yesterday";
  } else if (isThisYear(date)) {
    formattedDate = format(date, "MMMM d");
  } else {
    formattedDate = format(date, "MMMM d, yyyy");
  }

  return (
    <div className="w-full flex">
      <div className="mx-auto bg-[transparrent] border-black border-[1px] rounded-xl px-2 py-1 text-black">
        {formattedDate}
      </div>
    </div>
  );
};

export default DayLabel;
