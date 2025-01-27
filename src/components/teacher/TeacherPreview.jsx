import { Link } from 'react-router-dom'

export function TeacherPreview({ teacher }) {
  if (!teacher) return null

  return(
    <Link to={`/teachers/${teacher._id}`} className='teacher-preview-link'>
        <div className='student-info'>
        <div>{teacher.fullName}</div>
        </div>
    </Link>
  )
}