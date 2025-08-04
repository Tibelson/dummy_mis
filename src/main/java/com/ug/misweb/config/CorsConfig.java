package com.ug.misweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean(name= "customConfigurationSource")
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins for development (customize for production)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Allow common frontend ports
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",    // React default
            "http://localhost:3001",    // React alternative
            "http://localhost:4200",    // Angular default
            "http://localhost:8080",    // Vue default
            "http://localhost:5173",    // Vite default
            "http://localhost:4000",    // Svelte default
            "http://127.0.0.1:3000",
            "http://127.0.0.1:4200"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 