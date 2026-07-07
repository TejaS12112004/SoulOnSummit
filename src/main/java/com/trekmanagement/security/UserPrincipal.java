package com.trekmanagement.security;

import com.trekmanagement.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Spring Security principal wrapping the User domain entity.
 * Constructed on each authenticated request — never stored in session (stateless).
 */
@Getter
public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final String roleName;
    private final boolean emailVerified;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    private UserPrincipal(User user) {
        this.id            = user.getId();
        this.email         = user.getEmail();
        this.passwordHash  = user.getPasswordHash();
        this.roleName      = user.getRole().getName();
        this.emailVerified = user.isEmailVerified();
        this.active        = user.isActive();
        this.authorities   = List.of(new SimpleGrantedAuthority(user.getRole().getName()));
    }

    public static UserPrincipal from(User user) {
        return new UserPrincipal(user);
    }

    // ── UserDetails contract ─────────────────────────────────────────────────

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    /**
     * Account is non-expired for all active users.
     * Suspension is handled via {@code isActive}.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Locking based on failed_attempts is enforced in AuthServiceImpl.
     * Spring Security locking is not used here to allow customised error messages.
     */
    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Account is enabled once email is verified AND the account is active.
     */
    @Override
    public boolean isEnabled() {
        return emailVerified && active;
    }
}
