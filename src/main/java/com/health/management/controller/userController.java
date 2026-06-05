package com.health.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.health.management.model.users;
import com.health.management.service.userService;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class userController {

    @Autowired
    private userService userservice;

    @PostMapping("/register")
    public String registerUser(@RequestBody users user){
        return userservice.registerUser(user);
    }

    @PostMapping("/login")
    public users loginUser(@RequestBody users user){
        return userservice.loginUser(user);
    }
}
