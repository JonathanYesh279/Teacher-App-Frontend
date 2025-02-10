import { useCallback, useEffect, useRef, useState } from 'react';
import { StudentList } from '../../components/student/StudentList';
import { studentService } from '../../service/student.service';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { FilterTags } from './../../components/FilterTags';
import { debounce } from 'lodash';
import { StudentFormModal } from '../../components/student/StudentFormModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'

export function StudentIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef(null);
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { id } = useParams()
  const { teacher } = useAuth()
  const navigate = useNavigate()
  const [filterBy, setFilterBy] = useState({
    txt: searchParams.get('txt') || '',
    instrument: searchParams.get('instrument') || '',
    class: searchParams.get('class') || '',
    'teachers.teacherName': searchParams.get('teachers.teacherName') || '',
    orchestras: searchParams.get('orchestras') || '',
    stageTest: searchParams.get('stageTest') || '',
    sortBy: searchParams.get('sortBy') || 'fullName',
    sortOrder: searchParams.get('sortOrder') || 'asc',
  })
  const [searchTerm, setSearchTerm] = useState(filterBy.txt)

  console.log('students:', students)

  const debounceSearch = useCallback(
    debounce((value) => {
      setFilterBy(prev => ({ ...prev, txt: value }))
    }, 500),
    []
  )

  useEffect(() => {
    if (!isInitialized && teacher) {
      loadStudents()
      setIsInitialized(true)
    }
  }, [isInitialized, teacher])

  useEffect(() => { 
    if (isFocused && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isFocused, students])

  useEffect(() => {
    if (isInitialized) {
      loadStudents()
  }
  }, [filterBy, isInitialized])

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filterBy).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filterBy])

  async function loadStudents() {
    try {
      setIsLoading(true);
      const students = await studentService.query(filterBy)
      setStudents(Array.isArray(students) ? students : [])
      setError(null)
    } catch (err) {
      console.error('Failed to load students:', err);
      if (err.response === 'Unauthorized') {
        navigate('/login', { replace: true })
        return 
      }
      setError('Failed to load students. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilter(filterUpdate) {
    setFilterBy((prev) => ({ ...prev, ...filterUpdate }));
  }

  function handleSort(sortBy) {
    const sortOrder =
      filterBy.sortBy === sortBy && filterBy.sortOrder === 'asc'
        ? 'desc'
        : 'asc';
    handleFilter({ sortBy, sortOrder });
  }

  async function handleAddStudent(student) {
    try {
      await studentService.add(student)
      loadStudents()
    } catch (err) {
      console.error('Failed to add student:', err)
      throw new Error('Failed to add student')
    }
  }

  async function handleUpdateStudent(student) {
    try {
      await studentService.update(student)
      loadStudents()
    } catch (err) {
      console.error('Failed to update student:', err)
      throw new Error('Failed to update student')
    }
  }

  async function handleRemoveStudent(studentId) {
    try {
      setStudents(prev => prev.filter(student => student._id !== studentId))
      await studentService.remove(studentId)
      loadStudents()
    } catch (err) {
      console.error('Failed to remove student:', err)
      throw new Error('Failed to remove student')
    }
  }

return (
  <div className='student-index'>
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
          students,
          onRemoveStudent: handleRemoveStudent,
          onUpdateStudent: handleUpdateStudent,
        }}
      />
    )}

    {!isLoading && !error && !id && (
      <>
        <div className='wrapper'>
          <StudentFormModal onAddStudent={handleAddStudent} />
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
          <FilterTags onFilter={handleFilter} filterBy={filterBy} />
        </div>

        {students.length ? (
          <StudentList
            students={students}
            onSort={handleSort}
            sortBy={filterBy.sortBy}
            sortOrder={filterBy.sortOrder}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        ) : (
          <div className='students-list empty'>
            <div className='no-results'>No students found</div>
          </div>
        )}
      </>
    )}
  </div>
);
}
