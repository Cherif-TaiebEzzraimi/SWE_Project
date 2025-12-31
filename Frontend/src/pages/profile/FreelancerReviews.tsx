import React, { useState, useEffect } from 'react';
import styles from './FreelancerReviews.module.css';
<<<<<<< HEAD

interface Review {
  id: number;
  client_id: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    profile_picture: string | null;
    phone_number: string;
    city: string;
    wilaya: string;
  };
  freelancer_id: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
=======
import apiClient from '../../lib/axios';

interface Review {
  id: number;
  // Backend ReviewSerializer returns FK fields as IDs (client, freelancer).
  client: number;
  freelancer: number;
>>>>>>> feature/authentication
  rating: number;
  feedback: string;
  created_at: string;
}

<<<<<<< HEAD
=======
type ClientProfile = {
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  profile_picture?: string | null;
};

>>>>>>> feature/authentication
interface FreelancerReviewsProps {
  freelancerId: number;
  overallRating: number | null;
}

<<<<<<< HEAD
const FreelancerReviews: React.FC<FreelancerReviewsProps> = ({ freelancerId, overallRating }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
=======
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
>>>>>>> feature/authentication
  }, [freelancerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      // Dummy data for UI preview
      const demo = [
        {
          id: 201,
          client_id: {
            user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' },
            profile_picture: null,
            phone_number: '0555000000',
            city: 'Oran',
            wilaya: 'Oran',
          },
          freelancer_id: { user: { first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' } },
          rating: 5,
          feedback: 'Ahmed was excellent — delivered on time and communicated clearly.',
          created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 202,
          client_id: {
            user: { first_name: 'Younes', last_name: 'B.', email: 'younes@example.com' },
            profile_picture: null,
            phone_number: '0555111111',
            city: 'Blida',
            wilaya: 'Blida',
          },
          freelancer_id: { user: { first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' } },
          rating: 4,
          feedback: 'Solid work. Minor revisions needed but overall very satisfied.',
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
      ];
      setReviews(demo as any);
    } catch (error) {
      console.error('Error fetching reviews:', error);
=======
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
>>>>>>> feature/authentication
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? styles.starFilled : styles.starEmpty}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
=======
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
>>>>>>> feature/authentication
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
<<<<<<< HEAD
            {overallRating ? overallRating.toFixed(1) : 'N/A'}
          </div>
          <div className={styles.ratingStars}>
            {overallRating && renderStars(Math.round(overallRating))}
          </div>
          <div className={styles.reviewCount}>
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
=======
            {overallRating !== null ? overallRating.toFixed(1) : 'N/A'}
          </div>
          <div className={styles.ratingStars}>
            {overallRating !== null &&
              renderStars(Math.round(overallRating))}
          </div>
          <div className={styles.reviewCount}>
            Based on {reviews.length}{' '}
            {reviews.length === 1 ? 'review' : 'reviews'}
>>>>>>> feature/authentication
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className={styles.noReviews}>
          <p>No reviews yet</p>
<<<<<<< HEAD
          <p className={styles.noReviewsSubtext}>
            Complete projects and receive reviews from clients to build your reputation.
          </p>
=======
          
>>>>>>> feature/authentication
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewClient}>
<<<<<<< HEAD
                  <div className={styles.clientAvatar}>
                    {review.client_id.user.first_name.charAt(0)}
                    {review.client_id.user.last_name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.clientName}>
                      {review.client_id.user.first_name} {review.client_id.user.last_name}
=======
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
>>>>>>> feature/authentication
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
<<<<<<< HEAD
=======

>>>>>>> feature/authentication
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
