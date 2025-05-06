
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Header
import UserHeader from "./people/User/UserHeader.jsx";

// Public
import HomePage from "./pages/HomePage.jsx";
import Login from "./people/User/Login.jsx";
import ForgetPassword from "./people/User/ForgetPassword.jsx";
import RecoverPassword from "./people/User/RecoverPassword.jsx";

// User / Common Authenticated
import ViewProfile from "./people/User/ViewProfile.jsx";
import ChangePassword from "./people/User/ChangePassword.jsx";
import ChangeContactInformation from "./people/User/ChangeContactInformation.jsx";
import ViewNotification from "./people/User/ViewNotification.jsx";
import NotificationDetail from "./people/User/NotificationDetail.jsx";
import GiveFeedback from "./people/User/GiveNotification.jsx";
import ViewRatings from "./people/User/ViewRatings.jsx";
import TutorGraderForm from "./people/User/TutorGraderForm.jsx";
import TutorGraderFormView from "./people/FacultyMember/TutorGraderFormView.jsx";

// ProtectedRoute for role-based access
import ProtectedRoute from "./Layouts/Login/ProtectedRoute.jsx";

// Coordinator
import ReplaceTA from "./people/Coordinator/ReplaceTa.jsx";
import ManageExamClassrooms from "./people/Coordinator/ManageClassRoomFromExam.jsx";
import AssignTaToAnotherLesson from "./people/FacultyMember/AssignTaToAnotherLesson.jsx";

// Faculty Member
import ClassroomList from "./people/FacultyMember/CreateClassRoomList.jsx";
import LeaveRequest from "./people/FacultyMember/ReviewTaLeaveRequest.jsx";
import ExcelUpload from "./people/FacultyMember/UploadSemesterExcelData.jsx";
import GenerateClassroomList from "./people/FacultyMember/GenerateClassromList.jsx";
import PrintStudentDistribution from "./people/FacultyMember/PrintStudentDistribution.jsx";
import SelectAssignmentType from "./people/FacultyMember/SelectAssignmentType.jsx";
import ReviewWorkload from "./people/FacultyMember/ReviewWorkloadOfTa.jsx";
import DefineExam from "./people/FacultyMember/DefinesExam.jsx";
import TAList from "./people/FacultyMember/CreateTaListTa.jsx";
import AssignAssignment from "./people/FacultyMember/AssignAssignment.jsx";
import DutyExtensionRequest from "./people/FacultyMember/ReviewDutyExtension.jsx";

// TA
import ViewWorkloadTA from "./people/Ta/ViewWorkload-TA.jsx";
import ReportTotalWorkloadTA from "./people/Ta/ReportTotalWorkload-TA.jsx";
import SubmitLeaveRequestTA from "./people/Ta/SubmitLeaveRequest-TA.jsx";
// import SubmitSwapTA from "./people/Ta/SubmitSwapTA.jsx";
import SwapProctorTA from "./people/Ta/SwapProctor-TA.jsx";
import ViewPastTasksTA from "./people/Ta/ViewPastTasks-TA.jsx";
import CalendarTA from "./people/Ta/Calendar-TA.jsx";

// Dean
import ManageCourseDataDean from "./people/Dean/ManageCourseData-Dean.jsx";
import ExamSchedulingDean from "./people/Dean/ExamScheduling-Dean.jsx";
import AssignProctoringDean from "./people/Dean/AssignProctoring-Dean.jsx";
import MakeReportDean from "./people/Dean/MakeReport-Dean.jsx";

// Admin
import AuthActorsAdmin from "./people/Admin/AuthActors-Admin.jsx";
import ReviewReportRequestsAdmin from "./people/Admin/ReviewReportRequests-Admin.jsx";
import MakeReportsAdmin from "./people/Admin/MakeReports-Admin.jsx";
import PendingReportsAdmin from "./people/Admin/PendingReports-Admin.jsx";

function App() {
  return (
    <>
      {/* Header appears on every page */}
      <UserHeader />

      <Routes>
        {/* Public */}
        <Route path="/hh" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/recoverpassword" element={<RecoverPassword />} />

        {/* Common Authenticated Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USER",
                "ROLE_FACULTY_MEMBER",
                "ROLE_TA",
                "ROLE_COORDINATOR",
                "ROLE_DEAN",
                "ROLE_ADMIN",
                "ROLE_DEPARMENT_STAFF",
              ]}
            />
          }
        >
          <Route path="/viewprofile" element={<ViewProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/changecontactinformation" element={<ChangeContactInformation />} />
          <Route path="/notification" element={<ViewNotification />} />
          <Route path="/notification/:id" element={<NotificationDetail />} />
          <Route path="/givefeedback" element={<GiveFeedback />} />
          <Route path="/viewratings" element={<ViewRatings />} />
          <Route path="/tutorgraderform" element={<TutorGraderForm />} />
          <Route path="/tutorgraderformview" element={<TutorGraderFormView />} />
        </Route>

        {/* Coordinator */}
        <Route
          element={<ProtectedRoute allowedRoles={["ROLE_COORDINATOR"]} />}
        >
          <Route path="/replaceta" element={<ReplaceTA />} />
          <Route path="/manageexamclassroom" element={<ManageExamClassrooms />} />
          <Route path="/assigntaanotherlesson" element={<AssignTaToAnotherLesson />} />
        </Route>

        {/* Faculty Member */}
        <Route
          element={<ProtectedRoute allowedRoles={["ROLE_FACULTY_MEMBER"]} />}
        >
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
          <Route path="workload/view" element={<ViewWorkloadTA />} />
          <Route path="workload/report" element={<ReportTotalWorkloadTA />} />
          <Route path="leave" element={<SubmitLeaveRequestTA />} />
          {/* <Route path="swap" element={<SubmitSwapTA />} /> */}
          <Route path="swap-proctor" element={<SwapProctorTA />} />
          <Route path="past-tasks" element={<ViewPastTasksTA />} />
          <Route path="calendar" element={<CalendarTA />} />
        </Route>

        {/* Dean */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_DEAN"]} />}>
          <Route path="manage-course-data" element={<ManageCourseDataDean />} />
          <Route path="exam-scheduling" element={<ExamSchedulingDean />} />
          <Route path="assign-proctoring" element={<AssignProctoringDean />} />
          <Route path="make-report" element={<MakeReportDean />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="authorize-actors" element={<AuthActorsAdmin />} />
          <Route path="review-requests" element={<ReviewReportRequestsAdmin />} />
          <Route path="make-reports" element={<MakeReportsAdmin />} />
          <Route path="pending-reports" element={<PendingReportsAdmin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
