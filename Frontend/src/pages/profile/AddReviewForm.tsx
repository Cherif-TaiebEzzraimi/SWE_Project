import React, { useEffect, useRef, useState } from 'react';
import apiClient from '../../lib/axios';
import styles from './FreelancerReviewForm.module.css';
import type { AxiosError } from 'axios';

type AddReviewFormProps = {
  freelancerId: number;
  onSuccess?: () => void;
};

const AddReviewForm: React.FC<AddReviewFormProps> = ({ freelancerId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 6000);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (rating < 1) {
      setMessageType('error');
      setMessage('Please select a rating.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/reviews/', {
        freelancer_id: freelancerId,
        rating,
        feedback: feedback.trim(),
      });

      setMessageType('success');
      setMessage('Review submitted successfully.');
      setRating(0);
      setFeedback('');
      onSuccess?.();
    } catch (err) {
      const e = err as AxiosError<any>;
      const status = e.response?.status;
      const data = e.response?.data;

      // DRF often responds with { detail: "..." } or field errors.
      const detail =
        (typeof data?.detail === 'string' && data.detail) ||
        (typeof data === 'string' && data) ||
        (data && typeof data === 'object' ? JSON.stringify(data) : '');

      setMessageType('error');

      if (status === 400) {
        // Common case: backend enforces one review per client per freelancer.
        const normalized = (detail || '').toLowerCase();
        if (
          normalized.includes('already reviewed') ||
          ((normalized.includes('already') &&
            (normalized.includes('review') || normalized.includes('reviewed'))) ||
            (normalized.includes('already') && normalized.includes('freelancer'))) ||
          // Covers DB/serializer uniqueness messages.
          normalized.includes('unique')
        ) {
          setMessage(
            "You can only leave one review for each freelancer. You’ve already shared your feedback here."
          );
          onSuccess?.();
        } else if (rating < 1) {
          setMessage('Please select a rating before submitting.');
        } else {
          setMessage('We couldn’t submit your review. Please check your information and try again.');
        }
      } else if (status === 500) {
        // Backend bug can throw AFTER persisting the review; refresh to reflect reality.
        setMessage('Something went wrong, but your review might still have been saved. Updating the page…');
        onSuccess?.();
      } else {
        setMessage('We couldn’t submit your review right now. Please try again in a moment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Add a Review</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <div className={styles.label}>Rating</div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  star <= (hoverRating || rating)
                    ? styles.starActive
                    : styles.starInactive
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
            <span className={styles.ratingText}>
              {rating ? `${rating}/5` : 'Select'}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className={styles.label}>Feedback</div>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="Share your experience (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`${styles.button} ${
            submitting ? styles.buttonDisabled : ''
          }`}
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>

        {message && (
          <div
            className={`${styles.alert} ${
              messageType === 'success' ? styles.success : styles.error
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddReviewForm;
