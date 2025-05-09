package edu.bilkent.cs319.team9.ta_management_system.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.LogReportDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.SwapReportDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DutyReportDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.ProctorReportDto;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {

    private static final String FONT_PATH = "fonts/FreeSans.ttf";

    private final BaseFont unicodeBaseFont;
    private final Font titleFont;
    private final Font headerFont;
    private final Font normalFont;

    public PdfGeneratorService() {
        try {
            // Load our TTF font from the classpath
            ClassPathResource resource = new ClassPathResource(FONT_PATH);
            try (InputStream is = resource.getInputStream()) {
                byte[] fontBytes = is.readAllBytes();
                unicodeBaseFont = BaseFont.createFont(
                        "FreeSans.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        true,
                        fontBytes,
                        null
                );
            }
            // Create Font instances for use throughout
            titleFont  = new Font(unicodeBaseFont, 18, Font.BOLD);
            headerFont = new Font(unicodeBaseFont, 12, Font.BOLD);
            normalFont = new Font(unicodeBaseFont, 11, Font.NORMAL);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load embedded PDF font", e);
        }
    }

    public byte[] generateDistributionPdf(Exam exam,
                                          ClassroomDistributionDto dto,
                                          boolean alphabetical) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Title
        String courseCode = exam.getOffering().getCourse().getCourseCode();
        String examName   = exam.getExamName();
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

        // Table setup
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1,1,1,1,1});

        // Headers
        Arrays.asList("Building", "Room", "First Name", "Last Name", "Student ID")
                .forEach(h -> {
                    PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    table.addCell(cell);
                });

        // Rows
        for (DistributionDto dist : dto.getDistributions()) {
            List<Long> ids = new ArrayList<>(dist.getStudentIds());
            if (alphabetical) {
                ids.sort(Comparator.comparing(id -> studentMap.get(id).getLastName()));
            }
            Classroom c = classMap.get(dist.getClassroomId());
            for (Long sid : ids) {
                Student s = studentMap.get(sid);
                table.addCell(new Phrase(c.getBuilding(),   normalFont));
                table.addCell(new Phrase(c.getRoomNumber(), normalFont));
                table.addCell(new Phrase(s.getFirstName(),  normalFont));
                table.addCell(new Phrase(s.getLastName(),   normalFont));
                table.addCell(new Phrase(String.valueOf(sid), normalFont));
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

        // Header row
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }
        // Data rows
        for (List<String> row : rows) {
            for (String cellValue : row) {
                table.addCell(new Phrase(cellValue, normalFont));
            }
        }

        doc.add(table);
    }

    public byte[] generateLogReportPdf(List<LogReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("System Log Report", titleFont));
        doc.add(Chunk.NEWLINE);

        List<List<String>> rows = data.stream()
                .map(d -> List.of(
                        d.getTimestamp().toString(),
                        d.getActorMail(),
                        d.getEventType().name(),
                        d.getDetails()
                ))
                .collect(Collectors.toList());

        addSimpleTable(doc,
                List.of("Timestamp", "Actor", "Event", "Details"),
                rows
        );
        doc.close();
        return baos.toByteArray();
    }

    public byte[] generateSwapReportPdf(List<SwapReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("Duty Swap Report", titleFont));
        doc.add(Chunk.NEWLINE);

        List<List<String>> rows = data.stream()
                .map(d -> List.of(
                        String.valueOf(d.getId()),
                        d.getRequesterMail(),
                        d.getTargetMail(),
                        d.getStatus().name(),
                        d.getTimestamp().toString(),
                        d.getDetails()
                ))
                .collect(Collectors.toList());

        addSimpleTable(doc,
                List.of("ID", "Requester", "Target", "Status", "Requested At", "Details"),
                rows
        );
        doc.close();
        return baos.toByteArray();
    }

    public byte[] generateDutyReportPdf(List<DutyReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("TA Duty Report", titleFont));
        doc.add(Chunk.NEWLINE);

        List<List<String>> rows = data.stream()
                .map(d -> List.of(
                        String.valueOf(d.getId()),
                        d.getActorMail(),
                        d.getDutyType().name(),
                        d.getTimestamp().toString(),
                        d.getDetails()
                ))
                .collect(Collectors.toList());

        addSimpleTable(doc,
                List.of("ID", "TA", "Duty Type", "Date-Time", "Details"),
                rows
        );
        doc.close();
        return baos.toByteArray();
    }

    public byte[] generateProctorReportPdf(List<ProctorReportDto> data) throws DocumentException {
        Document doc = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("Exam Proctor Report", titleFont));
        doc.add(Chunk.NEWLINE);

        List<List<String>> rows = data.stream()
                .map(d -> List.of(
                        String.valueOf(d.getId()),
                        d.getActorMail(),
                        d.getExamName(),
                        String.valueOf(d.getClassId()),
                        d.getStatus(),
                        d.getTimestamp().toString()
                ))
                .collect(Collectors.toList());


        addSimpleTable(doc,
                List.of("ID", "TA", "Exam", "Room", "Status", "Exam Date/Time"),
                rows
        );
        doc.close();
        return baos.toByteArray();
    }
}
