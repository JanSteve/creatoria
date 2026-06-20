import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserSubscriptions } from '../services/api';

// ══════════════════════════════════════════════════════════════════════
//  Subscriptions Screen
// ══════════════════════════════════════════════════════════════════════

export default function SubscriptionsScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscriptions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data } = await getUserSubscriptions();
      setSubscriptions(data.subscriptions || data || []);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }) => {
    const isActive = item.status === 'active';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.thumbnail || item.product?.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail || item.product?.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={['#1E293B', '#334155']}
              style={styles.thumbnail}
            >
              <Ionicons name="diamond-outline" size={22} color="#6366F1" />
            </LinearGradient>
          )}
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title || item.product?.title || 'Subscription'}
            </Text>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? '#22C55E' : '#EF4444' },
                ]}
              />
              <Text
                style={[
                  styles.statusLabel,
                  { color: isActive ? '#22C55E' : '#EF4444' },
                ]}
              >
                {isActive ? 'Active' : 'Cancelled'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailValue}>
              {item.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              ${((item.amount || item.price || 0) / 100).toFixed(2)}
              {item.billingCycle === 'yearly' ? '/yr' : '/mo'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Renews</Text>
            <Text style={styles.detailValue}>
              {isActive ? formatDate(item.currentPeriodEnd || item.renewsAt) : '—'}
            </Text>
          </View>
        </View>

        {isActive && (
          <TouchableOpacity style={styles.manageButton} activeOpacity={0.8}>
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
            <Ionicons name="chevron-forward" size={16} color="#6366F1" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="card-outline" size={48} color="#334155" />
      </View>
      <Text style={styles.emptyTitle}>No Subscriptions</Text>
      <Text style={styles.emptySubtitle}>
        Subscribe to premium products to access them anytime and get continuous updates.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading subscriptions…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <Text style={styles.headerSubtitle}>
          {subscriptions.filter((s) => s.status === 'active').length} active
        </Text>
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => String(item._id || item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchSubscriptions(true)}
            tintColor="#6366F1"
            colors={['#6366F1']}
          />
        }
        renderItem={renderItem}
      />
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Styles
// ══════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // ── Card ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Details Row ────────────────────────────────────────────────────
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '700',
  },

  // ── Manage ─────────────────────────────────────────────────────────
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 4,
  },
  manageButtonText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Empty ──────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
