// src/components/ItemCard.tsx

import { Link } from "react-router-dom";
import type { Item } from "../types/item";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="item-card">
      <h3>{item.name}</h3>
      <p>{item.shortDescription}</p>
      <Link to={`/items/${item.id}`} className="button">
        View Details
      </Link>
    </div>
  );
}
