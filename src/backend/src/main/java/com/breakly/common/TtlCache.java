package com.breakly.common;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

// Minimal in-memory TTL cache used to shield upstream providers (Jamendo, RSS, YouTube) from repeated calls.
// Serves the last successful value as a stale fallback when a refresh fails.
public class TtlCache<K, V> {

    private record Entry<V>(V value, Instant expiresAt) {
    }

    private final ConcurrentHashMap<K, Entry<V>> store = new ConcurrentHashMap<>();
    private final Duration ttl;
    private final Clock clock;

    public TtlCache(Duration ttl) {
        this(ttl, Clock.systemUTC());
    }

    public TtlCache(Duration ttl, Clock clock) {
        this.ttl = ttl;
        this.clock = clock;
    }

    /**
     * Returns a fresh cached value, or loads a new one. If loading fails and a stale value exists,
     * the stale value is returned instead of propagating the error.
     */
    public V get(K key, Supplier<V> loader) {
        Entry<V> entry = store.get(key);
        Instant now = clock.instant();
        if (entry != null && entry.expiresAt().isAfter(now)) {
            return entry.value();
        }
        try {
            V value = loader.get();
            store.put(key, new Entry<>(value, now.plus(ttl)));
            return value;
        } catch (RuntimeException ex) {
            if (entry != null) {
                return entry.value();
            }
            throw ex;
        }
    }

    public Optional<V> peek(K key) {
        return Optional.ofNullable(store.get(key)).map(Entry::value);
    }

    public void invalidate(K key) {
        store.remove(key);
    }

    public void clear() {
        store.clear();
    }
}

