// News feed screen composing VnExpress RSS category chips, pull-to-refresh article list and MiniPlayer (FR 5.1–5.3).
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { MiniPlayer } from "@/components/MiniPlayer";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/Button";
import { Colors, Spacing } from "@/constants/theme";
import { useNewsFeed, useSelectedArticleStore, type NewsArticle } from "@/features/news";
import { useSessionTimer } from "@/features/session";

export default function NewsScreen() {
  const { sources, selectedSourceId, selectSource, articles, isLoading, isRefetching, error, refresh } = useNewsFeed();
  const selectArticle = useSelectedArticleStore((s) => s.select);
  const { recordArticleOpened } = useSessionTimer();

  const openArticle = (item: NewsArticle) => {
    selectArticle(item);
    recordArticleOpened();
    router.push({ pathname: "/news/[id]", params: { id: item.id, url: item.link, title: item.title } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button label="← Space" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.heading}>VnExpress News</Text>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Button
            label="All"
            variant={selectedSourceId === null ? "primary" : "secondary"}
            onPress={() => selectSource(null)}
          />
          {sources.map((src) => (
            <Button
              key={src.id}
              label={src.title}
              variant={selectedSourceId === src.id ? "primary" : "secondary"}
              onPress={() => selectSource(src.id)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading && articles.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : error && articles.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.error}>Could not load news feed</Text>
          <Button label="Retry" onPress={() => void refresh()} />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refresh()} />}
          renderItem={({ item }) => (
            <NewsCard
              title={item.title}
              category={item.source}
              summary={item.summary}
              imageUrl={item.imageUrl}
              publishedAt={item.publishedAt}
              onPress={() => openArticle(item)}
            />
          )}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.sm, gap: Spacing.sm },
  heading: { color: Colors.dark.text, fontSize: 18, fontWeight: "700" },
  chipsWrap: { paddingVertical: Spacing.xs },
  chips: { paddingHorizontal: Spacing.md, gap: Spacing.xs },
  list: { padding: Spacing.md, gap: Spacing.sm },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  error: { color: "#F87171" },
});
