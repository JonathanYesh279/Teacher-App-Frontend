import { TeacherPreview } from './TeacherPreview'

export function TeacherList({ teachers = [] }) {
  return (
    <div className='teacher-list'>
      {teachers.map(teacher => (
        <TeacherPreview key={teacher._id} teacher={teacher} />
      ))}
    </div>
  )
}