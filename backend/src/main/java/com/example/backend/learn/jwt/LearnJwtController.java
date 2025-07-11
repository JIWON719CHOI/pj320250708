package com.example.backend.learn.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/learn/jwt")
@RequiredArgsConstructor
public class LearnJwtController {

    private final JwtEncoder jwtEncoder;

    /**
     * [1] 로그인 → JWT 발급
     * POST /sub1
     * RequestBody: { "email": "...", "password": "..." }
     * → subject, issuer, issuedAt, expiresAt, scp 클레임 설정
     */
    @PostMapping("sub1")
    public String issueToken(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        System.out.println("📩 로그인 시도: email=" + email + ", password=" + password);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(email)                                          // sub: 토큰 주인
                .issuer("self")                                          // iss: 발급자
                .issuedAt(Instant.now())                                 // iat: 발급 시각
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))// exp: 1년 후 만료
                .claim("scp", "admin user manager")                      // scp: 권한 문자열
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    /**
     * [2] 인증 여부 확인 (토큰 유무 관계없이 접근 가능)
     * GET /sub2
     * → authentication == null 이면 “인증 안됨” 리턴
     */
    @GetMapping("sub2")
    public String checkAuth(Authentication authentication) {
        System.out.println("🔍 /sub2 요청");
        if (authentication == null) {
            System.out.println("🚫 인증 안됨");
            return "❗ 인증되지 않은 사용자입니다.";
        } else {
            String user = authentication.getName();
            System.out.println("✅ 인증된 사용자: " + user);
            return "👋 환영, " + user + "님!";
        }
    }

    /**
     * [3] 인증된 사용자만 접근 가능
     * GET /sub3
     * → @PreAuthorize("isAuthenticated()")
     */
    @GetMapping("sub3")
    @PreAuthorize("isAuthenticated()")
    public String protectedEndpoint(Authentication authentication) {
        String user = authentication.getName();
        System.out.println("🔒 /sub3 접근 허용: " + user);
        return "🎉 인증된 사용자만 접근 가능합니다: " + user;
    }

    /**
     * [6] 일반 유저용 토큰 발급
     * GET /sub6
     * → scp="user"
     */
    @GetMapping("sub6")
    public String issueUserToken() {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject("user@example.com")
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))
                .claim("scp", "user")
                .build();

        System.out.println("👤 /sub6 일반 유저 토큰 발급");
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    /**
     * [7] 관리자 토큰 발급
     * GET /sub7
     * → scp="admin"
     */
    @GetMapping("sub7")
    public String issueAdminToken() {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject("admin@example.com")
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))
                .claim("scp", "admin")
                .build();

        System.out.println("🛡️ /sub7 관리자 토큰 발급");
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    /**
     * [8] 매니저 토큰 발급
     * GET /sub8
     * → scp="manager"
     */
    @GetMapping("sub8")
    public String issueManagerToken() {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject("manager@example.com")
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))
                .claim("scp", "manager")
                .build();

        System.out.println("👔 /sub8 매니저 토큰 발급");
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    /**
     * [9] 관리자 전용 리소스
     * GET /sub9
     * → @PreAuthorize("hasAuthority('SCOPE_admin')")
     */
    @GetMapping("sub9")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public String adminOnly() {
        System.out.println("🛡️ /sub9 관리자 접근 허용");
        return "👑 관리자 전용 리소스입니다.";
    }

    /**
     * [10] 매니저 전용 리소스
     * GET /sub10
     * → @PreAuthorize("hasAuthority('SCOPE_manager')")
     */
    @GetMapping("sub10")
    @PreAuthorize("hasAuthority('SCOPE_manager')")
    public String managerOnly() {
        System.out.println("👔 /sub10 매니저 접근 허용");
        return "📂 매니저 전용 리소스입니다.";
    }
}
