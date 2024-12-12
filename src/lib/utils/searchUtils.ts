export function buildSearchQuery(query: string) {
  // Split the search query into words
  const terms = query.trim().split(/\s+/);
  
  // Create a search condition for each word
  const searchConditions = terms.map(term => {
    const likePattern = `%${term}%`;
    return `(title.ilike.${likePattern} OR description.ilike.${likePattern})`;
  });
  
  // Join conditions with OR
  return searchConditions.join(',');
} 