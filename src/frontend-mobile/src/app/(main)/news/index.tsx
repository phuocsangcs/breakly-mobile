// News feed screen synchronized with Figma "05 · News Feed".
// Composes IconButton header, SessionTimerPill, Chip category filters, NewsCard feed, and floating MiniPlayer.
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconButton";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";
import { getThemeColors, Spacing, Typography } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { useNewsFeed, useSelectedArticleStore, type NewsArticle } from "@/features/news";
import { usePreferences } from "@/features/preferences";
import { useSessionTimer } from "@/features/session";

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { currentTrack } = useMusicPlayer();
  const {
    sources,
    selectedSourceId,
    selectSource,
    articles,
    isLoading,
    isRefetching,
    error,
    refresh,
  } = useNewsFeed();
  const selectArticle = useSelectedArticleStore((s) => s.select);
  const {
    isActive,
    formattedRemaining,
    isFinalMinute,
    endSession,
    recordArticleOpened,
  } = useSessionTimer();

  const openArticle = (item: NewsArticle) => {
    selectArticle(item);
    recordArticleOpened();
    router.push({
      pathname: "/news/[id]",
      params: { id: item.id, url: item.link, title: item.title },
    });
  };

  const confirmEndEarly = () => {
    Alert.alert("End break early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End break",
        style: "destructive",
        onPress: () => void endSession("ENDED_EARLY"),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          paddingTop: Math.max(insets.top + 8, 48),
        },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <IconButton
          icon="back"
          theme={themeId}
          onPress={() => router.back()}
          accessibilityLabel="Back to room"
        />
        {isActive ? (
          <SessionTimerPill
            time={formattedRemaining}
            highlighted={isFinalMinute}
            onEndPress={confirmEndEarly}
            theme={themeId}
          />
        ) : null}
      </View>

      {/* Editorial Header */}
      <View style={styles.headingBlock}>
        <Text style={[styles.heading, { color: palette.text }]}>News</Text>
        <Text style={[styles.sub, { color: palette.textSecondary }]}>
          vnexpress.net · Music keeps playing while you read.
        </Text>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label="All"
            selected={selectedSourceId === null}
            theme={themeId}
            onPress={() => selectSource(null)}
          />
          {sources.map((src) => (
            <Chip
              key={src.id}
              label={src.title}
              selected={selectedSourceId === src.id}
              theme={themeId}
              onPress={() => selectSource(src.id)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading && articles.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : error && articles.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.error, { color: palette.danger }]}>
            Could not load news feed
          </Text>
          <Button
            label="Retry"
            size="md"
            theme={themeId}
            onPress={() => void refresh()}
          />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(it) => it.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: currentTrack ? 120 : 32 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              tintColor={palette.accent}
              onRefresh={() => void refresh()}
            />
          }
          renderItem={({ item }) => (
            <NewsCard
              title={item.title}
              category={item.source}
              summary={item.summary}
              imageUrl={item.imageUrl}
              publishedAt={item.publishedAt}
              theme={themeId}
              onPress={() => openArticle(item)}
            />
          )}
        />
      )}

      {currentTrack ? (
        <View
          style={[
            styles.miniDock,
            { paddingBottom: Math.max(insets.bottom + 8, 16) },
          ]}
        >
          <MiniPlayer theme={themeId} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headingBlock: {
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 4,
  },
  heading: {
    ...Typography.presets.h1,
  },
  sub: {
    fontSize: Typography.sizes.sm,
  },
  chipsWrap: {
    paddingVertical: 14,
  },
  chips: {
    paddingHorizontal: 20,
    gap: 8,
  },
  list: {
    paddingHorizontal: 16,
    gap: Spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  error: {
    fontSize: Typography.sizes.sm,
  },
  miniDock: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
});
