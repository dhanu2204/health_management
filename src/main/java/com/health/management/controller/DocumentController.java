package com.health.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.health.management.model.MedicalDocument;
import com.health.management.service.DocumentService;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public String uploadDocument(
            @RequestParam("file") MultipartFile file, 
            @RequestParam("userId") int userId,
            @RequestParam(value = "aiAnalysis", required = false) String aiAnalysis) {
        return documentService.uploadDocument(file, userId, aiAnalysis);
    }

    @GetMapping("/user/{userId}")
    public List<MedicalDocument> getDocuments(@PathVariable int userId) {
        return documentService.getDocumentsByUser(userId);
    }

    @DeleteMapping("/{docId}")
    public String deleteDocument(@PathVariable int docId) {
        return documentService.deleteDocument(docId);
    }
}
