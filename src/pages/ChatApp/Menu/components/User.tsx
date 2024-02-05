import { MessageSvg } from "../../../../svgs";

interface PartnerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  partner: any;
}

const Partner = ({ partner, ...props }: PartnerProps) => {
  return (
    <button
      className="group flex rounded-2xl bg-white p-2 shadow-md hover:cursor-pointer"
      {...props}
    >
      <img src={partner.photoURL} className="w-12 h-12 rounded-2xl shadow-md" alt="Avatar" />
      <p className="truncate text-lg font-medium my-auto text-left text-gray-500 ml-3 mr-2 flex-grow w-0">
        {partner.displayName}
      </p>

      <div className="transition-transform duration-100 group-hover:scale-110 group-active:scale-95">
        <MessageSvg className="w-[3rem] h-[3rem] p-1 my-auto stroke-gray-300" />
      </div>
    </button>
  );
};

export default Partner;
