import React, { useState, useEffect, useRef } from 'react';

export function FilterTags({ onFilter, filterBy }) {
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(filterBy);
  const modalRef = useRef(null);

  const filterOptions = {
    instrument: ['חליל צד', 'קלרינט', 'סקסופון', 'חצוצרה', 'טרומבון', 'טובה'],
    class: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'],
    stageTest: [
      { value: 'not_tested', label: 'לא נבחן' },
      { value: 'passed', label: 'עבר' },
      { value: 'failed', label: 'נכשל' },
    ],
    orchestras: [
      'תזמורת יצוגית נשיפה',
      'תזמורת סימפונית',
      'תזמורת עתודה נשיפה',
      'תזמורת צעירה נשיפה',
    ],
  };

  const filterTitles = {
    instrument: 'כלי נגינה',
    class: 'כיתה',
    stageTest: 'מבחן שלב',
    orchestras: 'תזמורת',
  };

  useEffect(
    function () {
      function handleClickOutside(event) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          closeModal();
        }
      }

      if (openFilter) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return function () {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [openFilter]
  );

  function openModal(filterType) {
    setOpenFilter(filterType);
    setSelectedOptions(filterBy);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setOpenFilter(null);
    document.body.style.overflow = '';
  }

  function handleClearFilter(e, filterType) {
    e.stopPropagation();
    onFilter({ [filterType]: '' });
  }

  function handleOptionSelect(value) {
    setSelectedOptions(function (prev) {
      return {
        ...prev,
        [openFilter]: value === selectedOptions[openFilter] ? '' : value,
      };
    });
  }

  function applyFilter() {
    onFilter({ [openFilter]: selectedOptions[openFilter] });
    closeModal();
  }

  function renderFilterOptions() {
    if (!openFilter) return null;

    if (openFilter === 'stageTest') {
      return filterOptions[openFilter].map(function (option) {
        return (
          <div
            key={option.value}
            className={`filter-option ${
              selectedOptions[openFilter] === option.value ? 'selected' : ''
            }`}
            onClick={function () {
              handleOptionSelect(option.value);
            }}
          >
            {option.label}
            {selectedOptions[openFilter] === option.value && (
              <span className='material-symbols-outlined'>check</span>
            )}
          </div>
        );
      });
    }

    return filterOptions[openFilter]?.map(function (option) {
      return (
        <div
          key={option}
          className={`filter-option ${
            selectedOptions[openFilter] === option ? 'selected' : ''
          }`}
          onClick={function () {
            handleOptionSelect(option);
          }}
        >
          {option}
          {selectedOptions[openFilter] === option && (
            <span className='material-symbols-outlined'>check</span>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <div className='filters' dir='rtl'>
        {Object.entries(filterOptions).map(function ([filterType]) {
          return (
            <div className='filter-section' key={filterType}>
              <div
                className={`filter-tag ${
                  filterBy[filterType] ? 'has-value' : ''
                }`}
                onClick={function () {
                  openModal(filterType);
                }}
              >
                <span>{filterTitles[filterType]}</span>
                {filterBy[filterType] && (
                  <>
                    <span className='selected-value'>
                      {filterType === 'stageTest'
                        ? filterOptions.stageTest.find(function (opt) {
                            return opt.value === filterBy[filterType];
                          })?.label
                        : filterBy[filterType]}
                    </span>
                    <button
                      className='clear-button'
                      onClick={function (e) {
                        handleClearFilter(e, filterType);
                      }}
                      aria-label='Clear filter'
                    >
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M9 3L3 9M3 3L9 9'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Modal */}
      <div className={`filter-modal-overlay ${openFilter ? 'show' : ''}`}>
        <div
          ref={modalRef}
          className={`filter-modal ${openFilter ? 'show' : ''}`}
          dir='rtl'
        >
          {openFilter && (
            <>
              <div className='modal-header'>
                <h3>בחר {filterTitles[openFilter]}</h3>
                <button className='close-button' onClick={closeModal}>
                  <span className='material-symbols-outlined'>close</span>
                </button>
              </div>

              <div className='filter-options'>{renderFilterOptions()}</div>

              <button className='apply-button' onClick={applyFilter}>
                החל סינון
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
