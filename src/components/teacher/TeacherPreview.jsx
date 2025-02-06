import { Link } from 'react-router-dom'
import { TeacherFormModal } from './TeacherFormModal'

export function TeacherPreview({ teacher, onRemoveTeacher, onUpdateTeacher }) {
  if (!teacher) return null

  function getTeacherRoles() {
    return teacher.roles.map(role => {
      switch (role) {
        case 'admin':
          return 'מנהל'
        case 'instructor':
          return 'מורה'
        case 'conductor':
          return 'מנצח'
        default:
          return 'אורח'
      }
    }).join(' | ')
  }

  return(
    <div className='teacher-preview'>
        <Link to={`/teachers/${teacher._id}`}>
            <div className='avatar'>{teacher.fullName[0].toUpperCase()}</div>
            <div className='teacher-header'>
              <h3>{teacher.fullName}</h3>
              <div className='teacher-info'>
                <p>{getTeacherRoles()}</p>
                <p>{teacher.instrument}</p>
              </div>
            </div>
        </Link>
      <div className='actions-container'>
        <button
          className='material-symbols-outlined'
          onClick={() => onRemoveTeacher(teacher._id)}
        >
          delete
        </button>
          <TeacherFormModal
            teacherToEdit={teacher}
            onUpdateTeacher={onUpdateTeacher}
          />
      </div>
    </div>
  )
}