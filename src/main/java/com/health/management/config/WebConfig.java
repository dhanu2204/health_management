package com.health.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // The Flow: This tells Spring Boot: "If React asks for a URL starting with /uploads/, 
        // don't block it! Instead, look inside the physical 'uploads' folder on the hard drive."
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
