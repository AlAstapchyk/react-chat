import React from "react";
import { getFormattedDate } from "../../../../helpers";

interface DayLabelProps {
  date: Date;
}
const DayLabel: React.FC<DayLabelProps> = ({ date }) => {
  return (
    <div className="w-full flex">
      <div className="mx-auto bg-[transparrent] border-black border-[1px] rounded-xl px-2 py-1 text-black">
        {getFormattedDate(date)}
      </div>
    </div>
  );
};

export default DayLabel;
