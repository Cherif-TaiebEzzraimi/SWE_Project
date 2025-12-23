import React, { useState, useEffect } from 'react';
import styles from './FreelancerReviews.module.css';
import apiClient from '../../lib/axios';

interface Review {
  id: number;
  client_id: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    profile_picture: string | null;
    phone_number?: string;
    city?: string;
    wilaya?: string;
  };
  freelancer_id: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  rating: number;
  feedback: string;
  created_at: string;
}

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

  useEffect(() => {
    if (freelancerId) {
      fetchReviews();
    }
  }, [freelancerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/reviews/freelancer/${freelancerId}/`
      );
      setReviews(response.data);
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
                  <div className={styles.clientAvatar}>
                    {review.client_id.user.first_name.charAt(0)}
                    {review.client_id.user.last_name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.clientName}>
                      {review.client_id.user.first_name}{' '}
                      {review.client_id.user.last_name}
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
