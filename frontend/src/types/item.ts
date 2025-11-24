// src/types/item.ts

export interface Item {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
}

export interface SubmissionPayload {
  name: string;
  email: string;
  message: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
}
