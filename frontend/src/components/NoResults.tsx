// src/components/NoResults.tsx
interface NoResultsProps {
  query?: string;
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <div className="no-results" role="status" aria-live="polite">
      <h3>No items match your search</h3>
      {query ? (
        <p>Try a different term for: "<strong>{query}</strong>"</p>
      ) : (
        <p>Try removing filters or try another search term.</p>
      )}
    </div>
  );
}
