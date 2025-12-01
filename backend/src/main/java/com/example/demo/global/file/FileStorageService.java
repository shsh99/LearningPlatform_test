package com.example.demo.global.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/x-icon", "image/webp"
    );

    private static final Set<String> ALLOWED_FONT_TYPES = Set.of(
        "font/ttf", "font/otf", "font/woff", "font/woff2",
        "application/x-font-ttf", "application/x-font-otf",
        "application/font-woff", "application/font-woff2"
    );

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_FONT_SIZE = 10 * 1024 * 1024; // 10MB

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
            Files.createDirectories(this.uploadPath.resolve("logos"));
            Files.createDirectories(this.uploadPath.resolve("favicons"));
            Files.createDirectories(this.uploadPath.resolve("fonts"));
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 디렉토리를 생성할 수 없습니다.", e);
        }
    }

    public String uploadLogo(MultipartFile file, Long tenantId) {
        validateImageFile(file);
        return uploadFile(file, "logos", "logo_" + tenantId);
    }

    public String uploadFavicon(MultipartFile file, Long tenantId) {
        validateImageFile(file);
        return uploadFile(file, "favicons", "favicon_" + tenantId);
    }

    public String uploadFont(MultipartFile file, Long tenantId) {
        validateFontFile(file);
        return uploadFile(file, "fonts", "font_" + tenantId);
    }

    private String uploadFile(MultipartFile file, String subDir, String prefix) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String newFilename = prefix + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            Path targetPath = this.uploadPath.resolve(subDir).resolve(newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return "/api/files/" + subDir + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage(), e);
        }
    }

    public byte[] getFile(String subDir, String filename) {
        try {
            Path filePath = this.uploadPath.resolve(subDir).resolve(filename).normalize();

            // 경로 탐색 공격 방지
            if (!filePath.startsWith(this.uploadPath)) {
                throw new RuntimeException("잘못된 파일 경로입니다.");
            }

            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일을 찾을 수 없습니다: " + filename, e);
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            // URL에서 파일 경로 추출: /api/files/logos/filename.png -> logos/filename.png
            String relativePath = fileUrl.replace("/api/files/", "");
            Path filePath = this.uploadPath.resolve(relativePath).normalize();

            if (filePath.startsWith(this.uploadPath)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // 삭제 실패는 무시 (로그만 기록)
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("이미지 파일은 5MB를 초과할 수 없습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("허용되지 않는 이미지 형식입니다. (허용: JPEG, PNG, GIF, SVG, ICO, WebP)");
        }
    }

    private void validateFontFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        if (file.getSize() > MAX_FONT_SIZE) {
            throw new IllegalArgumentException("폰트 파일은 10MB를 초과할 수 없습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!Set.of(".ttf", ".otf", ".woff", ".woff2").contains(extension)) {
                throw new IllegalArgumentException("허용되지 않는 폰트 형식입니다. (허용: TTF, OTF, WOFF, WOFF2)");
            }
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";
    }

    public String getContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return switch (extension) {
            case ".png" -> "image/png";
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".gif" -> "image/gif";
            case ".svg" -> "image/svg+xml";
            case ".ico" -> "image/x-icon";
            case ".webp" -> "image/webp";
            case ".ttf" -> "font/ttf";
            case ".otf" -> "font/otf";
            case ".woff" -> "font/woff";
            case ".woff2" -> "font/woff2";
            default -> "application/octet-stream";
        };
    }
}
