import { StudentIndex } from '../pages/student/StudentIndex.jsx'
import { StudentDetails } from '../pages/student/StudentDetails.jsx'
import { TeacherIndex } from '../pages/teacher/TeacherIndex.jsx'
import { TeacherDetails } from '../pages/teacher/TeacherDetails.jsx'
import { OrchestraIndex } from '../pages/orchestra/OrchestraIndex.jsx'
import { OrchestraDetails } from '../pages/orchestra/OrchestraDetails.jsx'

const routes = [
  {
    path: '/',
    element: <StudentIndex />,
  },
  {
    path: '/students',
    element: <StudentIndex />,
    children: [
      {
        path: ':id',
        element: <StudentDetails />,
      },
    ]
  },
  {
    path: '/teachers',
    element: <TeacherIndex />,
    children: [
      {
        path: ':id',
        element: <TeacherDetails />
      }
    ]
  },
  {
    path: '/orchestras',
    element: <OrchestraIndex />,
    children: [
      {
        path: ':id',
        element: <OrchestraDetails />
      }
    ]
  },
]

export default routes