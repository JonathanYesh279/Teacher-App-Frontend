import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { AutoCompleteDropDown } from './../AutoCompleteDropDown';
import { teacherService } from '../../service/teacher.service.js';

const ROLE_MAPPINGS = {
  מורה: 'instructor',
  מנצח: 'conductor',
  מנהל: 'admin',
};

const ROLE_OPTIONS = Object.keys(ROLE_MAPPINGS);

export function TeacherFormModal({
  onAddTeacher,
  teacherToEdit,
  onUpdateTeacher,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: teacherToEdit?.fullName || '',
    email: teacherToEdit?.email || '',
    phone: teacherToEdit?.phone || '',
    instrument: teacherToEdit?.instrument || '',
    roles: teacherToEdit?.roles || [],
    orchestras: Array.isArray(teacherToEdit?.orchestras)
      ? teacherToEdit.orchestras.join(', ')
      : '',
    theoryClass: teacherToEdit?.theoryClass || '',
    isActive: teacherToEdit?.isActive ?? true,
  });
  const [options, setOptions] = useState({
    instruments: [],
    orchestras: [],
  });

  async function loadOptions() {
    const teachers = await teacherService.query();
    setOptions({
      instruments: [...new Set(teachers.map((t) => t.instrument))]
        .filter(Boolean)
        .sort(),
      orchestras: [...new Set(teachers.flatMap((t) => t.orchestras || []))]
        .filter(Boolean)
        .sort(),
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
    if (teacherToEdit) {
      const hebrewRoles = teacherToEdit.roles
        ?.map(
          (role) =>
            Object.entries(ROLE_MAPPINGS).find(([_, v]) => v === role)?.[0]
        )
        .filter(Boolean);

      setFormData({
        ...teacherToEdit,
        roles: hebrewRoles || [],
        orchestras: Array.isArray(teacherToEdit.orchestras)
          ? teacherToEdit.orchestras.join(', ')
          : '',
      });
    }
  }, [teacherToEdit]);

  function handleSubmit(e) {
    e.preventDefault();
    const processedData = {
      ...formData,
      orchestras: formData.orchestras
        ? formData.orchestras
            .split(',')
            .map((orchestra) => orchestra.trim())
            .filter(Boolean)
        : [],
      roles: formData.roles.map((role) => ROLE_MAPPINGS[role]).filter(Boolean),
      isActive: Boolean(formData.isActive),
    };

    if (teacherToEdit) {
      onUpdateTeacher(processedData);
    } else {
      onAddTeacher(processedData);
    }
    setIsOpen(false);
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        {teacherToEdit ? (
          <span className='material-symbols-outlined'>edit</span>
        ) : (
          <span className='material-symbols-outlined add-btn'>add</span>
        )}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='dialog-overlay' />
        <DialogPrimitive.Content className='dialog-content'>
          <DialogPrimitive.Title className='dialog-title'>
            {teacherToEdit ? 'עריכת מורה' : 'הוספת מורה'}
          </DialogPrimitive.Title>

          <form onSubmit={handleSubmit} className='teacher-form'>
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
                <div className='input-container'>
                  <input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder=' '
                    required
                  />
                  <label htmlFor='email'>אימייל</label>
                </div>
              </div>
              
              <div className='form-field'>
                <div className='input-container'>
                  <input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder=' '
                    required
                  />
                  <label htmlFor='phone'>טלפון</label>
                </div>
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
              <div className='form-field'>
                <AutoCompleteDropDown
                  value={formData.roles}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      roles: Array.isArray(value) ? value : [value],
                    })
                  }
                  options={ROLE_OPTIONS}
                  label='תפקידים'
                  multiple
                />
              </div>
            </div>

            {formData.roles?.includes('מנצח') && (
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
            )}

            <div className='form-row'>
              <div className='form-field'>
                <label className='checkbox-container'>
                  <input
                    type='checkbox'
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span className='checkbox-label'>פעיל</span>
                </label>
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
                {teacherToEdit ? 'עדכן' : 'הוסף מורה'}
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
