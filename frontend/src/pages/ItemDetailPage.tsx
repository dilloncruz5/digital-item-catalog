// src/pages/ItemDetailPage.tsx

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fetchItemById, submitItemForm } from "../api/items";
import type { Item, SubmissionPayload } from "../types/item";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const itemId = Number(id);

  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SubmissionPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(itemId)) {
      setItemError("Invalid item id");
      return;
    }

    setLoadingItem(true);
    setItemError(null);

    fetchItemById(itemId)
      .then((data) => setItem(data))
      .catch((err: Error) => {
        setItemError(err.message || "Failed to load item.");
      })
      .finally(() => setLoadingItem(false));
  }, [itemId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await submitItemForm(item.id, formData);
      if (response.success) {
        setSubmitSuccess(response.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitError(response.message || "Submission failed.");
      }
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {loadingItem && <LoadingSpinner />}
      {itemError && <ErrorMessage message={itemError} />}

      {item && (
        <>
          <h1>{item.name}</h1>
          <p className="short-description">{item.shortDescription}</p>
          <p className="full-description">{item.fullDescription}</p>

          <h2>Submit Feedback / Request</h2>
          <form className="submit-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={4}
                required
              />
            </div>

            {submitError && <ErrorMessage message={submitError} />}
            {submitSuccess && <div className="success">{submitSuccess}</div>}

            <button type="submit" className="button" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
