import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { AutoCompleteDropDown } from './../AutoCompleteDropDown';
import { studentService } from './../../service/student.service';

export function StudentFormModal({ onAddStudent, studentToEdit, onUpdateStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: studentToEdit?.fullName || '',
    instrument: studentToEdit?.instrument || '',
    currentStage: studentToEdit?.currentStage || '',
    class: studentToEdit?.class || '',
    teachers: studentToEdit?.teachers?.map((t) => t.teacherName).join(', ') || '',
    orchestras: Array.isArray(studentToEdit?.orchestras) ? studentToEdit.orchestras.join(', ') : '',
    stageTest: studentToEdit?.stageTest || 'not_tested',
  });
  const [options, setOptions] = useState({
    instruments: [],
    classes: [],
    teachers: [],
    orchestras: [],
    stages: [],
  });

  async function loadOptions() {
    const students = await studentService.query();
    setOptions({
      instruments: [...new Set(students.map((s) => s.instrument))]
        .filter(Boolean)
        .sort(),
      classes: [...new Set(students.map((s) => s.class))]
        .filter(Boolean)
        .sort(),
      teachers: [...new Set(students.map((s) => s.teachers[0]?.teacherName))]
        .filter(Boolean)
        .sort(),
      orchestras: [...new Set(students.flatMap((s) => s.orchestras || []))]
        .filter(Boolean)
        .sort(),
      stages: [...new Set(students.map((s) => s.currentStage))]
        .filter(Boolean)
        .sort((a, b) => Number(a) - Number(b)),
    });
  }

  useEffect(() => {
    try {
      loadOptions();
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  }, []);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        ...studentToEdit,
        teachers: studentToEdit.teachers?.[0]?.teacherName || '',
        orchestras: Array.isArray(studentToEdit.orchestras)
          ? studentToEdit.orchestras.join(', ')
          : '',
      });
    }
  }, [studentToEdit]);

  function handleSubmit(e) {
    e.preventDefault();
      console.log('orchestras value:', formData.orchestras);
    const processedData = {
      ...formData,
      _id: studentToEdit?._id,
      teachers: [{
        teacherId: null,
        teacherName: formData.teachers,
        role: 'instructor'
      }],
      orchestras: formData.orchestras
        ? formData.orchestras.split(',').map((orchestra) => orchestra.trim()).filter(Boolean) : [],
      currentStage: formData.currentStage ? Number(formData.currentStage) : null,
      class: formData.class || '',
      stageTest: formData.stageTest || 'not_tested',
    }

    if (studentToEdit) {
      onUpdateStudent(processedData)
    } else {
      onAddStudent(processedData)
    }
    setIsOpen(false);
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        {studentToEdit ? (
          <span className='material-symbols-outlined'>edit</span>
        ) : (
          <span className='material-symbols-outlined add-btn'>add</span>
        )}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='dialog-overlay' />
        <DialogPrimitive.Content className='dialog-content'>
          <DialogPrimitive.Title className='dialog-title'>
            {studentToEdit ? 'עריכת תלמיד' : 'הוספת תלמיד'}
          </DialogPrimitive.Title>

          <form onSubmit={handleSubmit} className='student-form'>
            <div className='form-row'>
              <div className='form-field full-width'>
                <div className='input-container'>
                  <input
                    id='fullName'
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder=' '
                    required
                  />
                  <label htmlFor='fullName'>שם מלא</label>
                </div>
              </div>
            </div>

            <div className='form-row'>
              <div className='form-field'>
                <AutoCompleteDropDown
                  value={formData.currentStage}
                  onChange={(value) =>
                    setFormData({ ...formData, currentStage: value })
                  }
                  options={options.stages}
                  label='שלב'
                />
              </div>
              <div className='form-field'>
                <AutoCompleteDropDown
                  value={formData.class}
                  onChange={(value) =>
                    setFormData({ ...formData, class: value })
                  }
                  options={options.classes}
                  label='כיתה'
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-field full-width'>
                <AutoCompleteDropDown
                  value={formData.instrument}
                  onChange={(value) =>
                    setFormData({ ...formData, instrument: value })
                  }
                  options={options.instruments}
                  label='כלי נגינה'
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-field full-width'>
                <AutoCompleteDropDown
                  value={formData.orchestras}
                  onChange={(value) =>
                    setFormData({ ...formData, orchestras: value })
                  }
                  options={options.orchestras}
                  label='תזמורת'
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-field full-width'>
                <AutoCompleteDropDown
                  value={formData.teachers}
                  onChange={(value) =>
                    setFormData({ ...formData, teachers: value })
                  }
                  options={options.teachers}
                  label='מורה'
                />
              </div>
            </div>

            <div className='dialog-footer'>
              <button
                type='button'
                className='btn-secondary'
                onClick={() => setIsOpen(false)}
              >
                ביטול
              </button>
              <button type='submit' className='btn-primary'>
                {studentToEdit ? 'עדכן' : 'הוסף תלמיד'}
              </button>
            </div>
          </form>

          <DialogPrimitive.Close />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
