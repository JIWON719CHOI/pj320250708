package com.example.backend.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "1234";  // 암호화할 원문 비밀번호
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println(encodedPassword);
    }
}
