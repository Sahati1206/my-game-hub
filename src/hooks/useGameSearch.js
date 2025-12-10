import { useState, useMemo } from 'react';
import gamesData from '../data/games.json';

export const useGameSearch = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || game.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return { search, setSearch, category, setCategory, filteredGames };
};