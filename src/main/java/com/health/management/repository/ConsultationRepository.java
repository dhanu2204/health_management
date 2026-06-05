package com.health.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.health.management.model.ConsultationData;

@Repository
public interface ConsultationRepository extends JpaRepository<ConsultationData, Integer> {
}
