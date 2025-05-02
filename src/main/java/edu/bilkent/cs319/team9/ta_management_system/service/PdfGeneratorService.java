// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/PdfGeneratorService.java
package edu.bilkent.cs319.team9.ta_management_system.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {

    /**
     * @param exam      fully-loaded Exam (with offering→course, examName, examRooms→classroom, offering→students)
     * @param dto       the distribution (classroomId → list of studentIds)
     * @param alphabetical if true, within each room sort students A→Z by lastName
     */
    public byte[] generateDistributionPdf(Exam exam,
                                          ClassroomDistributionDto dto,
                                          boolean alphabetical) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Title uses courseCode and examName
        String courseCode = exam.getOffering().getCourse().getCourseCode();
        String examName   = exam.getExamName();
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph(
                String.format("%s — %s", courseCode, examName),
                titleFont
        );
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Build lookup maps
        Map<Long, Classroom> classMap = exam.getExamRooms().stream()
                .collect(Collectors.toMap(
                        er -> er.getClassroom().getId(),
                        er -> er.getClassroom()
                ));
        Map<Long, Student> studentMap = exam.getOffering().getStudents().stream()
                .collect(Collectors.toMap(Student::getId, s -> s));

        // Table: 5 columns
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1,1,1,1,1});

        Font header = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Arrays.asList("Building","Room","First Name","Last Name","Student ID")
                .forEach(h -> {
                    PdfPCell cell = new PdfPCell(new Phrase(h, header));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    table.addCell(cell);
                });

        // For each room, for each student in that room
        for (DistributionDto dist : dto.getDistributions()) {
            List<Long> ids = new ArrayList<>(dist.getStudentIds());
            if (alphabetical) {
                ids.sort(Comparator.comparing(
                        id -> studentMap.get(id).getLastName()
                ));
            }
            Classroom c = classMap.get(dist.getClassroomId());
            for (Long sid : ids) {
                Student s = studentMap.get(sid);
                table.addCell(c.getBuilding());
                table.addCell(c.getRoomNumber());
                table.addCell(s.getFirstName());
                table.addCell(s.getLastName());
                table.addCell(String.valueOf(sid));
            }
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }
}