package com.example.backend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/board")
public class BoardController {

    @PostMapping("add")
    @ResponseBody
    public String add(@RequestBody BoardDto dto) {
        System.out.println(dto);
        return null;
    }
}
