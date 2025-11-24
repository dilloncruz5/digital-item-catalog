// src/components/ErrorMessage.tsx

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className="error">{message}</div>;
}
