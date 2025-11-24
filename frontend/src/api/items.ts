// src/api/items.ts

import { apiGet, apiPost } from "./client";
import type { Item, SubmissionPayload, SubmissionResponse } from "../types/item";

export function fetchItems(): Promise<Item[]> {
  return apiGet<Item[]>("/items");
}

export function fetchItemById(id: number): Promise<Item> {
  return apiGet<Item>(`/items/${id}`);
}

export function submitItemForm(
  id: number,
  payload: SubmissionPayload
): Promise<SubmissionResponse> {
  return apiPost<SubmissionResponse, SubmissionPayload>(`/items/${id}/submit`, payload);
}
