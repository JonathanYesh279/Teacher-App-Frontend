import { useOutletContext, useParams, Link } from "react-router"

export function TeacherDetails() {
  const { id } = useParams()
  const { teachers } = useOutletContext()

  const teacher = teachers.find(teacher => teacher._id === id)
  
  if (!teacher) return <div>Teacher not found</div>
  
  return (
    <div className='teacher-details'>
      <Link to='/teachers'>Back
         <span className='material-symbols-outlined'>arrow_back</span>
      </Link>
      <div>teacher info here</div>
    </div>
  )
}