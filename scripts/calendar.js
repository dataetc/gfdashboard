const calendarDays = document.querySelector('.days');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const currentMonthEl = document.querySelector('.current-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let events = [];

fetch('events.json')
  .then(response => response.json())
  .then(data => {
    events = data;
    renderCalendar();
  })
  .catch(error => {
    console.error('Error fetching events:', error);
  });

function hasEvent(year, month, day) {
//  const eventDate = new Date(year, month, day).toISOString().slice(0, 10);
  const eventDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  //const eventCount = events.filter(event => event.date === eventDate).length;
  //return eventCount;
  return events.filter(event => event.date === eventDate).length;
}

function renderCalendar() {
  calendarDays.innerHTML = '';
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Figure out which month/year comes before the current one
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear  = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Number of days in that previous month
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  // `firstDay` tells us how many leading cells belong to the previous month.
  // We count backwards from the last day of the previous month.
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.classList.add('day', 'last-month');           // keep your styling

    const dayNumber = document.createElement('span');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = daysInPrevMonth - i;      // e.g. 30,31,1…
    day.appendChild(dayNumber);

    calendarDays.appendChild(day);
  }

  /* for (let i = 0; i < firstDay; i++) {
    const day = document.createElement('div');
    day.classList.add('day', 'last-month');
    calendarDays.appendChild(day);
  } */

  for (let i = 1; i <= daysInMonth; i++) {
  const day = document.createElement('div');
day.classList.add('day');

const dayNumber = document.createElement('span');
dayNumber.classList.add('day-number');
dayNumber.textContent = i;
day.appendChild(dayNumber);

const eventCount = hasEvent(currentYear, currentMonth, i);
if (eventCount > 0) {
  day.classList.add('event');

  const eventDate = new Date(currentYear, currentMonth, i).toISOString().slice(0, 10);
  const dayEvents = events.filter(event => event.date === eventDate);

  const ul = document.createElement('ul');
  ul.classList.add('event-list');

  dayEvents.slice(0, 2).forEach(event => {
    const li = document.createElement('li');
    li.textContent = event.title;
    ul.appendChild(li);
  });

  if (dayEvents.length > 2) {
    const moreLi = document.createElement('li');
    moreLi.innerHTML = `<strong>+${dayEvents.length - 2} more</strong>`;
    ul.appendChild(moreLi);
  }

  day.appendChild(ul);

  day.addEventListener('click', () => {
    showModal(eventDate, dayEvents);
  });
}

  if (
    i === currentDate.getDate() &&
    currentMonth === currentDate.getMonth() &&
    currentYear === currentDate.getFullYear()
  ) {
    day.classList.add('today');
  }

  calendarDays.appendChild(day);
  }

  // How many cells are already in the grid?
  const totalCellsSoFar = firstDay + daysInMonth;
  // Calendar rows are groups of 7 cells. Find the next multiple of 7.
  const cellsNeeded = Math.ceil(totalCellsSoFar / 7) * 7;
  const extraDays   = cellsNeeded - totalCellsSoFar;   // number of “future‑month” cells

  for (let i = 1; i <= extraDays; i++) {
    const day = document.createElement('div');
    day.classList.add('day', 'future-month');  

    // Create the span that holds the day number (mirrors the normal cells)
    const dayNumber = document.createElement('span');
    dayNumber.classList.add('day-number');   // reuse the same styling class
    dayNumber.textContent = i;               // i starts at 1 → first day of next month
    day.appendChild(dayNumber);

    calendarDays.appendChild(day);
  }

  const lang = localStorage.getItem('preferredLanguage') || 'EN'; // get current language or default
currentMonthEl.textContent = `${languageData[lang].monthsLong[currentMonth]} ${currentYear}`;

}

function renderWeekdays() {
  const weekdaysContainer = document.querySelector('.weekdays');
  weekdaysContainer.innerHTML = ''; // clear existing

  const lang = localStorage.getItem('preferredLanguage') || 'EN';
  const days = languageData[lang].daysShort;

  days.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.classList.add('weekday');
    dayEl.textContent = day;
    weekdaysContainer.appendChild(dayEl);
  });
}

function showModal(dateStr, eventList) {
  const { daysLong, monthsLong } = window.languageData[localStorage.getItem('preferredLanguage') || 'EN'];
  const modal = document.getElementById('event-modal');
  const modalDate = document.getElementById('modal-date');
  const modalEvents = document.getElementById('modal-events');
  const closeButton = document.querySelector('.close-button');

  // Parse the date string as local, not UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day); // month is 0-based
  const weekday = daysLong[dateObj.getDay()];
  const dayNum = dateObj.getDate();

  modalDate.innerHTML = `<div class="modal-title">${weekday}<br>${dayNum}</div>`;

  modalEvents.innerHTML = '';

if (eventList.length === 0) {
    modalEvents.innerHTML = '<p>No events for this day.</p>';
  } else {
    eventList.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event-item');
      
      // Specific handling for hybrid events
      const linkDisplay = event.link 
        ? (event.link.includes("In-person only") 
           ? event.link 
           : event.link.includes("Online at:") && event.link.includes("and in-person:")
             ? event.link.replace(
                 /Online at: (.*?) and in-person:/,
                 (match, url) => `Online at: <a href="${url.trim()}" target="_blank">${url.trim()}</a> and in-person:`
               )
             : `<a href="${event.link}" target="_blank">${event.link}</a>`)
        : '—';

      eventDiv.innerHTML = `
        <strong>${event.title}</strong><br>
        ${event.time ? `<em>${event.time}</em><br>` : ''}
        <div><strong>Host:</strong> ${event.host || '—'}</div>
        <div><strong>Description:</strong> ${event.description || '—'}</div>
        <div><strong>Link:</strong> ${linkDisplay}</div>
        <div><strong>Language:</strong> ${event.language || '—'}</div>
      `;
      modalEvents.appendChild(eventDiv);
    });
  }

  modal.style.display = 'block';

  closeButton.onclick = () => modal.style.display = 'none';
  window.onclick = e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}



prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});
