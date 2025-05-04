import Admin from "./people/Admin/admin";
import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Ta from "./people/Ta/Ta";
import GiveFeedBack from "./people/User/GiveNotification";
import ViewRatings from "./people/User/ViewRatings";
import AssingAssignment from "./people/Instructor/AssignAssignment";

//Users
import ForgetPassword from "./people/User/ForgetPassword";
import Login from "./people/User/Login";
import RecoverPassword from "./people/User/RecoverPassword";
import ViewProfile from "./people/User/ViewProfile";
import ChangePassword from "./people/User/ChangePassword";
import ChangeContactInfo from "./people/User/ChangeContactInformation";
import ViewNotification from "./people/User/ViewNotification";
import NotificationDetail from "./people/User/NotificationDetail";

//Instructor
import ReviewWorkload from "./people/Instructor/ReviewWorkloadOfTa";
import DefineExam from "./people/Instructor/DefinesExam";

//Coordinator
import ReplaceTA from "./people/Coordinator/ReplaceTa";

//FacultMember
import LeaveRequest from "./people/FacultyMember/ReviewTaLeaveRequest";
import ExcelUpload from "./people/FacultyMember/UploadSemesterExcelData";
import GenerateClassroomList from "./people/FacultyMember/GenerateClassromList";
import PrintStudentDistribition from "./people/FacultyMember/PrintStudentDistribution";
import SelectAssignmentType from "./people/FacultyMember/SelectAssignmentType";
import ClassroomList from "./people/FacultyMember/CreateClassRoomList";
import TAList from "./people/Instructor/CreateTaListTa";
import ManageExamClassrooms from "./people/Coordinator/ManageClassRoomFromExam";
import TutorGraderForm from "./people/User/TutorGraderForm";
import TuutorGraderFormView from "./people/FacultyMember/TutorGraderFormView";
import DutyExtensionRequest from "./people/FacultyMember/ReviewDutyExtension";
import AssignTaToAnotherLesson from "./people/FacultyMember/AssignTaToAnotherLesson";
function App() {
  return (
    <Routes>
      <Route path="/hh" element={<HomePage />} />
      <Route path="/" element={<Ta />} />


       {/* User */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/recoverpassword" element={<RecoverPassword />} />
      <Route path="/viewprofile" element={<ViewProfile />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/changecontactinformation" element={<ChangeContactInfo />} />
      <Route path="/notification" element={<ViewNotification />} />
      <Route path="/notification/:id" element={<NotificationDetail />} />
      <Route path="/givefeedback" element={<GiveFeedBack />} />
      <Route path="/viewratings" element={<ViewRatings />} />
      <Route path="/tutorgraderform" element={<TutorGraderForm />} />

      {/* Departmen Staff */}
      <Route path="/tutorgraderformview" element={<TuutorGraderFormView />} />


      {/* Cordinator */}
      <Route path="/replaceta" element={<ReplaceTA />} />
      <Route path="/manageexamclassroom" element={<ManageExamClassrooms />} />
      <Route path="/assigntaanotherlesson" element={<AssignTaToAnotherLesson />} />

      {/* Faculty Member */}
      <Route path="/classroomlist" element={<ClassroomList />} />
      <Route path="/leaverequest" element={<LeaveRequest />} />
      <Route path="/excelupload" element={<ExcelUpload />} />
      <Route path="/generateclassroomlist" element={<GenerateClassroomList />} />
      <Route path="/printstudentdistribition" element={<PrintStudentDistribition />} />
      <Route path="/selectassignmenttype" element={<SelectAssignmentType />} />
      <Route path="/dutyextension" element={<DutyExtensionRequest />} />
      <Route path="/reviewworkload" element={<ReviewWorkload />} />
      <Route path="/defineexam" element={<DefineExam />} />
      <Route path="/talist" element={<TAList />} />
      <Route path="/assignassignment" element={<AssingAssignment />} />

      {/* Diğer rotalar */}
    </Routes>
   
  );
}

export default App;
