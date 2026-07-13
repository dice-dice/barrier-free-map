import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFacilities } from '../hooks/useFacilities';
import { useMyConfirmations } from '../hooks/useMyConfirmations';
import { FacilityListItem } from './FacilityListItem';
import { OsmAttribution } from './OsmAttribution';

interface FacilityListProps {
  userId: string;
}

export function FacilityList({ userId }: FacilityListProps) {
  const { facilities, loading, errorMessage } = useFacilities();
  const myConfirmations = useMyConfirmations(userId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (facilities.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>施設が登録されていません</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={facilities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FacilityListItem facility={item} userId={userId} myConfirmation={myConfirmations[item.id]} />
      )}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={OsmAttribution}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#d92d20',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    color: '#5a5a5a',
    fontSize: 14,
    textAlign: 'center',
  },
});
