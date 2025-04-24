package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.model.Role;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.repository.TARepository;
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
import java.util.Optional;

@Service
public class ExcelImportServiceImpl implements ExcelImportService {

    @Autowired
    private TARepository taRepository;

    @Override
    @Transactional
    public void importTaSheet(MultipartFile file) throws IOException {
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
}