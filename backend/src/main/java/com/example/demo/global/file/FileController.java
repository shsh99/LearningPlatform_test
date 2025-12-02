package com.example.demo.global.file;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * 로고 이미지 업로드
     */
    @PostMapping("/logo")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadLogo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tenantId") Long tenantId,
            Authentication authentication) {

        String fileUrl = fileStorageService.uploadLogo(file, tenantId);
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "message", "로고가 성공적으로 업로드되었습니다."
        ));
    }

    /**
     * 파비콘 이미지 업로드
     */
    @PostMapping("/favicon")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFavicon(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tenantId") Long tenantId,
            Authentication authentication) {

        String fileUrl = fileStorageService.uploadFavicon(file, tenantId);
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "message", "파비콘이 성공적으로 업로드되었습니다."
        ));
    }

    /**
     * 폰트 파일 업로드
     */
    @PostMapping("/font")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFont(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tenantId") Long tenantId,
            Authentication authentication) {

        String fileUrl = fileStorageService.uploadFont(file, tenantId);
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "message", "폰트가 성공적으로 업로드되었습니다."
        ));
    }

    /**
     * 배너 이미지 업로드
     */
    @PostMapping("/banner")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tenantId") Long tenantId,
            Authentication authentication) {

        String fileUrl = fileStorageService.uploadBanner(file, tenantId);
        return ResponseEntity.ok(Map.of(
            "url", fileUrl,
            "message", "배너 이미지가 성공적으로 업로드되었습니다."
        ));
    }

    /**
     * 파일 조회 (로고, 파비콘, 폰트, 배너) - 공개 접근 가능
     */
    @GetMapping("/{subDir}/{filename}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable String subDir,
            @PathVariable String filename) {

        // 허용된 디렉토리만 접근 가능
        if (!subDir.matches("^(logos|favicons|fonts|banners)$")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        byte[] fileContent = fileStorageService.getFile(subDir, filename);
        String contentType = fileStorageService.getContentType(filename);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setCacheControl("max-age=31536000"); // 1년 캐시

        return ResponseEntity.ok()
            .headers(headers)
            .body(fileContent);
    }

    /**
     * 파일 삭제
     */
    @DeleteMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteFile(
            @RequestParam("url") String fileUrl,
            Authentication authentication) {

        fileStorageService.deleteFile(fileUrl);
        return ResponseEntity.ok(Map.of("message", "파일이 삭제되었습니다."));
    }
}
