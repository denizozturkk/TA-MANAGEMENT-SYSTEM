import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Header
import UserHeader from "./people/User/UserHeader.jsx";

// Public
import HomePage        from "./pages/HomePage.jsx";
import Login           from "./people/User/Login.jsx";
import ForgetPassword  from "./people/User/ForgetPassword.jsx";
import RecoverPassword from "./people/User/RecoverPassword.jsx";

// User / Common Authenticated
import ViewProfile              from "./people/User/ViewProfile.jsx";
import ChangePassword           from "./people/User/ChangePassword.jsx";
import ChangeContactInformation from "./people/User/ChangeContactInformation.jsx";
import ViewNotification         from "./people/User/ViewNotification.jsx";
import NotificationDetail       from "./people/User/NotificationDetail.jsx";
import GiveFeedback             from "./people/User/GiveNotification.jsx";
import ViewRatings              from "./people/User/ViewRatings.jsx";
import TutorGraderForm          from "./people/User/TutorGraderForm.jsx";

// Department Staff
import TutorGraderFormView from "./people/DepartmentStaff/DepartmentStaff.jsx";

// ProtectedRoute for role-based access
import ProtectedRoute from "./Layouts/Login/ProtectedRoute.jsx";

// Coordinator
import ReplaceTA                from "./people/Coordinator/SwapProcturing.jsx";
import ManageExamClassrooms    from "./people/Coordinator/ManageClassRoomFromExam.jsx";
import AssignTaToAnotherLesson from "./people/FacultyMember/AssignTaToAnotherLesson.jsx";
import SwapDuties              from "./people/Coordinator/SwapDuties.jsx";
import SwapProctor             from "./people/Coordinator/SwapProcturing.jsx";
import ReplaceProctor          from "./people/Coordinator/ReplaceProcturing.jsx";
import ReplaceDuties           from "./people/Coordinator/ReplaceDuties.jsx";
import ExcelTa                 from "./people/Coordinator/ExcelTa.jsx";
import ExcelCourse             from "./people/Coordinator/ExcelCourse.jsx";
import ExcelStudent            from "./people/Coordinator/ExcelStudentList.jsx";
import ExcelOffering           from "./people/Coordinator/ExcelOffering.jsx";
import ExcelFacultyMember      from "./people/Coordinator/ExcelFacultyMember.jsx";




// Faculty Member
import ClassroomList           from "./people/FacultyMember/CreateClassRoomList.jsx";
import LeaveRequest            from "./people/FacultyMember/ReviewTaLeaveRequest.jsx";
import ExcelUpload             from "./people/FacultyMember/UploadSemesterExcelData.jsx";
import GenerateClassroomList   from "./people/FacultyMember/GenerateClassromList.jsx";
import PrintStudentDistribution from "./people/FacultyMember/PrintStudentDistribution.jsx";
import SelectAssignmentType    from "./people/FacultyMember/SelectAssignmentType.jsx";
import ReviewWorkload          from "./people/FacultyMember/ReviewWorkloadOfTa.jsx";
import DefineExam              from "./people/FacultyMember/DefinesExam.jsx";
import TAList                  from "./people/FacultyMember/CreateTaListTa.jsx";
import AssignAssignment        from "./people/FacultyMember/AssignAssignment.jsx";
import DutyExtensionRequest    from "./people/FacultyMember/ReviewDutyExtension.jsx";

// TA
import ViewWorkloadTA        from "./people/Ta/ViewWorkload-TA.jsx";
import ReportTotalWorkloadTA from "./people/Ta/ReportTotalWorkload-TA.jsx";
import SubmitLeaveRequestTA  from "./people/Ta/SubmitLeaveRequest-TA.jsx";
import SwapProctorTA         from "./people/Ta/SwapProctor-TA.jsx";
import ViewPastTasksTA       from "./people/Ta/ViewPastTasks-TA.jsx";
import CalendarTA            from "./people/Ta/Calendar-TA.jsx";

// Dean
import ManageCourseDataDean from "./people/Dean/ManageCourseData-Dean.jsx";
import ExamSchedulingDean from "./people/Dean/ExamScheduling-Dean.jsx";
import AssignProctoringDean from "./people/Dean/AssignProctoring-Dean.jsx";
import MakeReportDean from "./people/Dean/MakeReport-Dean.jsx";
import RescheduleExamDean from "./people/Dean/RescheduleExam-Dean.jsx";
import ManageClassroomsDean from "./people/Dean/ManageClassrooms-Dean.jsx";
import UpdateProctorCountDean from "./people/Dean/UpdateProctorCount-Dean.jsx";

// Admin
import AuthActorsAdmin           from "./people/Admin/AuthActors-Admin.jsx";
import ReviewReportRequestsAdmin from "./people/Admin/ReviewReportRequests-Admin.jsx";
import MakeReportsAdmin          from "./people/Admin/MakeReports-Admin.jsx";
import PendingReportsAdmin       from "./people/Admin/PendingReports-Admin.jsx";
import ViewFeedback              from "./people/Admin/ViewFeedback.jsx";

