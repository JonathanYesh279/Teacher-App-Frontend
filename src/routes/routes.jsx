import { Navigate } from 'react-router-dom';
import { StudentIndex } from '../pages/student/StudentIndex';
import { StudentDetails } from '../pages/student/StudentDetails';
import { TeacherIndex } from '../pages/teacher/TeacherIndex';
import { TeacherDetails } from '../pages/teacher/TeacherDetails';
import { OrchestraIndex } from '../pages/orchestra/OrchestraIndex';
import { OrchestraDetails } from '../pages/orchestra/OrchestraDetails';
import { LoginPage } from '../pages/auth/LoginPage.jsx'
import { ProtectedRoute } from '../routes/protectedRoutes.jsx'

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to='/students' replace />,
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute>
        <StudentIndex />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':id',
        element: <StudentDetails />,
      },
    ],
  },
  {
    path: '/teachers',
    element: (
      <ProtectedRoute roles={['admin']}>
        <TeacherIndex />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':id',
        element: <TeacherDetails />,
      },
    ],
  },
  {
    path: '/orchestras',
    element: (
      <ProtectedRoute roles={['admin', 'conductor']}>
        <OrchestraIndex />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':id',
        element: <OrchestraDetails />,
      },
    ],
  },
];

export default routes;
