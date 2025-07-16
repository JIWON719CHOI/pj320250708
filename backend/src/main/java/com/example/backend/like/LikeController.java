package com.example.backend.like;

import com.example.backend.like.dto.LikeForm;
import com.example.backend.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class LikeController {

    private final LikeService likeService;

    @PutMapping
    public void like(@RequestBody LikeForm likeForm, Authentication authentication) {
        likeService.update(likeForm, authentication);
    }

    @GetMapping("/count")
    public int likeCount(@RequestParam Integer boardId) {
        return likeService.count(boardId);
    }


}
