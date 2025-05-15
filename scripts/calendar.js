const calendarDays = document.querySelector('.days');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const currentMonthEl = document.querySelector('.current-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const events = [
  { date: '2023-05-15', title: 'Meeting' },
  { date: '2023-05-20', title: 'Appointment' },
  { date: '2023-06-01', title: 'Birthday Party' }
];

function renderCalendar() {
  calendarDays.innerHTML = '';
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    calendarDays.appendChild(day);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    day.textContent = i;

    // Check for events on the current day
    const eventForDay = events.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth && eventDate.getDate() === i;
    });

    if (eventForDay) {
      day.classList.add('event');
      day.dataset.eventTitle = eventForDay.title;
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

calendarDays.addEventListener('click', (event) => {
  if (event.target.classList.contains('day')) {
    const selectedDay = event.target;
    const eventTitle = selectedDay.dataset.eventTitle;

    if (eventTitle) {
      alert(`Event: ${eventTitle}`);
    } else {
      alert('No event for this day.');
    }
  }
});



renderCalendar();
