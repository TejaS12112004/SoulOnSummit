package com.trekmanagement.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuth2CodeRepository extends JpaRepository<OAuth2Code, Long> {
    Optional<OAuth2Code> findByCodeHash(String codeHash);
    
    @Modifying
    @Query("DELETE FROM OAuth2Code c WHERE c.id = :id AND c.expiresAt > CURRENT_TIMESTAMP")
    int consumeCodeById(@Param("id") Long id);
}
