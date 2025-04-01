import * as React from "react";
import { useState } from "react";
import { BlocksResultProps } from "@grapesjs/react";
import MoreBlockManager from "./MoreBlockManager.tsx";
import ThemesBlockManager from "./ThemesBlockManager.tsx";

export type CustomBlockManagerProps = Pick<
  BlocksResultProps,
  "mapCategoryBlocks" | "dragStart" | "dragStop"
>;

export default function CustomBlockManager({
  mapCategoryBlocks,
  dragStart,
  dragStop,
}: CustomBlockManagerProps) {
  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const [isThemesVisible, setIsThemesVisible] = useState(true);
  const [isMadeVisible, setIsMadeVisible] = useState(false);

  const toggleMore = () => {
    setIsMoreVisible((prev) => !prev);
  };

  const toggleThemes = () => {
    setIsThemesVisible((prev) => !prev);
  };

  const toogleMade = () => {
    setIsMadeVisible((prev) => !prev);
  };

  return (
    <div className="custom-block-manager">
      <div
        className="flex items-center justify-between pt-3 px-4 cursor-pointer mb-4"
        onClick={toggleThemes}
      >
        <h1 className="text-[15px] font-dmSans font-semibold">Themes</h1>
        <button className="py-1 text-white rounded">
          <svg
            className={`transform transition-transform duration-300 ${
              isThemesVisible ? "rotate-180" : "rotate-0"
            }`}
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 20.5L16 11.5L25 20.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {isThemesVisible && <ThemesBlockManager />}
      <div
        className="flex items-center justify-between pt-4 px-4 cursor-pointer border-t border-[#646464]"
        onClick={toggleMore}
      >
        <h1 className="text-lg font-dmSans text-[300] mb-2">More</h1>
        <button className="py-1 text-white rounded">
          <svg
            className={`transform transition-transform duration-300 ${
              isMoreVisible ? "rotate-180" : "rotate-0"
            }`}
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 20.5L16 11.5L25 20.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {isMoreVisible && (
        <MoreBlockManager
          mapCategoryBlocks={mapCategoryBlocks}
          dragStart={dragStart}
          dragStop={dragStop}
        />
      )}
    </div>
  );
}
