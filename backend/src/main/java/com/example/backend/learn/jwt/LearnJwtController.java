package com.example.backend.learn.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/learn/jwt")
@RequiredArgsConstructor
public class LearnJwtController {

    private final JwtEncoder jwtEncoder;

    @PostMapping("sub1")
    public void sub1(Map<String, String> data) {
        System.out.println("📨 = " + data.get("email"));
        System.out.println("🗝️= " + data.get("password"));

        // jwt 토큰 완성
        // sign 어떻게, 정보(claim, payload), sign
        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .claim("email", data.get("email"))
                .claim("password", data.get("password"))
                .claim("roles", "")
                .claim("nickname", "")
                .build();

        // jwt 응답
        return JwtEncoder
                .encode(JwtEncoderParameters.from(claimsSet))
                .getTokenValue();
    }
}
