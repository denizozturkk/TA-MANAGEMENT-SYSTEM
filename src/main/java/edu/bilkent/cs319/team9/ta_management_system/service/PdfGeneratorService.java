package edu.bilkent.cs319.team9.ta_management_system.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {

    public byte[] generateDistributionPdf(ClassroomDistributionDto dto) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);

        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Exam Distribution — Exam ID: " + dto.getExamId(), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Table: Classroom | Student IDs
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1, 3});

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        PdfPCell h1 = new PdfPCell(new Phrase("Classroom ID", headerFont));
        PdfPCell h2 = new PdfPCell(new Phrase("Student IDs",   headerFont));
        h1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        h2.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(h1);
        table.addCell(h2);

        for (DistributionDto dist : dto.getDistributions()) {
            table.addCell(dist.getClassroomId().toString());

            String ids = dist.getStudentIds().stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(", "));
            table.addCell(new PdfPCell(new Phrase(ids)));
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
}