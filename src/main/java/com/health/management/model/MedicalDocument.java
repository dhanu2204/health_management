package com.health.management.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "medical_documents")
public class MedicalDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private users user;

    private String fileurl;
    private String documentType;
    private String uploadeDate;
    
    @Column(columnDefinition="TEXT")
    private String aiAnalysis;
}
