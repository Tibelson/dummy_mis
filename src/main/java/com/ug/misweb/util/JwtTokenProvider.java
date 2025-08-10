package com.ug.misweb.util;

import com.ug.misweb.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;

    // Lightweight, dev-friendly token format: dev.<base64(username:expiry)>
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        long expiry = now.getTime() + jwtExpirationInMs;
        String payload = userPrincipal.getUsername() + ":" + expiry;
        String encoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return "dev." + encoded;
    }

    public String generateToken(User user) {
        Date now = new Date();
        long expiry = now.getTime() + jwtExpirationInMs;
        String payload = user.getUsername() + ":" + expiry;
        String encoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return "dev." + encoded;
    }

    public String getUsernameFromJWT(String token) {
        try {
            String encoded = token.startsWith("dev.") ? token.substring(4) : token;
            String decoded = new String(Base64.getUrlDecoder().decode(encoded), StandardCharsets.UTF_8);
            int sep = decoded.lastIndexOf(':');
            if (sep <= 0) return null;
            return decoded.substring(0, sep);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String authToken) {
        try {
            String encoded = authToken.startsWith("dev.") ? authToken.substring(4) : authToken;
            String decoded = new String(Base64.getUrlDecoder().decode(encoded), StandardCharsets.UTF_8);
            int sep = decoded.lastIndexOf(':');
            if (sep <= 0) return false;
            long expiry = Long.parseLong(decoded.substring(sep + 1));
            return System.currentTimeMillis() < expiry;
        } catch (Exception e) {
            return false;
        }
    }
}