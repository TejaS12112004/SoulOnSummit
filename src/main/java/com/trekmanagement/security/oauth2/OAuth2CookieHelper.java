package com.trekmanagement.security.oauth2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.Collection;
import java.util.HashSet;

@Component
public class OAuth2CookieHelper {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String cookieSecret;
    
    public OAuth2CookieHelper(@Value("${jwt.secret:fallback-secret-key-123456789012345678901234567890}") String cookieSecret) {
        this.cookieSecret = cookieSecret;
    }

    public String serialize(OAuth2AuthorizationRequest request) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("authorizationUri", request.getAuthorizationUri());
            data.put("clientId", request.getClientId());
            data.put("redirectUri", request.getRedirectUri());
            data.put("scopes", request.getScopes());
            data.put("state", request.getState());
            data.put("additionalParameters", request.getAdditionalParameters());
            data.put("attributes", request.getAttributes());

            String json = objectMapper.writeValueAsString(data);
            String encodedJson = Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
            String signature = calculateHmac(encodedJson);
            
            return encodedJson + "." + signature;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize OAuth2 request", e);
        }
    }

    @SuppressWarnings("unchecked")
    public OAuth2AuthorizationRequest deserialize(String cookieValue) {
        if (cookieValue == null || !cookieValue.contains(".")) {
            return null;
        }

        String[] parts = cookieValue.split("\\.");
        if (parts.length != 2) {
            return null;
        }

        String encodedJson = parts[0];
        String signature = parts[1];

        if (!calculateHmac(encodedJson).equals(signature)) {
            // Tampered cookie
            return null;
        }

        try {
            String json = new String(Base64.getUrlDecoder().decode(encodedJson), StandardCharsets.UTF_8);
            Map<String, Object> data = objectMapper.readValue(json, Map.class);

            Set<String> scopes = null;
            if (data.get("scopes") != null) {
                scopes = new HashSet<>((Collection<String>) data.get("scopes"));
            }

            return OAuth2AuthorizationRequest.authorizationCode()
                    .authorizationUri((String) data.get("authorizationUri"))
                    .clientId((String) data.get("clientId"))
                    .redirectUri((String) data.get("redirectUri"))
                    .scopes(scopes)
                    .state((String) data.get("state"))
                    .additionalParameters((Map<String, Object>) data.get("additionalParameters"))
                    .attributes((Map<String, Object>) data.get("attributes"))
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    private String calculateHmac(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(cookieSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC", e);
        }
    }
}
