import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DashboardCardProps = {
  title: string;
  count: number;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardCount}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E0F7FA', // Light Teal / Cyan
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
    color: '#124E57', // Dark Teal
  },
  cardCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F69521', // Catalyst Yellow
  }
});

export default DashboardCard;
