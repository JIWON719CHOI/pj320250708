//package com.example.backend.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/boardFile/**")
//                .addResourceLocations("file:///C:/Temp/prj3/boardFile/");
//    }
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/boardFile/**")
//                .allowedOrigins("http://localhost:5173") // 프론트엔드 주소
//                .allowedMethods("GET", "HEAD");
//    }
//}