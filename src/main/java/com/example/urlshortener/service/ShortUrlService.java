package com.example.urlshortener.service;

import com.example.urlshortener.model.ShortUrl;
import com.example.urlshortener.repository.ShortUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class ShortUrlService {
    private static final String BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int SHORT_CODE_LENGTH = 8;
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?://)?([\\w.-]+)+(:\\d+)?(/([\\w/_.]*)?)?$", Pattern.CASE_INSENSITIVE);

    @Autowired
    private ShortUrlRepository repository;

    public ShortUrl createShortUrl(String originalUrl, LocalDateTime expiryAt) {
        if (!isValidUrl(originalUrl)) {
            throw new IllegalArgumentException("Invalid URL format");
        }
        String shortCode = generateUniqueShortCode();
        ShortUrl shortUrl = ShortUrl.builder()
                .originalUrl(originalUrl)
                .shortCode(shortCode)
                .createdAt(LocalDateTime.now())
                .expiryAt(expiryAt)
                .clickCount(0L)
                .build();
        return repository.save(shortUrl);
    }

    public Optional<ShortUrl> getByShortCode(String shortCode) {
        Optional<ShortUrl> shortUrlOpt = repository.findByShortCode(shortCode);
        if (shortUrlOpt.isPresent()) {
            ShortUrl shortUrl = shortUrlOpt.get();
            if (shortUrl.getExpiryAt() != null && shortUrl.getExpiryAt().isBefore(LocalDateTime.now())) {
                repository.delete(shortUrl);
                return Optional.empty();
            }
        }
        return shortUrlOpt;
    }

    public List<ShortUrl> getAllUrls() {
        return repository.findAll();
    }

    public void incrementClickCount(ShortUrl shortUrl) {
        shortUrl.setClickCount(shortUrl.getClickCount() + 1);
        repository.save(shortUrl);
    }

    public ShortUrl save(ShortUrl shortUrl) {
        return repository.save(shortUrl);
    }

    public void delete(ShortUrl shortUrl) {
        repository.delete(shortUrl);
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            code = randomBase62(SHORT_CODE_LENGTH);
        } while (repository.findByShortCode(code).isPresent());
        return code;
    }

    private String randomBase62(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(BASE62.charAt(random.nextInt(BASE62.length())));
        }
        return sb.toString();
    }

    private boolean isValidUrl(String url) {
        return URL_PATTERN.matcher(url).matches();
    }
} 