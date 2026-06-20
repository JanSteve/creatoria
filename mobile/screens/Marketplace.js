import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/api';

export default function Marketplace({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Templates'];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search,
      });
      setProducts(response.data.products);
    } catch (e) {
      console.warn('API error fetching products:', e);
      // Fallback sandbox list items
      setProducts([
        {
          _id: 'mock-1',
          title: 'Premium Next.js Boilerplate Template',
          description: 'Complete boilerplate layout in Tailwind CSS with dark mode config, custom login cards, and stripe payment links integrated.',
          price: 49,
          type: 'one-time',
          category: 'Development',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          vendorId: { storeName: 'NextDev Systems' },
        },
        {
          _id: 'mock-2',
          title: 'Glassmorphism UI Icons Library',
          description: 'A set of over 200 high-quality vector components and glass widgets. Includes Figma workspaces and react files.',
          price: 29,
          type: 'one-time',
          category: 'Design',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          vendorId: { storeName: 'Studio Pixel' },
        },
        {
          _id: 'mock-3',
          title: 'AI Copywriting Assistant Module',
          description: 'Access premium backend logic APIs and automated prompts. Billed monthly for consistent updates.',
          price: 19,
          type: 'subscription',
          category: 'Templates',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          vendorId: { storeName: 'BrainAI Corp' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const renderProductCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
      >
        <Image
          source={{ uri: item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60' }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardVendor}>By {item.vendorId?.storeName || 'Verified Creator'}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>
              {item.price === 0 ? 'Free' : `$${item.price}`}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type === 'subscription' ? 'Monthly' : 'Lifetime'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        
        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#475569" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search premium templates..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchItems}
          />
        </View>

        {/* Categories Chip Pills */}
        <View style={styles.categoryScroll}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Grid listing products */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    paddingVertical: 10,
    fontSize: 14,
  },
  categoryScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardInfo: {
    padding: 16,
  },
  cardVendor: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
