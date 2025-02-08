import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TeacherFormModal } from './TeacherFormModal';

export function TeacherPreview({ teacher, onRemoveTeacher, onUpdateTeacher }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const previewRef = useRef(null);

  function handleTouchStart(e) {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  }

  const THRESHOLD = 35; // Minimum distance before sliding starts
  const MAX_SLIDE = 120; // Maximum slide distance

  function handleTouchMove(e) {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX;

    // Only allow sliding to the right and apply threshold
    if (diff < THRESHOLD) {
      setCurrentX(0);
      return;
    }

    // Scale the movement to feel less sensitive
    // Subtract threshold and scale remaining distance
    const scaledDiff = (diff - THRESHOLD) * 0.5; // Reduce sensitivity by 30%
    const newX = Math.min(MAX_SLIDE, Math.max(0, scaledDiff));
    setCurrentX(newX);
  }

  function handleTouchEnd() {
    setIsSwiping(false);
    // Snap to position
    if (currentX > 60) {
      setCurrentX(120);
    } else {
      setCurrentX(0);
    }
  }

  async function handleRemoveTeacher(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onRemoveTeacher(teacher._id);
      setCurrentX(0);
    } catch (err) {
      console.error('Error removing teacher:', err);
    }
  }

  function getTeacherRoles() {
    return teacher.roles
      .map((role) => {
        switch (role) {
          case 'admin':
            return 'מנהל';
          case 'instructor':
            return 'מורה';
          case 'conductor':
            return 'מנצח';
          default:
            return 'אורח';
        }
      })
      .join(' | ');
  }

  if (!teacher) return null;

  return (
    <div
      className={`teacher-preview-container ${
        currentX > 0 ? 'is-sliding' : ''
      }`}
    >
      <div className='action-buttons'>
        <button className='action-btn delete-btn' onClick={handleRemoveTeacher}>
          <span className='material-symbols-outlined'>delete</span>
        </button>
        <button className='action-btn edit-btn'>
          <TeacherFormModal
            teacherToEdit={teacher}
            onUpdateTeacher={onUpdateTeacher}
            triggerClass='material-symbols-outlined'
            triggerText='edit'
          />
        </button>
      </div>

      <div
        ref={previewRef}
        className='teacher-preview'
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
        <Link to={`/teachers/${teacher._id}`}>
          <div className='teacher-header'>
            <div className='avatar'>{teacher.fullName.charAt(0)}</div>
            <div className='teacher-basic-info'>
              <h4>{teacher.fullName}</h4>
              <div className='info-container'>
                <div className='role-badge'>{getTeacherRoles()}</div>
              </div>
            </div>
          </div>

          <div className='teacher-details'>
            <div className='info-row'>
              <p>{teacher.instrument}</p>
              {teacher.phone && <p>{teacher.phone}</p>}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
