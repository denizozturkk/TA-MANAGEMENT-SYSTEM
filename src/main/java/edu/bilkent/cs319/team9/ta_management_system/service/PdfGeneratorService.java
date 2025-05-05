// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/PdfGeneratorService.java
package edu.bilkent.cs319.team9.ta_management_system.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import edu.bilkent.cs319.team9.ta_management_system.dto.*;
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

    private void addSimpleTable(Document doc,
                                List<String> headers,
                                List<List<String>> rows) throws DocumentException {

        PdfPTable table = new PdfPTable(headers.size());
        table.setWidthPercentage(100);

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }
        for (List<String> r : rows) r.forEach(table::addCell);

        doc.add(table);
    }

    /* ======================================================================
       3)  LOG REPORT  (NEW)
       ====================================================================== */
    public byte[] generateLogReportPdf(List<LogReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos); doc.open();

        doc.add(new Paragraph("System Log Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        doc.add(Chunk.NEWLINE);

        addSimpleTable(doc,
                List.of("Timestamp","Actor","Event","Details"),
                data.stream()
                        .map(d -> List.of(
                                d.getTimestamp().toString(),
                                d.getActorMail(),
                                d.getEventType().name(),
                                d.getDetails()))
                        .toList());

        doc.close(); return baos.toByteArray();
    }

    /* ======================================================================
       4)  SWAP REPORT  (NEW)
       ====================================================================== */
    public byte[] generateSwapReportPdf(List<SwapReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos); doc.open();

        doc.add(new Paragraph("Duty Swap Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        doc.add(Chunk.NEWLINE);

        addSimpleTable(doc,
                List.of("ID","Requester","Target","Status","Requested At","Details"),
                data.stream()
                        .map(d -> List.of(
                                String.valueOf(d.getId()),
                                d.getRequesterMail(),
                                d.getTargetMail(),
                                d.getStatus().name(),
                                d.getTimestamp().toString(),
                                d.getDetails()))
                        .toList());

        doc.close(); return baos.toByteArray();
    }

    /* ======================================================================
       5)  DUTY REPORT  (NEW)
       ====================================================================== */
    public byte[] generateDutyReportPdf(List<DutyReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos); doc.open();

        doc.add(new Paragraph("TA Duty Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        doc.add(Chunk.NEWLINE);

        addSimpleTable(doc,
                List.of("ID","TA","Duty Type","Date‑Time","Details"),
                data.stream()
                        .map(d -> List.of(
                                String.valueOf(d.getId()),
                                d.getActorMail(),
                                d.getDutyType().name(),
                                d.getTimestamp().toString(),
                                d.getDetails()))
                        .toList());

        doc.close(); return baos.toByteArray();
    }

    /* ======================================================================
       6)  PROCTOR REPORT  (NEW)
       ====================================================================== */
    public byte[] generateProctorReportPdf(List<ProctorReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos); doc.open();

        doc.add(new Paragraph("Exam Proctor Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        doc.add(Chunk.NEWLINE);

        addSimpleTable(doc,
                List.of("ID","TA","Exam","Room","Status","Exam Date/Time"),
                data.stream()
                        .map(d -> List.of(
                                String.valueOf(d.getId()),
                                d.getActorMail(),
                                d.getExamName(),
                                String.valueOf(d.getClassId()),
                                d.getStatus(),
                                d.getTimestamp().toString()))
                        .toList());

        doc.close(); return baos.toByteArray();
    }
}