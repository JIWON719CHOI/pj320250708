package com.example.backend.member.service;

import com.example.backend.member.dto.ChangePasswordForm;
import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public void add(MemberForm memberForm) {

        if (this.validate(memberForm)) {
            Member member = new Member();
            member.setEmail(memberForm.getEmail());
            member.setPassword(memberForm.getPassword());
            member.setInfo(memberForm.getInfo());
            member.setNickName(memberForm.getNickName());

            memberRepository.save(member);
        }
    }

    private boolean validate(MemberForm memberForm) {
        String email = memberForm.getEmail().trim();
        String password = memberForm.getPassword().trim();
        String nickName = memberForm.getNickName().trim();

        // 1. 이메일: 비어 있는지 + 형식 + 중복
        if (email.isBlank()) {
            throw new RuntimeException("이메일을 입력해야 합니다.");
        }

        // 이메일 형식 (RFC 5322 간단 버전)
        String emailRegex = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        if (!Pattern.matches(emailRegex, email)) {
            throw new RuntimeException("이메일 형식에 맞지 않습니다.");
        }

        // 중복 이메일
        if (memberRepository.findById(email).isPresent()) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }

        // 2. 비밀번호: 비어 있는지 + 복잡도
        if (password.isBlank()) {
            throw new RuntimeException("비밀번호를 입력해야 합니다.");
        }

        // 8자 이상, 영문 대/소문자, 숫자, 특수문자 1개 이상 포함
        String pwRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{8,}$";
        if (!Pattern.matches(pwRegex, password)) {
            throw new RuntimeException("비밀번호는 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.");
        }

        // 3. 닉네임: 비어 있는지 + 형식 + 중복
        if (nickName.isBlank()) {
            throw new RuntimeException("닉네임을 입력해야 합니다.");
        }

        // 닉네임: 한글, 영문, 숫자만 허용, 2~20자
        String nickRegex = "^[가-힣a-zA-Z0-9]{2,20}$";
        if (!Pattern.matches(nickRegex, nickName)) {
            throw new RuntimeException("닉네임은 2~20자이며, 한글, 영문, 숫자만 사용할 수 있습니다.");
        }

        if (memberRepository.findByNickName(nickName).isPresent()) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        return true;
    }


    public List<MemberListInfo> list() {
        return memberRepository.findAllBy();
    }

    public MemberDto get(String email) {
        Member db = memberRepository.findById(email).get();

        MemberDto memberDto = new MemberDto();
        memberDto.setEmail(db.getEmail());
        memberDto.setNickName(db.getNickName());
        memberDto.setInfo(db.getInfo());
        memberDto.setInsertedAt(db.getInsertedAt());

        return memberDto;
    }

    public void delete(MemberForm memberForm) {
        Member db = memberRepository.findById(memberForm.getEmail()).get();
        if (db.getPassword().equals(memberForm.getPassword())) {
            memberRepository.delete(db);
        } else {
            throw new RuntimeException("암호가 일치하지 않습니다.");
        }
    }

    public void update(MemberForm memberForm) {
        // 조회
        Member db = memberRepository.findById(memberForm.getEmail()).get();
        // 암호 확인
        if (!db.getPassword().equals(memberForm.getPassword())) {
            throw new RuntimeException("암호가 일치하지 않습니다.");
        }
        // 변경
        db.setNickName(memberForm.getNickName());
        db.setInfo(memberForm.getInfo());
        // 저장
        memberRepository.save(db);
    }

    public void changePassword(ChangePasswordForm data) {
        Member db = memberRepository.findById(data.getEmail()).get();
        if (db.getPassword().equals(data.getOldPassword())) {
            db.setPassword(data.getNewPassword());
            memberRepository.save(db);
        } else {
            throw new RuntimeException("이전 비밀번호가 일치하지 않습니다.");
        }
    }
}