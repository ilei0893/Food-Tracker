"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Food {
  fdcId: number;
  description: string;
  dataType?: string;
  publicationDate?: string;
  brandOwner?: string;
  foodCategory?: string;
}

interface FoodSearchResponse {
  foods: Food[];
  totalHits?: number;
  currentPage?: number;
  totalPages?: number;
}

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async (query?: string) => {
    setLoading(true);
    try {
      let data: Food[] | FoodSearchResponse;
      if (query) {
        data = await api.get<FoodSearchResponse>(
          `/foods/search?query=${encodeURIComponent(query)}`,
        );
        setFoods((data as FoodSearchResponse).foods || []);
      } else {
        data = await api.get<Food[]>("/foods/list");
        setFoods(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setError("Failed to fetch foods from USDA API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFoods(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Food Tracker
          </h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    fetchFoods();
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-8 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              Loading foods...
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing {foods.length} foods
              </p>
              {foods.map((food) => (
                <div
                  key={food.fdcId}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {food.description}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex gap-4">
                    {food.brandOwner && <span>{food.brandOwner}</span>}
                    {food.dataType && <span>{food.dataType}</span>}
                    {food.foodCategory && <span>{food.foodCategory}</span>}
                  </div>
                </div>
              ))}
              {foods.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No foods found.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
