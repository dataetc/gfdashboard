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
  const eventDate = new Date(year, month, day).toISOString().slice(0, 10);
  const eventCount = events.filter(event => event.date === eventDate).length;
  return eventCount;
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

    const eventCount = hasEvent(currentYear, currentMonth, i);
    if (eventCount > 0) {
      day.classList.add('event');
      const eventText = document.createElement('span');
      eventText.classList.add('event-text');
      eventText.textContent = eventCount;
      day.appendChild(eventText);
    }

    day.textContent = i;

    if (i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
      day.classList.add('today');
    }

    calendarDays.appendChild(day);
  }

  currentMonthEl.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;
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
