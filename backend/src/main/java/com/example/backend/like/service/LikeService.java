package com.example.backend.like.service;

import com.example.backend.like.dto.LikeForm;
import com.example.backend.like.entity.BoardLike;
import com.example.backend.like.entity.BoardLikeId;
import com.example.backend.like.repository.BoardLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final BoardLikeRepository boardLikeRepository;

    public void update(LikeForm likeForm, Authentication authentication) {
        // 로그인 안했으면 exception
        if (authentication == null) {
            throw new RuntimeException("로그인 하세요");
        }
        // 게시물 번호와 로그인 이메일로 like 데이터 얻어서
        var boardLike = boardLikeRepository.findByBoardIdAndMemberEmail(likeForm.getBoardId(), authentication.getName());

        // 있으면 지우고
        if (boardLike.isPresent()) {
            boardLikeRepository.delete(boardLike.get());
        } else {
            // 없으면 insert
            BoardLike boardLikeEntity = new BoardLike();
            BoardLikeId boardLikeId = new BoardLikeId();
            boardLikeId.setMemberEmail(authentication.getName());
            boardLikeEntity.setId(boardLikeId);
            boardLikeRepository.save(boardLikeEntity);
        }
    }
}
