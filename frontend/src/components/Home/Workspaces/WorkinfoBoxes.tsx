interface Props {
  name: string;
  id: string;
  description: string;
  role: string;
  memberCount: number;
}

const WorkinfoBoxes = ({ name, description, role, memberCount }: Props) => {
  return (
    <div
      className="
    flex-shrink-0
    w-80 max-w-full
    p-6
    bg-[#1f1f1f]
    border border-gray-700
    text-white
    rounded-lg
    shadow-md
    transition-transform duration-300
    hover:scale-105
    hover:shadow-[0_0_12px_2px_rgba(255,255,255,0.2)]
    cursor-pointer
    mt-2
  "
    >
      <h2 className="text-2xl font-bold mb-3 truncate">{name}</h2>

      <p className="text-sm text-gray-300 mb-5 line-clamp-3">
        {description || "No description available."}
      </p>

      <div className="flex justify-between items-center text-sm">
        <span className="bg-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {role}
        </span>
        <span className="text-gray-300">{memberCount} Members</span>
      </div>
    </div>
  );
};

export default WorkinfoBoxes;
