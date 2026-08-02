package com.trekmanagement.settings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, UUID> {

    @Query("SELECT s FROM SiteSettings s")
    Optional<SiteSettings> findSingleton();
}
