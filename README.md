# TA Management System

## Overview
This TA Management System is designed to streamline workload distribution and proctoring assignments of Teaching Assistants (TAs) within a department. It ensures fair task allocation, minimizes scheduling conflicts with coursework, and allows faculty members to oversee and approve TA responsibilities efficiently. The system also facilitates communication between TAs and faculty while providing automated reminders to keep all tasks on track.

## Key Features

### TA Duty Logging
- TAs enter the tasks they performed, including:
  - Course selection (from assigned courses)
  - Date/time of duty
  - Task type (Lab, Lab Preparation, Grading, Recitation, etc.)
  - Duration spent
- Faculty members review and approve/reject the entered duties.
- Tasks must be entered before the set deadline.
- If a TA has **20% or less** of their task upload deadline time remaining, the system will send a reminder email.
- TAs can view their workload status and past entries.

### Proctoring Assignments
- Faculty members assign proctoring duties manually or through an automated prioritization system.
- The automated system follows these rules:
  - TAs with the least workload are prioritized.
  - PhD students are assigned to MS/PhD courses.
  - If a TA is taking the course, they cannot be assigned to its exam.
  - If not enough TAs are found, overrides can be applied (e.g., cross-department assignments, workload balancing adjustments).
- Swaps are only allowed for proctoring duties and must be approved by the system.
- Faculty members can view proctoring schedules and make adjustments as necessary.

### Leave Requests
- TAs can submit leave requests for specific reasons (e.g., medical leave, conference attendance).
- Department chair or authorized staff must approve/reject leave requests.
- If leave is approved, no proctoring duties will be assigned for those dates for the same TAs.
- The system prevents scheduling conflicts by automatically marking unavailable dates.

### Semester Data Management
- At the beginning of each semester, faculty members manually upload an Excel file containing:
  - Course offerings
  - TA assignments
  - Student enrollments
  - etc.
- The system does not support other file formats (CSV, JSON, etc.).
- Data validation ensures accurate and up-to-date records.

## Roles & Access Control

### Teaching Assistants (TAs)
- Log assigned tasks before the task reporting deadline.
- Request leave with a specific reason.
- Swap proctoring assignments (within system constraints).
- View workload summaries and pending approvals.

### Faculty Members
- Assign proctoring duties (manual or automated prioritization).
- Review and approve/reject TA duty logs.
- Monitor TA workload to ensure fairness.
- Receive notifications about pending approvals.

### Department Chairs & Admins
- Override proctoring assignments and workload caps.
- Manage semester data imports.
- Set global system parameters.
- Define role-based permissions.
- Monitor system-wide TA workloads and completed tasks.

## Technical Stack
- **Backend:** Spring Boot
- **Frontend:** React
- **Database:** MySQL
- **Server:** Linux (Apache2)
- **Authentication:** Secure role-based access control

## Import & Export Functionality
- Only **Excel (.xlsx)** files are supported for semester data imports.
- Faculty members can review and verify uploaded data before final submission.

## System Constraints
- Runs on **Linux servers with Apache2**.
- Cross-department TA assignments are permitted where necessary.
- Automated emails are sent for workload tracking and duty reminders.

## Team Members
- **Deniz Öztürk** – 22102126
- **Mehmet Anıl Yeşil** – 22102614
- **Yüksel Barkın Baydar** – 22201939
- **Emre Uçar** – 22203675
- **Cankutay Dündar** – 22103284
