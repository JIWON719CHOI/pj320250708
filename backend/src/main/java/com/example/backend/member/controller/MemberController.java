package com.example.backend.member.controller;

import com.example.backend.member.dto.*;
import com.example.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public MemberDto get(String email) {
        return memberService.get(email);
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestBody MemberForm memberForm) {
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
    public ResponseEntity<?> update(@RequestBody MemberForm memberForm) {
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
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordForm data) {

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
    public String login(@RequestBody MemberLoginForm loginForm) {
        System.out.println("MemberController.login");
        return null;
    }
}