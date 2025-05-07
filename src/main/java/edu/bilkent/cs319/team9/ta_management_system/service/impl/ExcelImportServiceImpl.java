package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.BadRequestException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ExcelImportServiceImpl implements ExcelImportService {
    private static final Set<String> ALLOWED_EXT = Set.of("xls","xlsx");
    private static final Set<String> ALLOWED_CT = Set.of(
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    @Autowired
    private TARepository taRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private FacultyMemberRepository facultyRepository;
    @Autowired private OfferingRepository offeringRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private SemesterDataRepository semesterDataRepository;



    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("No file uploaded");
        long MAX = 5 * 1024 * 1024;
        if (file.getSize() > MAX) throw new BadRequestException("File too large");
        String name = file.getOriginalFilename();
        String ext = name == null ? "" :
                name.contains(".") ? name.substring(name.lastIndexOf('.')+1).toLowerCase() : "";
        if (!ALLOWED_EXT.contains(ext)) throw new BadRequestException("Only .xls/.xlsx allowed");
    }

    private Workbook openWorkbook(MultipartFile file) throws IOException {
        return WorkbookFactory.create(file.getInputStream());
    }




    @Override
    @Transactional
    public void importTaSheet(MultipartFile file) throws IOException {

        // 1) Empty?
        if (file.isEmpty())
            throw new BadRequestException("No file uploaded");


        // file size check
        long MAX = 5 * 1024 * 1024; // 5 MB
        if (file.getSize() > MAX) {
            throw new BadRequestException("File too large: max 5 MB allowed");
        }

        // 2) Content-type check (optional, best-effort)
        String ct = file.getContentType();
        if (ct == null || !ALLOWED_CT.contains(ct)) {
            // maybe warn/log, but not fatal
        }

        // 3) Extension check (stronger)
        String name = file.getOriginalFilename();
        String ext = name == null
                ? ""
                : name.contains(".")
                ? name.substring(name.lastIndexOf('.')+1).toLowerCase()
                : "";
        if (!ALLOWED_EXT.contains(ext)) {
            throw new BadRequestException("Only Excel files (.xls/.xlsx) are supported");
        }

        DataFormatter fmt = new DataFormatter();

        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            boolean headerRow = true;

            for (Row row : sheet) {
                if (headerRow) {
                    headerRow = false;
                    continue;
                }
                if (row == null || row.getCell(0) == null) {
                    continue;
                }

                // Read ID cell as text
                String idText = fmt.formatCellValue(row.getCell(0)).trim();
                TA ta;
                if (!idText.isEmpty()) {
                    long id;
                    try {
                        id = Long.parseLong(idText);
                    } catch (NumberFormatException ex) {
                        throw new IllegalStateException("Invalid TA ID '" + idText + "' at row " + row.getRowNum());
                    }
                    Optional<TA> existing = taRepository.findById(id);
                    ta = existing.orElseGet(TA::new);
                } else {
                    ta = new TA();
                }

                // Set / override fields
                ta.setFirstName(fmt.formatCellValue(row.getCell(1)));
                ta.setLastName(fmt.formatCellValue(row.getCell(2)));
                ta.setEmail(fmt.formatCellValue(row.getCell(3)));
                ta.setPhoneNumber(fmt.formatCellValue(row.getCell(4)));
                ta.setDepartment(fmt.formatCellValue(row.getCell(5)));
                ta.setRole(Role.ROLE_TA);

                taRepository.save(ta);
            }
        }
    }




    @Override
    public void importStudentSheet(MultipartFile file) throws IOException {
        validateFile(file);
        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) { header = false; continue; }
                String idText = fmt.formatCellValue(row.getCell(0)).trim();
                Student s = idText.isEmpty()
                        ? new Student()
                        : studentRepository.findById(Long.parseLong(idText)).orElse(new Student());

                s.setStudentID(fmt.formatCellValue(row.getCell(0)));
                s.setFirstName(fmt.formatCellValue(row.getCell(1)));
                s.setLastName(fmt.formatCellValue(row.getCell(2)));
                studentRepository.save(s);
            }
        }
    }

    @Override
    public void importFacultySheet(MultipartFile file) throws IOException {
        validateFile(file);
        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) { header = false; continue; }
                String idText = fmt.formatCellValue(row.getCell(0)).trim();
                FacultyMember f = idText.isEmpty()
                        ? new FacultyMember()
                        : facultyRepository.findById(Long.parseLong(idText)).orElse(new FacultyMember());

                f.setFirstName(fmt.formatCellValue(row.getCell(1)));
                f.setLastName(fmt.formatCellValue(row.getCell(2)));
                f.setEmail(fmt.formatCellValue(row.getCell(3)));
                // … any other fields …
                facultyRepository.save(f);
            }
        }
    }

    @Override
    public void importOfferingSheet(MultipartFile file) throws IOException {
        validateFile(file);
        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) { header = false; continue; }
                String idText = fmt.formatCellValue(row.getCell(0)).trim();
                Offering o = idText.isEmpty()
                        ? Offering.builder().build()
                        : offeringRepository.findById(Long.parseLong(idText))
                        .orElse(Offering.builder().build());

                o.setSemester(fmt.formatCellValue(row.getCell(1)));
                o.setYear(Integer.valueOf(fmt.formatCellValue(row.getCell(2))));

                // instructor by ID in column 4
                Long instrId = Long.parseLong(fmt.formatCellValue(row.getCell(3)));
                facultyRepository.findById(instrId).ifPresent(o::setInstructor);

                // course by ID in column 5
                Long courseId = Long.parseLong(fmt.formatCellValue(row.getCell(4)));
                courseRepository.findById(courseId).ifPresent(o::setCourse);

                // semesterData by ID in column 6
                Long semDataId = Long.parseLong(fmt.formatCellValue(row.getCell(5)));
                semesterDataRepository.findById(semDataId).ifPresent(o::setSemesterData);

                offeringRepository.save(o);
            }
        }
    }

    @Override
    public void importEnrollmentSheet(MultipartFile file) throws IOException {
        validateFile(file);
        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) { header = false; continue; }
                Long offeringId = Long.parseLong(fmt.formatCellValue(row.getCell(0)));
                Long studentId  = Long.parseLong(fmt.formatCellValue(row.getCell(1)));
                Offering o = offeringRepository.findById(offeringId)
                        .orElseThrow(() -> new BadRequestException("Offering not found: " + offeringId));
                Student s = studentRepository.findById(studentId)
                        .orElseThrow(() -> new BadRequestException("Student not found: " + studentId));
                // make sure both sides of the many-to-many are updated
                o.getStudents().add(s);
                s.getOfferings().add(o);
                // save at least one side
                offeringRepository.save(o);
            }
        }
    }



}