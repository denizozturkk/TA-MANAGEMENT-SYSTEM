package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.TutorGraderApplicationDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.TutorGraderApplication;
import edu.bilkent.cs319.team9.ta_management_system.service.TutorGraderApplicationService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class TutorGraderApplicationController {

    private final TutorGraderApplicationService service;
    private final EntityMapperService            mapper;
    private final ObjectMapper                   objectMapper;
    private final Path                           uploadDir = Paths.get("uploads");

    public TutorGraderApplicationController(TutorGraderApplicationService service,
                                            EntityMapperService mapper,
                                            ObjectMapper objectMapper) {
        this.service       = service;
        this.mapper        = mapper;
        this.objectMapper  = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload folder", e);
        }
    }

    /**
     * Create a new application.
     * multipart/form-data:
     *   - field "data"       : JSON string → TutorGraderApplicationDto
     *   - field "transcript" : file
     */
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<TutorGraderApplicationDto> createApplication(
            @RequestParam("data") String dtoJson,
            @RequestPart("transcript") MultipartFile transcriptFile
    ) throws IOException {
        // 0) deserialize JSON into your DTO
        TutorGraderApplicationDto dto =
                objectMapper.readValue(dtoJson, TutorGraderApplicationDto.class);

        // 1) store the file
        String filename = System.currentTimeMillis() + "_" +
                Paths.get(transcriptFile.getOriginalFilename())
                        .getFileName()
                        .toString();
        Path target = uploadDir.resolve(filename);
        Files.copy(transcriptFile.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING);

        // 2) map DTO → entity, fill in file path + timestamp
        TutorGraderApplication entity = mapper.toEntity(dto);
        entity.setTranscriptPath(target.toString());
        entity.setSubmittedAt(LocalDateTime.now());

        // 3) delegate to your existing service which takes an entity
        TutorGraderApplication saved = service.create(entity);

        // 4) map back entity → DTO and return 201
        TutorGraderApplicationDto result = mapper.toDto(saved);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    /** List all applications (converted to DTOs) */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TutorGraderApplicationDto>> listAll() {
        List<TutorGraderApplicationDto> dtos = service.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /** Get a single application by id */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TutorGraderApplicationDto> getOne(@PathVariable Long id) {
        TutorGraderApplication entity = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(entity));
    }

    /**
     * Update an existing application.
     * JSON only (no transcript re-upload)
     */
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<TutorGraderApplicationDto> update(
            @PathVariable Long id,
            @RequestBody TutorGraderApplicationDto dto
    ) {
        // map → entity
        TutorGraderApplication entity = mapper.toEntity(dto);
        // call service.update(id, entity)
        TutorGraderApplication updated = service.update(id, entity);
        // map → DTO
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    /** Delete by id */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
