package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.DepartmentStaff;
import edu.bilkent.cs319.team9.ta_management_system.service.DepartmentStaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department-staff")
public class DepartmentStaffController {
    private final DepartmentStaffService departmentStaffService;
    public DepartmentStaffController(DepartmentStaffService departmentStaffService) {
        this.departmentStaffService = departmentStaffService;
    }

    @PostMapping
    public ResponseEntity<DepartmentStaff> create(@RequestBody DepartmentStaff s) {
        return new ResponseEntity<>(departmentStaffService.create(s), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentStaff> getById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentStaffService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<DepartmentStaff>> getAll() {
        return ResponseEntity.ok(departmentStaffService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentStaff> update(@PathVariable Long id,
                                                  @RequestBody DepartmentStaff s) {
        return ResponseEntity.ok(departmentStaffService.update(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentStaffService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
