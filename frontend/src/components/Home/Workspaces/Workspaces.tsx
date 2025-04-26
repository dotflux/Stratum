import { useState } from "react";
import AlphaBoard from "./AlphaBoard";
import WorkBoxes from "./WorkBoxes";
import { useOutletContext } from "react-router-dom";
import HomeBg from "../HomeBg";

interface OutletContextType {
  isExpanded: boolean;
}

const Workspaces: React.FC = () => {
  const { isExpanded } = useOutletContext<OutletContextType>();
  const [search, setSearch] = useState("");

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      {/* Background Component */}
      <HomeBg />

      <div
        className={`relative transition-all duration-300 overflow-x-hidden ${
          isExpanded ? "lg:ml-64 lg:w-[calc(100%-16rem)]" : "w-full"
        } z-10`} // Ensure content stays above the background
      >
        <AlphaBoard search={search} onSearchChange={(val) => setSearch(val)} />
        <WorkBoxes search={search} />
      </div>
    </div>
  );
};

export default Workspaces;
