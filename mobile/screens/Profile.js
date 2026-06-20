import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { name: 'My Purchases', icon: 'cart-outline', action: () => {} },
    { name: 'Active Subscriptions', icon: 'repeat-outline', action: () => {} },
    { name: 'Settings', icon: 'settings-outline', action: () => {} },
    { name: 'Help & Support', icon: 'help-circle-outline', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name ? user.name[0].toUpperCase() : 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Verified User'}</Text>
        <Text style={styles.email}>{user?.email || 'sandbox@creatoria.com'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'User'}</Text>
        </View>
      </View>

      {/* Menu Options Row list */}
      <View style={styles.menu}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.row} onPress={item.action}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon} size={20} color="#94a3b8" style={styles.rowIcon} />
              <Text style={styles.rowLabel}>{item.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={logout}>
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={20} color="#f87171" style={styles.rowIcon} />
            <Text style={styles.logoutLabel}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Creatoria Mobile v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6366f1',
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  roleText: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  menu: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutRow: {
    borderColor: 'rgba(248, 113, 113, 0.1)',
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
    marginTop: 12,
  },
  logoutLabel: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 11,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
});
