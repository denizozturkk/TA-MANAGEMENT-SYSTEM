package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.DutyLogDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyStatus;
import edu.bilkent.cs319.team9.ta_management_system.service.DutyLogService;
import edu.bilkent.cs319.team9.ta_management_system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/duty-logs")
public class DutyLogController {

    private final DutyLogService dutyLogService;
    private final EntityMapperService mapper;

    @Autowired
    private NotificationService notificationService;

    public DutyLogController(DutyLogService dutyLogService, EntityMapperService mapper) {
        this.dutyLogService = dutyLogService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<DutyLogDto> create(@RequestBody DutyLogDto dto) {
        DutyLog created = dutyLogService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DutyLogDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(dutyLogService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<DutyLogDto>> getAll() {
        return ResponseEntity.ok(
                dutyLogService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DutyLogDto> update(@PathVariable Long id, @RequestBody DutyLogDto dto) {
        DutyLog updated = dutyLogService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dutyLogService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<DutyLogDto> submit(
            @PathVariable Long id,
            @RequestParam("taId") Long taId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        DutyLog dl = dutyLogService.findById(id);
        if (dl == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (dl.getTa() == null || !dl.getTa().getId().equals(taId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Save TA-submitted file (separately from faculty file)
        if (file != null && !file.isEmpty()) {
            try {
                dl.setFileNameTa(file.getOriginalFilename());
                dl.setContentTypeTa(file.getContentType());
                dl.setDataTa(file.getBytes());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        dl.setStatus(DutyStatus.SUBMITTED);
        DutyLog updated = dutyLogService.update(id, dl);



        // Send notification to faculty
        Long facultyId = updated.getFaculty().getId();
        String facultyEmail = updated.getFaculty().getEmail();
        String title = "Duty Log Submitted";
        String body = String.format(
                "TA %s has submitted their work for duty ID %d on %s.",
                updated.getTa().getFirstName(),
                updated.getId(),
                updated.getDateTime()
        );
        notificationService.notifyUser(facultyId, facultyEmail, title, body);

        return ResponseEntity.ok(mapper.toDto(updated));
    }
    @GetMapping("/ta/{taId}")
    public ResponseEntity<List<DutyLogDto>> getByTaId(@PathVariable Long taId) {
        List<DutyLogDto> dtos = dutyLogService.findByTaId(taId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

}
