import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../../services/booking.service';
import { reviewService } from '../../../services/review.service';
import { Colors } from '../../../constants/colors';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // bookingId
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.getById(id!);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Validation Error', 'Please share a few words about your experience.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({
        bookingId: id!,
        rating,
        comment
      });
      Alert.alert('Thank You! ⭐', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => router.replace('/(tourist)/history') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.title}>Write a Review</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.guideSummary}>
            <Text style={styles.guideName}>Guide: {booking?.guideId?.userId?.fullName || 'Local Guide'}</Text>
            <Text style={styles.tourDate}>Date: {new Date(booking?.bookingDate).toLocaleDateString()}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Rate Your Experience</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={styles.starIcon}>{star <= rating ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>{rating} out of 5 stars</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.commentLabel}>Your Feedback</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Tell us what you enjoyed or how the guide made your tour special..."
              multiline
              numberOfLines={5}
              mode="outlined"
              style={styles.commentInput}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitBtn}
            >
              Submit Review
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  content: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  card: { marginBottom: 16 },
  guideSummary: { alignItems: 'center', padding: 8 },
  guideName: { fontSize: 18, fontWeight: 'bold' },
  tourDate: { color: Colors.textSecondary, marginTop: 4 },
  ratingSection: { alignItems: 'center', padding: 16 },
  ratingLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 12 },
  starIcon: { fontSize: 36 },
  ratingText: { marginTop: 8, color: Colors.textSecondary, fontWeight: 'bold' },
  commentLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  commentInput: { backgroundColor: '#fff', height: 120 },
  submitBtn: { marginTop: 16 }
});
