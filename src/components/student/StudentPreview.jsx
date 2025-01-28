import { Link } from 'react-router'
import { StudentFormModal } from './StudentFormModal'

export function StudentPreview({ student, onRemoveStudent, onUpdateStudent }) {

  async function handleRemoveStudent(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await onRemoveStudent(student._id)
    } catch (err) {
      console.error('Error removing student:', err)
    }
  }

  const getStatusLabel = () => {
    if (student.stageTest === 'passed') return 'עבר';
    if (student.stageTest === 'failed') return 'נכשל';
    if (student.stageTest === 'not_tested') return 'לא נבחן';
    return '';
  }

  if (!student) return null

  return (
    <div className='student-preview'>
      <Link to={`/students/${student._id}`}>
        <div className='student-header'>
          <div className='avatar'>{student.fullName.charAt(0)}</div>
          <div className='student-basic-info'>
            <h4>{student.fullName}</h4>
            <div className='status-container'>
              <span className={`status-badge ${student.stageTest}`}>
                {getStatusLabel()}
              </span>
              {student.currentStage !== null && (
                <label className='stage'>שלב {student.currentStage}</label>
              )}
            </div>
          </div>
        </div>

        <div className='student-details'>
          <div className='info-row'>
            <p>{student.instrument}</p>
            {student.class && <p>כיתה {student.class}</p>}
            <p>מורה: {student.teachers?.[0]?.teacherName || ''}</p>
            {Array.isArray(student.orchestras) &&
              student.orchestras.length > 0 && (
                <>
                  {student.orchestras.map((orchestra, index) => (
                    <p key={index}>{orchestra}</p>
                  ))}
                </>
              )}
          </div>
        </div>
      </Link>
      <div className='actions-container'>
        <button
          className='material-symbols-outlined'
          onClick={handleRemoveStudent}
        >
          delete
        </button>
          <StudentFormModal
            studentToEdit={student}
            onUpdateStudent={onUpdateStudent}
          />
      </div>
    </div>
  );
}
