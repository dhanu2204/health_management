package com.health.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.health.management.model.users;

@Repository
public interface userRepository extends JpaRepository<users, Integer> {

    boolean existsByEmail(String email);
    users findByEmail(String email);

    
}
