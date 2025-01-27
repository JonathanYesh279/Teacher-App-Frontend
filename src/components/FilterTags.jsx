import React, { useState, useEffect, useRef } from 'react';

export function FilterTags({ onFilter, filterBy }) {
  const [openFilter, setOpenFilter] = useState(null);
  const filterRef = useRef(null);

  const filterOptions = {
    instrument: ['חליל צד', 'קלרינט', 'סקסופון', 'חצוצרה', 'טרומבון', 'טובה'],
    class: [ 'א', 'ב', 'ג' ,'ד' ,'ה' ,'ו','ז' , 'ח' , 'ט' , 'י' , 'יא' , 'יב'],
    stageTest: [
      { value: 'not_tested', label: 'לא נבחן' },
      { value: 'passed', label: 'עבר' },
      { value: 'failed', label: 'נכשל' },
    ],
    orchestras: ['תזמורת יצוגית נשיפה', 'תזמורת סימפונית', 'תזמורת עתודה נשיפה', 'תזמורת צעירה נשיפה'],
  };

  const filterIcons = {
    instrument: 'music_note',
    class: 'school',
    stageTest: 'workspace_premium',
    orchestras: 'piano',
  };

  const filterTitles = {
    instrument: 'כלי נגינה',
    class: 'כיתה',
    stageTest: 'מבחן שלב',
    orchestras: 'תזמורת',
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleFilterClick(filterType) {
    setOpenFilter(openFilter === filterType ? null : filterType);
  }

  function handleOptionSelect(filterType, value) {
    onFilter({ [filterType]: value === filterBy[filterType] ? '' : value });
    setOpenFilter(null);
  }

  function handleRemoveFilter(event, filterType) {
    event.stopPropagation(); // Prevent opening the dropdown
    onFilter({ [filterType]: '' });
  }

  function getFilterLabel(type, value) {
    if (!value) return '';
    if (type === 'stageTest') {
      const option = filterOptions.stageTest.find((opt) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }

  return (
    <div className='filters' ref={filterRef}>
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div className='filter-section' key={filterType}>
          <div
            className={`filter-tag ${
              openFilter === filterType ? 'active' : ''
            } ${filterBy[filterType] ? 'has-value' : ''}`}
            onClick={() => handleFilterClick(filterType)}
          >
            <span className='material-symbols-outlined filter-icon'>
              {filterIcons[filterType]}
            </span>
            <span>{filterTitles[filterType]}</span>
            {filterBy[filterType] && (
              <>
                <span className='selected-value'>
                  {getFilterLabel(filterType, filterBy[filterType])}
                </span>
                <span
                  className='material-symbols-outlined remove-icon'
                  onClick={(e) => handleRemoveFilter(e, filterType)}
                >
                  close
                </span>
              </>
            )}
            <span
              className={`material-symbols-outlined chevron-icon ${
                openFilter === filterType ? 'open' : ''
              }`}
            >
              expand_more
            </span>
          </div>

          <div
            className={`filter-options ${
              openFilter === filterType ? 'show' : ''
            }`}
          >
            <div className='option-header'>
              {`בחר ${filterTitles[filterType]}`}
            </div>

            {filterType === 'stageTest'
              ? options.map((option) => (
                  <div
                    key={option.value}
                    className={`filter-option ${
                      filterBy[filterType] === option.value ? 'selected' : ''
                    }`}
                    onClick={() => handleOptionSelect(filterType, option.value)}
                  >
                    {option.label}
                    <span className='material-symbols-outlined check-icon'>
                      check
                    </span>
                  </div>
                ))
              : options.map((option) => (
                  <div
                    key={option}
                    className={`filter-option ${
                      filterBy[filterType] === option ? 'selected' : ''
                    }`}
                    onClick={() => handleOptionSelect(filterType, option)}
                  >
                    {option}
                    <span className='material-symbols-outlined check-icon'>
                      check
                    </span>
                  </div>
                ))}
          </div>
        </div>
      ))}
    </div>
  );
}
