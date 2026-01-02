import React from "react";
import { ProfileDropdown } from "./ProfileDropdown";
import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

export const NavBar = React.memo(() => {
  const location = useLocation();
  return (
    <div className="bg-background  drop-shadow-xl py-5 px-5 flex flex-row justify-between shadow-2xs sticky top-0 z-50 ">
      <div>
        <h1 className="text-md font-semibold">
          {location ? location.pathname.split("/")[1]?.toUpperCase() : ""}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-8 pr-5">
        <SearchBar />
        <ProfileDropdown />
      </div>
    </div>
  );
});
NavBar.displayName = "NavBar";
