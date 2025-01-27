import { useEffect, useRef } from 'react'
import { StudentPreview } from './StudentPreview'

export function StudentList({ students = [], onRemoveStudent, onUpdateStudent }) {
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
    
    const previews = listRef.current?.querySelectorAll('.student-preview')
    previews?.forEach(preview => observer.observe(preview))

    return () => observer?.disconnect()
  }, [students])


  if (!students.length) return <div>No students found</div>

  return (
    <div className='student-list' ref={listRef}>
      {students.map((student) => (
        <StudentPreview
          key={student._id}
          student={student}
          onRemoveStudent={onRemoveStudent}
          onUpdateStudent={onUpdateStudent}
        />
      ))}
    </div>
  )
}
