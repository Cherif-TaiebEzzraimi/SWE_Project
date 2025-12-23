import React, { useState, useEffect } from 'react';
import styles from './FreelancerReviews.module.css';
import apiClient from '../../lib/axios';

interface Review {
  id: number;
  // Backend ReviewSerializer returns FK fields as IDs (client, freelancer).
  client: number;
  freelancer: number;
  rating: number;
  feedback: string;
  created_at: string;
}

type ClientProfile = {
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  profile_picture?: string | null;
};

interface FreelancerReviewsProps {
  freelancerId: number;
  overallRating: number | null;
}

const FreelancerReviews: React.FC<FreelancerReviewsProps> = ({
  freelancerId,
  overallRating,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientById, setClientById] = useState<Record<number, ClientProfile | null>>({});

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('//')) return `${window.location.protocol}${trimmed}`;

    const base = (apiClient.defaults.baseURL || '').toString().replace(/\/$/, '');
    if (!base) return trimmed;

    if (trimmed.startsWith('/')) return `${base}${trimmed}`;
    return `${base}/${trimmed}`;
  };

  const getInitials = (first?: string, last?: string) => {
    const a = (first || '').trim().charAt(0);
    const b = (last || '').trim().charAt(0);
    const initials = `${a}${b}`.trim();
    return initials || '?';
  };

  useEffect(() => {
    if (freelancerId) {
      fetchReviews();
    }
  }, [freelancerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Review[]>(`/reviews/freelancer/${freelancerId}/`);
      const fetchedReviews = Array.isArray(response.data) ? response.data : [];
      setReviews(fetchedReviews);

      // Load client user info for display (the reviews endpoint returns only IDs).
      const uniqueClientIds = Array.from(
        new Set(
          fetchedReviews
            .map((r) => r.client)
            .filter((id): id is number => typeof id === 'number' && !Number.isNaN(id))
        )
      );

      const missingClientIds = uniqueClientIds.filter((id) => clientById[id] === undefined);
      if (missingClientIds.length) {
        const pairs = await Promise.all(
          missingClientIds.map(async (id) => {
            try {
              const clientRes = await apiClient.get<ClientProfile>(`/clients/${id}/`);
              return [id, clientRes.data] as const;
            } catch {
              return [id, null] as const;
            }
          })
        );
        setClientById((prev) => {
          const next = { ...prev };
          for (const [id, client] of pairs) next[id] = client;
          return next;
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.reviewsContainer}>
        <div className={styles.loading}>Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      {/* Overall Rating Summary */}
      <div className={styles.ratingsSummary}>
        <div className={styles.overallRating}>
          <div className={styles.ratingNumber}>
            {overallRating !== null ? overallRating.toFixed(1) : 'N/A'}
          </div>
          <div className={styles.ratingStars}>
            {overallRating !== null &&
              renderStars(Math.round(overallRating))}
          </div>
          <div className={styles.reviewCount}>
            Based on {reviews.length}{' '}
            {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className={styles.noReviews}>
          <p>No reviews yet</p>
          
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewClient}>
                  {(() => {
                    const client = clientById[review.client];
                    const first = client?.user?.first_name;
                    const last = client?.user?.last_name;
                    const avatarUrl = resolveMediaUrl(client?.profile_picture || null);
                    const initials = getInitials(first, last);

                    return (
                      <div className={styles.clientAvatar} aria-label="Reviewer">
                        {avatarUrl ? (
                          <img
                            className={styles.clientAvatarImage}
                            src={avatarUrl}
                            alt={`${(first || 'Client').trim()} ${(last || '').trim()}`.trim()}
                            loading="lazy"
                          />
                        ) : (
                          <span className={styles.clientAvatarInitials}>{initials}</span>
                        )}
                      </div>
                    );
                  })()}
                  <div>
                    <div className={styles.clientName}>
                      {(() => {
                        const client = clientById[review.client];
                        const first = (client?.user?.first_name || '').trim();
                        const last = (client?.user?.last_name || '').trim();
                        if (first || last) return `${first} ${last}`.trim();
                        return `Client #${review.client}`;
                      })()}
                    </div>
                    <div className={styles.reviewDate}>
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.feedback && (
                <div className={styles.reviewFeedback}>
                  {review.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerReviews;
