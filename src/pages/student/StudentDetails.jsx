import { useEffect, useState } from "react"
import { useOutletContext, useParams, Link, useNavigate } from "react-router-dom"
import { StudentFormModal } from "../../components/student/StudentFormModal";


export function StudentDetails() {
  const { id } = useParams()
  const { students, onRemoveStudent, onUpdateStudent } = useOutletContext()
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

useEffect(() => {
   const menu = document.querySelector('.slider-menu');
   const activeItem = menu?.querySelector('.active');

   if (!menu || !activeItem) return;

   const width = activeItem.offsetWidth;
   menu.style.setProperty('--slider-width', `${width}px`);
   menu.style.setProperty('--slider-offset', `${activeItem.offsetLeft}px`);
}, [activeTab]);

  const student = students?.find((student) => student._id === id)

  async function handleRemoveStudent(e) {
    try {
      await onRemoveStudent(student._id)
      navigate('/students')
    } catch (err) {
      console.error('Error removing student:', err)
      throw new Error('Failed to remove student')
    }
  }

  
  const menuItems = [
    { id: 'overview', label: 'מידע כללי' },
    { id: 'attendance', label: 'נוכחות בתזמורות' },
    { id: 'comments', label: 'הערות' },
    { id: 'documents', label: 'מסמכים' },
  ];
  
  if (!student) return <div>Student not found</div>

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
              <button className='btn'>יצירת קשר</button>
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
        <div className='student-info-container'>
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
              <span className='material-symbols-outlined'>trophy</span>
              <div>
                <label>מבחן שלב</label>
                <p>{student.stageTest ? 'עבר' : 'לא עבר'}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

        {
          /* <div className='student-info'>
          <p>{student.instrument}</p>
          <p>שלב: {student.currentStage}</p>
          <p>מורה: {student.teachers[0]?.teacherName}</p>
          <p>תזמורת: {student.orchestras}</p>
          <p>מבחן שלב: {student.stageTest ? 'עבר' : 'לא עבר'}</p>
        </div> */
        }