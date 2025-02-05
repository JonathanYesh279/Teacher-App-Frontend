import { Outlet, useParams } from "react-router"
import { teacherService } from './../../service/teacher.service';
import { useCallback, useEffect, useRef, useState } from "react";
import { TeacherList } from './../../components/teacher/TeacherList';
import { debounce } from 'lodash';
import { TeacherFormModal } from '../../components//teacher/TeacherFormModal.jsx'


export function TeacherIndex() {
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef(null)
  const { id } = useParams()

  const debounceSearch = useCallback(
    debounce((value) => {
      setFilterBy(prev => ({ ...prev, txt: value }))
    }, 500),
    [])

  useEffect(() => {
    loadTeachers()
  }, [])

  useEffect(() => {
    if (isFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isFocused, teachers])
  
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

  async function handleAddTeacher(teacher) {
    try {
      await teacherService.add(teacher)
      loadTeachers()
    } catch (err) {
      console.error('Failed to add teacher:', err)
      throw new Error('Failed to add teacher')
    }
  }

  async function handleUpdateTeacher(teacher) {
    try {
      await teacherService.update(teacher)
      loadTeachers()
    } catch (err) {
      console.error('Failed to update teacher:', err)
      throw new Error('Failed to update teacher')
    }
  }

  async function handleRemoveTeacher(teacherId) { 
    try {
      setTeachers(prev => prev.filter(teacher => teacher._id !== teacherId))
      await teacherService.remove(teacherId)
      loadTeachers()
    } catch (err) {
      console.error('Failed to remove teacher:', err)
      throw new Error('Failed to remove teacher')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='teacher-index'>
      {isLoading && (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}

      {error && (
        <div className='error-message-container'>
          <span className='material-symbols-outlined'>arrow_back_ios_new</span>
          <div className='error-message'>Error: {error}</div>
        </div>
      )}

      {id && (
        <Outlet
          context={{
            teachers,
            onRemoveTeacher: handleRemoveTeacher,
            onUpdateTeacher: handleUpdateTeacher,
          }}
        />
      )}

      {!isLoading && !error && !id && (
        <>
          <div className='wrapper'>
            <TeacherFormModal onAddTeacher={handleAddTeacher} />
            <div className='search-container'>
              <input
                ref={searchInputRef}
                type='text'
                placeholder='חיפוש'
                value={searchTerm}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  if (!e.relatedTarget?.closest('.search-container')) {
                    setIsFocused(false);
                  }
                }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debounceSearch(e.target.value);
                }}
              />
              <span className='material-symbols-outlined'>search</span>
            </div>
          </div>

          {teachers.length ? (
            <TeacherList
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              onRemoveTeacher={handleRemoveTeacher}
              onUpdateTeacher={handleUpdateTeacher}
            />
          ) : (
            <div className='teachers-list empty'>
              <div className='no-results'>No teachers found</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}