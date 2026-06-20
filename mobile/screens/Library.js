import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { getDownloadUrl } from '../services/api';

export default function Library() {
  const [loading, setLoading] = useState(true);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      // Fetch user specific acquisitions mock data for Local sandbox demo
      setPurchasedItems([
        {
          _id: 'purchase-1',
          productId: 'mock-1',
          title: 'Premium Next.js Boilerplate Template',
          category: 'Development',
          purchasedOn: new Date().toLocaleDateString(),
        },
      ]);
    } catch (e) {
      console.warn('API error fetching library purchases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDownload = async (productId, title) => {
    try {
      const response = await getDownloadUrl(productId);
      if (response.success && response.data.url) {
        await WebBrowser.openBrowserAsync(response.data.url);
      } else {
        Alert.alert('Error', 'Unable to fetch secure download link.');
      }
    } catch (e) {
      // Sandbox fallback download links
      Alert.alert(
        'Sandbox Notice',
        'Direct S3 links offline. Launching simulated download link in in-app browser overlay.',
        [
          {
            text: 'OK',
            onPress: async () => {
              const dummyUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
              await WebBrowser.openBrowserAsync(dummyUrl);
            },
          },
        ]
      );
    }
  };

  const renderPurchaseItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>{item.purchasedOn}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item.productId, item.title)}
        >
          <Ionicons name="cloud-download-outline" size={16} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Download Asset</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Library</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={purchasedItems}
          keyExtractor={(item) => item._id}
          renderItem={renderPurchaseItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="file-tray-outline" size={48} color="#475569" />
              <Text style={styles.emptyText}>Your digital library is currently empty.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    color: '#6366f1',
    fontWeight: '800',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  date: {
    color: '#475569',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#475569',
    fontSize: 14,
    marginTop: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
