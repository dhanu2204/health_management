package com.health.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.health.management.model.MedicalDocument;
import java.util.List;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Integer> {
    List<MedicalDocument> findByUserId(int userId);
}
