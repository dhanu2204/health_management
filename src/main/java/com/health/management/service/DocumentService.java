package com.health.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.health.management.model.MedicalDocument;
import com.health.management.model.users;
import com.health.management.repository.MedicalDocumentRepository;
import com.health.management.repository.userRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.time.LocalDate;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private MedicalDocumentRepository documentRepository;

    @Autowired
    private userRepository userRepository;

    public String uploadDocument(MultipartFile file, int userId, String aiAnalysis) {
        users user = userRepository.findById(userId).orElse(null);
        if (user == null)
            return "User not found";

        try {
            // 1. Create a physical 'uploads' folder on your hard drive if it doesn't exist
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Physically copy the image from the internet request into the 'uploads'
            // folder
            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 3. Save the database record (just like before)
            MedicalDocument doc = new MedicalDocument();
            doc.setUser(user);
            doc.setFileurl("uploads/" + file.getOriginalFilename()); // This matches the folder name
            doc.setDocumentType("Prescription");
            doc.setUploadeDate(LocalDate.now().toString());
            doc.setAiAnalysis(aiAnalysis);

            documentRepository.save(doc);

            return "Upload successful!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload file: " + e.getMessage();
        }
    }

    public List<MedicalDocument> getDocumentsByUser(int userId) {
        return documentRepository.findByUserId(userId);
    }

    public String deleteDocument(int docId) {
        MedicalDocument doc = documentRepository.findById(docId).orElse(null);
        if (doc == null) return "Document not found";

        try {
            // Delete the physical file
            Path filePath = Paths.get(doc.getFileurl());
            Files.deleteIfExists(filePath);
            
            // Delete from database
            documentRepository.deleteById(docId);
            return "Document deleted successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to delete document: " + e.getMessage();
        }
    }
}
