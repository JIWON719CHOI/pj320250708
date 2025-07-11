package com.example.backend.member.controller;

import com.example.backend.member.dto.*;
import com.example.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("add")
    public ResponseEntity<?> add(@RequestBody MemberForm memberForm) {
        try {
            memberService.add(memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 가입 되었습니다."))
        );
    }

    @GetMapping("list")
    public List<MemberListInfo> list() {
        return memberService.list();
    }

    @GetMapping(params = "email")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> get(String email, Authentication authentication) {
        if (authentication.getName().equals(email)) {
            return ResponseEntity.ok().body(memberService.get(email));
        } else {
            return ResponseEntity.status(403).build();
        }

    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> delete(@RequestBody MemberForm memberForm,
                                    Authentication authentication) {

        if (!authentication.getName().equals(memberForm.getEmail())) {
            return ResponseEntity.status(403).build();
        }

        try {
            memberService.delete(memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body( // 권한 없음
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 정보가 삭제되었습니다.")));
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> update(@RequestBody MemberForm memberForm,
                                    Authentication authentication) {

        if (!authentication.getName().equals(memberForm.getEmail())) {
            return ResponseEntity.status(403).build();
        }

        try {
            memberService.update(memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body( // 권한 없음
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 정보가 수정되었습니다.")));
    }

    @PutMapping("changePassword")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordForm data,
                                            Authentication authentication) {

        if (!authentication.getName().equals(data.getEmail())) {
            return ResponseEntity.status(403).build();
        }

        try {
            memberService.changePassword(data);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body( // 권한 없음
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "비밀번호가 수정되었습니다.")));
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody MemberLoginForm loginForm) {
        try {
            String token = memberService.getToken(loginForm);
            return ResponseEntity.ok().body(
                    Map.of("token", token, "message",
                            Map.of("type", "success",
                                    "text", " 로그인 되었습니다.")));
        } catch (Exception e) {
            String message = e.getMessage();
            return ResponseEntity.status(403).body( // 권한 없음
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
    }
}