function App() {
  // Hide header on these public paths:
  const publicPaths = [
    "/", 
    "/hh", 
    "/login", 
    "/forgetpassword", 
    "/recoverpassword", 
    "/tutorgraderform"
  ];
  const { pathname } = useLocation();

  const showHeader = !publicPaths.includes(pathname);

  return (
    <>
      {showHeader && <UserHeader />}

      <Routes>
        {/* Public */}
        <Route path="/hh" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/recoverpassword" element={<RecoverPassword />} />

        {/* Tutor/Grader form (public) */}
        <Route path="/tutorgraderform" element={<TutorGraderForm />} />

        {/* Common authenticated */}
        <Route element={
          <ProtectedRoute allowedRoles={[
            "ROLE_USER","ROLE_FACULTY_MEMBER","ROLE_TA",
            "ROLE_COORDINATOR","ROLE_DEAN","ROLE_ADMIN","ROLE_DEPARTMENT_STAFF"
          ]}/>
        }>
          <Route path="/viewprofile" element={<ViewProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/changecontactinformation" element={<ChangeContactInformation />} />
          <Route path="/notification" element={<ViewNotification />} />
          <Route path="/notification/:id" element={<NotificationDetail />} />
          <Route path="/givefeedback" element={<GiveFeedback />} />
          <Route path="/viewratings" element={<ViewRatings />} />
        </Route>

        {/* Department Staff */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_DEPARTMENT_STAFF"]} />}>
          <Route path="/tutorgraderformview" element={<TutorGraderFormView />} />
        </Route>

        {/* Coordinator */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_COORDINATOR"]} />}>
          <Route path="/replaceta" element={<ReplaceTA />} />
          <Route path="/manageexamclassroom" element={<ManageExamClassrooms />} />
          <Route path="/swapduties" element={<SwapDuties />} />
          <Route path="/replaceduties" element={<ReplaceDuties />} />
          <Route path="/swapprocturing" element={<SwapProctor />} />
          <Route path="/replaceprocturing" element={<ReplaceProctor />} />
          <Route path="/assigntaanotherlesson" element={<AssignTaToAnotherLesson />} />

          <Route path="/excelta" element={<ExcelTa />} />
          <Route path="/excelfacultymember" element={<ExcelFacultyMember />} />
          <Route path="/excelstudent" element={<ExcelStudent />} />
          <Route path="/excelofferings" element={<ExcelOffering />} />
          <Route path="/excelcourse" element={<ExcelCourse />} />
        </Route>

        {/* Faculty Member */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_FACULTY_MEMBER"]} />}>
          <Route path="/classroomlist" element={<ClassroomList />} />
          <Route path="/leaverequest" element={<LeaveRequest />} />
          <Route path="/excelupload" element={<ExcelUpload />} />
          <Route path="/generateclassroomlist" element={<GenerateClassroomList />} />
          <Route path="/printstudentdistribution" element={<PrintStudentDistribution />} />
          <Route path="/selectassignmenttype" element={<SelectAssignmentType />} />
          <Route path="/reviewworkload" element={<ReviewWorkload />} />
          <Route path="/defineexam" element={<DefineExam />} />
          <Route path="/talist" element={<TAList />} />
          <Route path="/assignassignment" element={<AssignAssignment />} />
          <Route path="/dutyextension" element={<DutyExtensionRequest />} />
        </Route>

        {/* TA */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_TA"]} />}>
          <Route path="/workload/view" element={<ViewWorkloadTA />} />
          <Route path="/workload/report" element={<ReportTotalWorkloadTA />} />
          <Route path="/leave" element={<SubmitLeaveRequestTA />} />
          <Route path="/swap" element={<SwapProctorTA />} />
          <Route path="/past-tasks" element={<ViewPastTasksTA />} />
          <Route path="/calendar" element={<CalendarTA />} />
        </Route>

        {/* Dean */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_DEAN"]} />}>
          <Route path="/manage-course-data" element={<ManageCourseDataDean />} />
          <Route path="/exam-scheduling" element={<ExamSchedulingDean />} />
          <Route path="/assign-proctoring" element={<AssignProctoringDean />} />
          <Route path="/make-report" element={<MakeReportDean />} />
          <Route path="/reschedule-exam" element={<RescheduleExamDean />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/authorize-actors" element={<AuthActorsAdmin />} />
          <Route path="/review-requests" element={<ReviewReportRequestsAdmin />} />
          <Route path="/make-reports" element={<MakeReportsAdmin />} />
          <Route path="/pending-reports" element={<PendingReportsAdmin />} />
          <Route path="/viewfeedback" element={<ViewFeedback />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
