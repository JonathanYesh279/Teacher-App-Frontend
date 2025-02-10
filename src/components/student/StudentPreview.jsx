import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentFormModal } from './StudentFormModal';

export function StudentPreview({ student, onRemoveStudent, onUpdateStudent }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const previewRef = useRef(null);

  const THRESHOLD = 35; // Minimum distance before sliding starts
  const MAX_SLIDE = 120; // Maximum slide distance

  function handleTouchStart(e) {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  }

  function handleTouchMove(e) {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX;

    // Only allow sliding to the right and apply threshold
    if (diff < THRESHOLD) {
      setCurrentX(0);
      return;
    }

    // Scale the movement to feel less sensitive
    const scaledDiff = (diff - THRESHOLD) * 0.7; // Reduce sensitivity by 30%
    const newX = Math.min(MAX_SLIDE, Math.max(0, scaledDiff));
    setCurrentX(newX);
  }

  function handleTouchEnd() {
    setIsSwiping(false);
    // Snap to position with a more generous threshold
    if (currentX > MAX_SLIDE * 0.3) {
      // Only snap open if pulled 30% of max distance
      setCurrentX(MAX_SLIDE);
    } else {
      setCurrentX(0);
    }
  }

  async function handleRemoveStudent(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onRemoveStudent(student._id);
      setCurrentX(0);
    } catch (err) {
      console.error('Error removing student:', err);
    }
  }

  function getStatusLabel() {
    if (student.stageTest === 'passed') return 'עבר';
    if (student.stageTest === 'failed') return 'לא עבר';
    if (student.stageTest === 'not_tested') return 'לא נבחן';
    return '';
  }

  if (!student) return null;

  return (
    <div
      className={`student-preview-container ${
        currentX > 0 ? 'is-sliding' : ''
      }`}
    >
      <div className='action-buttons'>
        <button className='action-btn delete-btn' onClick={handleRemoveStudent}>
          <span className='material-symbols-outlined'>delete</span>
        </button>
        <button className='action-btn edit-btn'>
          <StudentFormModal
            studentToEdit={student}
            onUpdateStudent={onUpdateStudent}
            triggerClass='material-symbols-outlined'
            triggerText='edit'
          />
        </button>
      </div>

      <div
        ref={previewRef}
        className='student-preview'
        style={{
          transform: `translateX(${currentX}px)`,
          transition: isSwiping
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
              <p>{student.teachers[0].teacherName}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
