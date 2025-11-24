// src/pages/ItemListPage.tsx

import { useEffect, useState } from "react";
import { fetchItems } from "../api/items";
import type { Item } from "../types/item";
import { ItemCard } from "../components/ItemCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from backend on load
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to load items.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter list when search changes
  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredItems(
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.shortDescription.toLowerCase().includes(query)
      )
    );
  }, [search, items]);

  return (
    <div>
      <h1>Item Catalog</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && filteredItems.length === 0 && (
        <p>No items found.</p>
      )}

      <div className="item-grid">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
