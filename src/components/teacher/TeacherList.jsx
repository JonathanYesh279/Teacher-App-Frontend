import { useEffect, useRef } from 'react'
import { TeacherPreview } from './TeacherPreview'

export function TeacherList({ teachers = [], onRemoveTeacher, onUpdateTeacher }) {
  const listRef = useRef(null)
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          })
        },
        { threshold: 0.1 }
      )
      
      const previews = listRef.current?.querySelectorAll('.teacher-preview')
      previews?.forEach(preview => observer.observe(preview))
  
      return () => observer?.disconnect()
    }, [teachers])

  if (!teachers.length) return <div>No teacher found</div>

  return (
    <div className='teacher-list'>
      {teachers.map(teacher => (
        <TeacherPreview
          key={teacher._id}
          teacher={teacher}
          onRemoveTeacher={onRemoveTeacher}
          onUpdateTeacher={onUpdateTeacher}
        />
      ))}
    </div>
  )
}