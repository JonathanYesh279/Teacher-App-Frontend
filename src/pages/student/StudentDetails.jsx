import { useEffect, useState } from 'react';
import {
  useOutletContext,
  useParams,
  Link,
  useNavigate,
} from 'react-router-dom';
import { StudentFormModal } from '../../components/student/StudentFormModal';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export function StudentDetails() {
  const { id } = useParams();
  const { students, onRemoveStudent, onUpdateStudent } = useOutletContext();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  

  useEffect(() => {
    const menu = document.querySelector('.slider-menu');
    const activeItem = menu?.querySelector('.active');

    if (!menu || !activeItem) return;

    const width = activeItem.offsetWidth;
    menu.style.setProperty('--slider-width', `${width}px`);
    menu.style.setProperty('--slider-offset', `${activeItem.offsetLeft}px`);
  }, [activeTab]);

  const student = students?.find((student) => student._id === id);

  async function handleRemoveStudent(e) {
    try {
      await onRemoveStudent(student._id);
      navigate('/students');
    } catch (err) {
      console.error('Error removing student:', err);
      throw new Error('Failed to remove student');
    }
  }

  const menuItems = [
    { id: 'overview', label: 'מידע כללי' },
    { id: 'attendance', label: 'נוכחות בתזמורות' },
    { id: 'comments', label: 'הערות' },
    { id: 'documents', label: 'מסמכים' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <h3>נוכחות בתזמורות ופעילויות</h3>;
      case 'comments':
        return <h3>הערות והתקדמות התלמיד</h3>;
      case 'documents':
        return <h3>מסמכים ואישורים</h3>;
      default:
        return (
          <ul className='student-list-info'>
            <li className='student-info-item'>
              <span className='material-symbols-outlined'>music_note</span>
              <div>
                <label>כלי נגינה</label>
                <p>{student.instrument}</p>
              </div>
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>today</span>
              <div>
                <label>כיתה</label>
                <p>{student.class}</p>
              </div>
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>school</span>
              <div>
                <label>מורה</label>
                <p>{student.teachers[0]?.teacherName}</p>
              </div>
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>editor_choice</span>
              <div>
                <label>שלב</label>
                <p>{student.currentStage}</p>
              </div>
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>piano</span>
              <div>
                <label>תזמורת</label>
                <div>
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
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>build</span>
              <div>
                <label>מבחן טכני</label>
                <p>
                  {student.technicalTest === 'not_tested'
                    ? 'לא נבחן'
                    : student.technicalTest === 'passed'
                    ? 'עבר'
                    : student.technicalTest === 'failed'
                    ? 'לא עבר'
                    : null}
                </p>
              </div>
            </li>

            <li className='student-info-item'>
              <span className='material-symbols-outlined'>trophy</span>
              <div>
                <label>מבחן שלב</label>
                <p>{student.stageTest ? 'עבר' : 'לא עבר'}</p>
              </div>
            </li>
          </ul>
        );
    }
  };

  if (!student) return <div>Student not found</div>;

  return (
    <div className='student-details-page'>
      <div className='wrapped'>
        <div className='student-header-container'>
          <div className='student-header'>
            <Link to='/students'>
              <span className='material-symbols-outlined'>chevron_right</span>
            </Link>
            <h2>{student.fullName}</h2>
            <div className='actions-container'>
              <div className='actions-container'>
                <StudentFormModal
                  studentToEdit={student}
                  onUpdateStudent={onUpdateStudent}
                />
                <button
                  onClick={handleRemoveStudent}
                  className='material-symbols-outlined'
                >
                  delete
                </button>
              </div>
              <span className='material-symbols-outlined'>notifications</span>
              <DialogPrimitive.Root>
                <DialogPrimitive.Trigger asChild>
                  <button className='btn'>יצירת קשר</button>
                </DialogPrimitive.Trigger>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className='dialog-overlay' />
                  <DialogPrimitive.Content className='dialog-content'>
                    <DialogPrimitive.Title className='dialog-title'>
                      פרטי קשר - {student.fullName}
                    </DialogPrimitive.Title>
                    <div className='contact-info'>
                      <div className='info-item'>
                        <span className='material-symbols-outlined'>mail</span>
                        <p>student@email.com</p>
                      </div>
                      <div className='info-item'>
                        <span className='material-symbols-outlined'>phone</span>
                        <p>054-1234567</p>
                      </div>
                    </div>
                    <DialogPrimitive.Close asChild>
                      <button className='btn-secondary'>סגור</button>
                    </DialogPrimitive.Close>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              </DialogPrimitive.Root>
            </div>
          </div>
          <ul className='slider-menu'>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`list-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className='student-info-container'>{getTabContent()}</div>
      </div>
    </div>
  );
}
