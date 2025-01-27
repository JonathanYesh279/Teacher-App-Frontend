import { Outlet, useParams } from "react-router"
import { teacherService } from './../../service/teacher.service';
import { TeacherList } from './../../components/teacher/TeacherList';
import { useEffect, useState } from "react";


export function TeacherIndex() {
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    loadTeachers()
  }, [])
  
  async function loadTeachers() {
    try {
      setIsLoading(true)
      const teachers = await teacherService.query()
      setTeachers(teachers)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }  
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="teacher-index">
      {id ? <Outlet context={{teachers}} /> : <TeacherList teachers={teachers || []} />}
    </div>
  )
}