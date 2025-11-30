// src/pages/ItemListPage.tsx
import { useEffect, useState } from "react";
import { fetchItems } from "../api/items";
import type { Item } from "../types/item";
import { ItemCard } from "../components/ItemCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { NoResults } from "../components/NoResults";
import { Button } from "../components/Button";


const ITEMS_PER_PAGE = 3;

export function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchItems()
      .then((data) => {
        setItems(data || []);
        setFilteredItems(data || []);
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to load items.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    const newFiltered = items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.shortDescription.toLowerCase().includes(q)
    );
    setFilteredItems(newFiltered);
    setPage(1);
  }, [search, items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pagedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

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
        <NoResults query={search} />
      )}

      <div className="item-grid" aria-live="polite">
        {pagedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length > 0 && (
        <div className="pagination" style={{ marginTop: 20 }}>
          <Button
  label="Previous"
  onClick={goPrev}
  disabled={page === 1}
/>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <Button
  label="Next"
  onClick={goNext}
  disabled={page === totalPages}
/>
        </div>
      )}
    </div>
  );
}
