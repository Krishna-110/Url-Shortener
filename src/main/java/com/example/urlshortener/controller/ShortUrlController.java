package com.example.urlshortener.controller;

import com.example.urlshortener.model.ShortUrl;
import com.example.urlshortener.service.ShortUrlService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class ShortUrlController {
    @Autowired
    private ShortUrlService service;

    @PostMapping("/api/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody ShortenRequest request) {
        try {
            ShortUrl shortUrl = service.createShortUrl(request.getOriginalUrl(), request.getExpiryAt());
            Map<String, Object> response = new HashMap<>();
            response.put("shortUrl", "/" + shortUrl.getShortCode());
            response.put("originalUrl", shortUrl.getOriginalUrl());
            response.put("expiryAt", shortUrl.getExpiryAt());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirect(@PathVariable String shortCode) {
        Optional<ShortUrl> shortUrlOpt = service.getByShortCode(shortCode);
        if (shortUrlOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Short URL not found or expired"));
        }
        ShortUrl shortUrl = shortUrlOpt.get();
        service.incrementClickCount(shortUrl);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(shortUrl.getOriginalUrl()));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/api/urls")
    public List<ShortUrl> getAllUrls() {
        return service.getAllUrls();
    }

    @PatchMapping("/api/urls/{shortCode}/expiry")
    public ResponseEntity<?> updateExpiry(@PathVariable String shortCode, @RequestBody ExpiryRequest request) {
        Optional<ShortUrl> shortUrlOpt = service.getByShortCode(shortCode);
        if (shortUrlOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Short URL not found"));
        }
        ShortUrl shortUrl = shortUrlOpt.get();
        // In a real app, check if the authenticated user owns this shortUrl
        shortUrl.setExpiryAt(request.getExpiryAt());
        service.save(shortUrl);
        return ResponseEntity.ok(Map.of("message", "Expiry updated", "expiryAt", shortUrl.getExpiryAt()));
    }

    @DeleteMapping("/api/urls/{shortCode}")
    public ResponseEntity<?> deleteShortUrl(@PathVariable String shortCode) {
        Optional<ShortUrl> shortUrlOpt = service.getByShortCode(shortCode);
        if (shortUrlOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Short URL not found"));
        }
        service.delete(shortUrlOpt.get());
        return ResponseEntity.ok(Map.of("message", "Short URL deleted"));
    }

    @Data
    public static class ShortenRequest {
        private String originalUrl;
        private LocalDateTime expiryAt; // Optional
    }

    @Data
    public static class ExpiryRequest {
        private LocalDateTime expiryAt;
    }
} 