// src/pages/ItemDetailPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fetchItemById, submitItemForm } from "../api/items";
import type { Item, SubmissionPayload } from "../types/item";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Button } from "../components/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // validation state
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

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

  // validation helpers
  function validateName(name: string) {
    if (!name || name.trim().length < 2) return "Name must be at least 2 characters.";
    return null;
  }

  function validateEmail(email: string) {
    if (!email) return "Email is required.";
    if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
    return null;
  }

  function validateMessage(message: string) {
    if (!message || message.trim().length < 10) return "Message must be at least 10 characters.";
    return null;
  }

  // run validation whenever fields change
  useEffect(() => {
    setNameError(validateName(formData.name));
    setEmailError(validateEmail(formData.email));
    setMessageError(validateMessage(formData.message));
    // clear any server-side errors when user types
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [formData]);

  const isFormValid = !nameError && !emailError && !messageError;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;

    // final validation check before sending
    const ne = validateName(formData.name);
    const ee = validateEmail(formData.email);
    const me = validateMessage(formData.message);

    setNameError(ne);
    setEmailError(ee);
    setMessageError(me);

    if (ne || ee || me) return;

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
    <div className="detail-page">
      {loadingItem && <LoadingSpinner />}

      {itemError && <ErrorMessage message={itemError} />}

      {item && (
        <>
          <div className="detail-header">
            <h1>{item.name}</h1>
            <p className="short-description">{item.shortDescription}</p>
          </div>

          <div className="detail-body">
            <section className="detail-info card">
              <h2>Details</h2>
              <p className="full-description">{item.fullDescription}</p>
            </section>

            <section className="detail-form card">
              {submitSuccess && <div className="success banner">{submitSuccess}</div>}
              {submitError && <ErrorMessage message={submitError} />}

              <h2>Submit Feedback / Request</h2>

              <form className="submit-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                    required
                  />
                  {nameError && <div id="name-error" className="field-error">{nameError}</div>}
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    required
                  />
                  {emailError && <div id="email-error" className="field-error">{emailError}</div>}
                </div>

                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    rows={5}
                    aria-invalid={!!messageError}
                    aria-describedby={messageError ? "message-error" : undefined}
                    required
                  />
                  {messageError && <div id="message-error" className="field-error">{messageError}</div>}
                </div>

                <div className="form-actions">
                  <Button type="submit" label="Submit" loading={submitting} disabled={!isFormValid || submitting} fullWidth />
                </div>
              </form>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
