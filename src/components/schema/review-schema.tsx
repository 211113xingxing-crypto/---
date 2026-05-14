interface ReviewSchemaProps {
  reviews: Array<{
    id: number;
    rating: number;
    content?: string;
    authorName: string;
    datePublished: string;
  }>;
  aggregate?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  itemReviewed: {
    name: string;
    url: string;
  };
}

export function ReviewSchema({ reviews, aggregate, itemReviewed }: ReviewSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemReviewed.name,
    url: itemReviewed.url,
    review: reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: aggregate?.bestRating ?? 5,
      },
      author: {
        '@type': 'Person',
        name: r.authorName,
      },
      ...(r.content ? { reviewBody: r.content } : {}),
      datePublished: r.datePublished,
    })),
  };

  if (aggregate) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregate.ratingValue.toFixed(1),
      reviewCount: aggregate.reviewCount,
      bestRating: aggregate.bestRating ?? 5,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
