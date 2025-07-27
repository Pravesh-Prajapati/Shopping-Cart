import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const SearchContext = createContext();
export function SearchProvider({ children }) {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(inputValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSearch = (val) => {
    setInputValue(val);
  };


  return (
    <SearchContext.Provider value={{ handleSearch, searchValue, setSearchValue , setInputValue}}>
      {children}
    </SearchContext.Provider>
  );
}
