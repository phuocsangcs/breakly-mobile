package com.breakly.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breakly.entity.UserPreference;

// Repository for UserPreference entity persistence operations (primary key = user id).
public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {
}
