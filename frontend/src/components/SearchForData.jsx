import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchForData({
  originalData,
  setSearchedData,
  inputRef,
}) {
  const [search, setSearch] = useState("");

  function handleSearch(value) {
    setSearch(value);

    const searchedData = originalData.filter((data) =>
      data.title.toLowerCase().includes(value.toLowerCase())
    );

    setSearchedData(searchedData);
  }

  return (
    <div className="mb-6 relative">
      <FaSearch className="absolute top-[50%] translate-y-[-50%] ml-3" />
      <input
        ref={inputRef}
        className="w-full border border-neutral-600 rounded-full p-2 pl-10 text-base leading-none bg-card"
        value={search}
        type="text"
        placeholder="Sök efter titel..."
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
