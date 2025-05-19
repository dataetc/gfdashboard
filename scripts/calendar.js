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

  for (let i = 0; i < firstDay; i++) {
    const day = document.createElement('div');
    day.classList.add('day', 'prev-month');
    calendarDays.appendChild(day);
  }

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
      eventDiv.innerHTML = `
        <strong>${event.title}</strong><br>
        ${event.time ? `<em>${event.time}</em><br>` : ''}
        <div><strong>Host:</strong> ${event.host || '—'}</div>
        <div><strong>Link:</strong> ${event.link ? `<a href="${event.link}" target="_blank">${event.link}</a>` : '—'}</div>
        <div><strong>Description:</strong> ${event.description || '—'}</div>
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
