import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavBar from './components/common/NavBar';
import OpenRoute from './components/core/Auth/OpenRoute';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import MyProfile from './components/core/Dashboard/MyProfile';
import Error from './pages/Error';
import Settings from './components/core/Dashboard/settings';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart/index';
import AddCourse from './components/core/Dashboard/AddCourse';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constants';
import MyCourses from './components/core/Dashboard/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse';
import Catelog from './pages/Catelog';
import CourseDetails from './pages/CourseDetails';
import Instructor from './components/core/Dashboard/Instructor';
import AdminPage from './components/core/Dashboard/AdminPage';
import PurchaseHistory from './components/core/Dashboard/PurchaseHistory';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';


function App() {
  const {user} = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 font-inter">
      <NavBar/>

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='catalog/:catalogName' element={<Catelog/>} />
        <Route path='/course/:courseId' element={<CourseDetails />} />

        {/* Public Routes Only For Non Logged Users  */}
        <Route 
          path='/login' 
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          } />

        <Route 
          path='/signup' 
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          } />

        <Route 
          path='/forgot-password' 
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          } />

        <Route 
          path='/update-password/:id' 
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          } />

        <Route 
          path='/verify-email'
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
          
          {/* Private Routes Only For Logged In Users  */}

        <Route 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path='dashboard/my-profile' element={ <PrivateRoute> <MyProfile /> </PrivateRoute> }/>
          <Route path='dashboard/settings' element={ <PrivateRoute> <Settings/> </PrivateRoute> } />
          
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/enrolled-courses' element={ <PrivateRoute> <EnrolledCourses/> </PrivateRoute> } />
                <Route path='dashboard/cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path='dashboard/History' element={<PrivateRoute><PurchaseHistory/></PrivateRoute>} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/add-course' element={<PrivateRoute><AddCourse/></PrivateRoute>} />
                <Route path='dashboard/my-courses' element={<PrivateRoute><MyCourses/></PrivateRoute>} />
                <Route path='dashboard/edit-course/:courseId' element={<PrivateRoute><EditCourse/></PrivateRoute>} />
                <Route path='dashboard/instructor' element={<PrivateRoute><Instructor/></PrivateRoute>} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path='dashboard/AdminPage' element={<PrivateRoute><AdminPage/></PrivateRoute>} />
              </>
            )
          }
          
        </Route>

        <Route 
          element={
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>
          {
            user && user.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='/view-course/:courseId/section/:sectionId/sub-section/:subSectionId' element={<PrivateRoute><VideoDetails/></PrivateRoute>} />
              </>
            )
          }
        </Route>

        
        {/* IF Page Not Present  */}
        <Route 
          path='*'
          element={
            <Error />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
