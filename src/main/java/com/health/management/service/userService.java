package com.health.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.health.management.model.users;
import com.health.management.repository.userRepository;

@Service
public class userService {

    @Autowired
    public userRepository userrepository;

    public String registerUser(users user) {
        if(userrepository.existsByEmail(user.getEmail())){
            return "User already exists";
        }
        else{
            userrepository.save(user);
            return "User registered successfully";
        }
    }

    public users loginUser(users user) {
        users existingUser = userrepository.findByEmail(user.getEmail());
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return existingUser;
        }
        return null;
    }
}
