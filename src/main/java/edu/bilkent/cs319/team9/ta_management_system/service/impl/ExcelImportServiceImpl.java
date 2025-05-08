package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.BadRequestException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import edu.bilkent.cs319.team9.ta_management_system.service.OfferingService;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HashSet;
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

    @Autowired private OfferingService offeringService;


    @Autowired
    private PasswordEncoder passwordEncoder;


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
    public void importTaSheet(MultipartFile file, Long offeringId) throws IOException {
        // 1) Basic file checks
        if (file.isEmpty())
            throw new BadRequestException("No file uploaded");
        if (file.getSize() > 5 * 1024 * 1024)
            throw new BadRequestException("File too large: max 5 MB allowed");
        String filename = file.getOriginalFilename();
        String ext = filename != null && filename.contains(".")
                ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!ALLOWED_EXT.contains(ext))
            throw new BadRequestException("Only Excel files (.xls/.xlsx) are supported");

        // 2) Load the Offering once under this transaction
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new BadRequestException("Offering with ID " + offeringId + " not found."));
        if (offering.getTas() == null) {
            offering.setTas(new HashSet<>());
        }

        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }
                // stop on completely blank ID cell
                String maybeId = fmt.formatCellValue(row.getCell(0)).trim();
                if (maybeId.isEmpty()) break;

                int excelRow = row.getRowNum() + 1;
                // read all needed columns
                String idText = maybeId;
                String first    = fmt.formatCellValue(row.getCell(1)).trim();
                String last     = fmt.formatCellValue(row.getCell(2)).trim();
                String mail     = fmt.formatCellValue(row.getCell(3)).trim();
                String ph       = fmt.formatCellValue(row.getCell(4)).trim();
                String dept     = fmt.formatCellValue(row.getCell(5)).trim();
                String degree   = fmt.formatCellValue(row.getCell(6)).trim().toUpperCase();

                // basic validations
                if (first.isBlank() || last.isBlank() || mail.isBlank()) {
                    throw new BadRequestException(
                            "Row " + excelRow + ": first name, last name & email are required.");
                }
                if (!degree.equals("MSC") && !degree.equals("PHD")) {
                    throw new BadRequestException(
                            "Row " + excelRow + ": Invalid degree status '" + degree + "'. Must be MSC or PHD.");
                }

                // look up or create
                TA ta;
                boolean isNew;
                if (!idText.isEmpty()) {
                    long id;
                    try {
                        id = Long.parseLong(idText);
                    } catch (NumberFormatException ex) {
                        throw new BadRequestException(
                                "Row " + excelRow + ": invalid TA ID '" + idText + "'.");
                    }
                    Optional<TA> opt = taRepository.findById(id);
                    if (opt.isPresent()) {
                        ta = opt.get();
                        isNew = false;
                    } else {
                        ta = new TA();
                        isNew = true;
                    }
                } else {
                    ta = new TA();
                    isNew = true;
                }

                // set/update fields
                ta.setFirstName(first);
                ta.setLastName(last);
                ta.setEmail(mail);
                ta.setPhoneNumber(ph);
                ta.setDepartment(dept);
                ta.setRole(Role.ROLE_TA);

                // set degree status
                ta.setMsPhdStatus(
                        degree.equals("PHD")
                                ? DegreeStatus.PHD
                                : DegreeStatus.MSC
                );

                if (isNew) {
                    // initialize workload
                    ta.setTotalWorkload(0.0f);

                    // generate & persist a password
                    String plain = "1234";
                    ta.setPassword(passwordEncoder.encode(plain));
                    ta = taRepository.save(ta);      // now `ta.getId()` is set

                    // notify
                    sendPasswordEmail(ta.getEmail(), ta.getFirstName(), plain);
                }
                // existing TAs will be updated by dirty-checking on commit

                // link into offering
                offering.getTas().add(ta);
            }
        }

        // 3) flush the new join-rows
        offeringRepository.save(offering);
    }






    @Override
    @Transactional
    public void importStudentSheet(MultipartFile file, Long offeringId) throws IOException {
        // 1) File sanity check (empty / size / extension)
        validateFile(file);

        DataFormatter fmt = new DataFormatter();

        // 2) Load Offering
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new BadRequestException("Offering with ID " + offeringId + " not found."));

        if (offering.getStudents() == null) {
            offering.setStudents(new HashSet<>());
        }

        // 3) Parse sheet
        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;

            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }

                // business key column
                String bizId = fmt.formatCellValue(row.getCell(0)).trim();
                // blank bizId => end of list
                if (bizId.isEmpty()) {
                    break;
                }

                String first = fmt.formatCellValue(row.getCell(1)).trim();
                String last  = fmt.formatCellValue(row.getCell(2)).trim();
                int excelRow = row.getRowNum() + 1;

                // 4) Validate non-empty cells
                if (first.isEmpty() || last.isEmpty()) {
                    throw new BadRequestException(
                            "Row " + excelRow + ": All fields (Student ID, First Name, Last Name) must be filled.");
                }

                // 5) Upsert student
                Student student;
                if (studentRepository.existsByStudentID(bizId)) {
                    student = studentRepository.findByStudentID(bizId)
                            .orElseThrow(() -> new BadRequestException(
                                    "Row " + excelRow + ": inconsistency—found ID in existsByStudentID but not in find."));
                } else {
                    student = new Student();
                    student.setStudentID(bizId);
                    student.setFirstName(first);
                    student.setLastName(last);
                    student = studentRepository.save(student);
                }

                // 6) Link into Offering
                offering.getStudents().add(student);
            }
        }

        // 7) Persist all changes at once
        offeringRepository.save(offering);
    }




    @Override
    @Transactional
    public void importFacultySheet(MultipartFile file) throws IOException {
        // 1) Basic file checks
        validateFile(file);

        long MAX = 5 * 1024 * 1024; // 5 MB
        if (file.getSize() > MAX) {
            throw new BadRequestException("File too large: max 5 MB allowed");
        }

        String name = file.getOriginalFilename();
        String ext = name != null && name.contains(".")
                ? name.substring(name.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!ALLOWED_EXT.contains(ext)) {
            throw new BadRequestException("Only Excel files (.xls/.xlsx) are supported");
        }

        DataFormatter fmt = new DataFormatter();

        try (Workbook wb = openWorkbook(file)) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;

            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }

                // 2) stop on a fully blank row
                String c0 = row.getCell(0) == null ? "" : fmt.formatCellValue(row.getCell(0)).trim();
                String c1 = row.getCell(1) == null ? "" : fmt.formatCellValue(row.getCell(1)).trim();
                String c2 = row.getCell(2) == null ? "" : fmt.formatCellValue(row.getCell(2)).trim();
                String c3 = row.getCell(3) == null ? "" : fmt.formatCellValue(row.getCell(3)).trim();
                if (c0.isEmpty() && c1.isEmpty() && c2.isEmpty() && c3.isEmpty()) {
                    break;
                }

                int rowNum = row.getRowNum() + 1;
                String firstName  = c0;
                String lastName   = c1;
                String email      = c2;
                String department = c3;

                // 3) required‐fields check
                if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || department.isEmpty()) {
                    throw new BadRequestException(
                            "Row " + rowNum +
                                    ": All fields (first name, last name, email, department) must be filled."
                    );
                }

                // 4) simple RFC email validation
                // 4) simple RFC email validation
                try {
                    InternetAddress addr = new InternetAddress(email);
                    addr.validate();
                } catch (AddressException e) {
                    throw new BadRequestException(
                            "Row " + rowNum + ": Invalid email address '" + email + "'"
                    );
                }


                // 5) duplicate‐email check
                if (facultyRepository.existsByEmail(email)) {
                    throw new BadRequestException(
                            "Row " + rowNum + ": Email '" + email + "' already exists."
                    );
                }

                // 6) create + save
                FacultyMember f = new FacultyMember();
                f.setFirstName(firstName);
                f.setLastName(lastName);
                f.setEmail(email);
                f.setDepartment(department);
                f.setRole(Role.ROLE_FACULTY_MEMBER);

                // generate and encode default password
                String plainPassword = generateRandomPassword(10);
                f.setPassword(passwordEncoder.encode(plainPassword));

                facultyRepository.save(f);

                // 7) send them their password
                sendPasswordEmail(f.getEmail(), f.getFirstName(), plainPassword);
            }
        }
    }



    @Override
    @Transactional
    public void importOfferingSheet(MultipartFile file) throws IOException {
        validateFile(file);
        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;
            for (Row row : sheet) {
                if (header) { header = false; continue; }
                String courseCode = fmt.formatCellValue(row.getCell(0)).trim();
                String yearText   = fmt.formatCellValue(row.getCell(1)).trim();
                String email      = fmt.formatCellValue(row.getCell(2)).trim();
                String semester   = fmt.formatCellValue(row.getCell(3)).trim();

                if (courseCode.isEmpty() && yearText.isEmpty() && email.isEmpty() && semester.isEmpty()) {
                    break; // done
                }

                int rowNum = row.getRowNum() + 1;
                if (courseCode.isEmpty()
                        || yearText.isEmpty()
                        || email.isEmpty()
                        || semester.isEmpty()) {
                    throw new BadRequestException(
                            "Row " + rowNum
                                    + ": All fields (course_code, year, fac_mem_mail, semester) must be filled.");
                }

                int year;
                try {
                    year = Integer.parseInt(yearText);
                } catch (NumberFormatException ex) {
                    throw new BadRequestException("Row " + rowNum + ": Invalid year '" + yearText + "'");
                }

                Course course = courseRepository.findByCourseCode(courseCode)
                        .orElseThrow(() -> new BadRequestException(
                                "Row " + rowNum + ": No course with code '" + courseCode + "'"));

                FacultyMember instr = facultyRepository.findByEmail(email)
                        .orElseThrow(() -> new BadRequestException(
                                "Row " + rowNum + ": No faculty member with email '" + email + "'"));

                Offering o = new Offering();      // id == null → new INSERT
                o.setCourse(course);
                o.setInstructor(instr);
                o.setYear(year);
                o.setSemester(semester);
                // if you have a “section” column, set it here:
                // o.setSection(fmt.formatCellValue(row.getCell(4)).trim());

                offeringRepository.save(o);       // Hibernate INSERTs and populates o.id
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

    @Override
    @Transactional
    public void importCourses(MultipartFile file) throws IOException {
        // 1) Basic file checks
        if (file.isEmpty()) {
            throw new BadRequestException("No file uploaded");
        }
        long MAX = 5 * 1024 * 1024; // 5 MB
        if (file.getSize() > MAX) {
            throw new BadRequestException("File too large: max 5 MB allowed");
        }
        String name = file.getOriginalFilename();
        String ext = name != null && name.contains(".")
                ? name.substring(name.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!Set.of("xls","xlsx").contains(ext)) {
            throw new BadRequestException("Only Excel files (.xls/.xlsx) are supported");
        }

        DataFormatter fmt = new DataFormatter();
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            boolean header = true;

            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }

                // read & trim, treating null cells as ""
                String code  = row.getCell(0)==null ? "" : fmt.formatCellValue(row.getCell(0)).trim();
                String cred  = row.getCell(1)==null ? "" : fmt.formatCellValue(row.getCell(1)).trim();
                String nameC = row.getCell(2)==null ? "" : fmt.formatCellValue(row.getCell(2)).trim();

                // if all three are blank, we're done
                if (code.isEmpty() && cred.isEmpty() && nameC.isEmpty()) {
                    break;
                }

                int rowNum = row.getRowNum() + 1;
                // required‐fields check
                if (code.isEmpty() || cred.isEmpty() || nameC.isEmpty()) {
                    throw new BadRequestException(
                            "Row " + rowNum +
                                    ": All fields (course_code, credits, course_name) must be filled."
                    );
                }

                // parse credits
                int credits;
                try {
                    credits = Integer.parseInt(cred);
                } catch (NumberFormatException e) {
                    throw new BadRequestException(
                            "Row " + rowNum + ": Invalid credits value '" + cred + "'"
                    );
                }

                // duplicate‐code check
                if (courseRepository.existsByCourseCode(code)) {
                    throw new BadRequestException(
                            "Row " + rowNum + ": Course code '" + code + "' already exists."
                    );
                }

                // create & save
                Course c = new Course();
                c.setCourseCode(code);
                c.setCredits(credits);
                c.setCourseName(nameC);
                courseRepository.save(c);
            }
        }
    }


    // HELPER
    private String generateRandomPassword(int length) {
        SecureRandom random = new SecureRandom();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!";
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }

    @Autowired
    private JavaMailSender mailSender;

    private void sendPasswordEmail(String to, String name, String plainPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your TA Management System Account");
        message.setText(
                "Hello " + name + ",\n\n" +
                        "You have been added to the TA Management System.\n\n" +
                        "Your login credentials are:\n" +
                        "Email: " + to + "\n" +
                        "Password: " + plainPassword + "\n\n" +
                        "Please login and change your password as soon as possible.\n\n" +
                        "Best regards,\nCS319 Team"
        );

        mailSender.send(message);
    }




}