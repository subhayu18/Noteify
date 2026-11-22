const resources = {
  1: [
    ['📘', 'Notes', 'Clear concepts for your core subjects', 'Browse notes', 'https://drive.google.com/drive/folders/1ybhITsJrmKm5FhapAhSsIosBAaKsygVU?usp=sharing'],
    ['✎', 'Previous papers', 'Know the pattern. Practise with intent.', 'View PYQs', 'https://drive.google.com/drive/folders/1-FVsqdNaqpI7Gtw4wYsWiyImaB_bBAWS?usp=sharing'],
    ['▤', 'Textbooks', 'Essential reading, all in one place', 'Open shelf', 'https://drive.google.com/drive/folders/1b-uUnv-qGxSeLWOCHynW7vH3rw3vIfWG?usp=sharing']
  ],
  2: [
    ['📘', 'Notes', 'Build strong technical foundations', 'Browse notes', 'https://drive.google.com/drive/folders/1tiliOH7MNyk-ex4cRlHXeC7Fkk9Ih4wX?usp=sharing'],
    ['✎', 'Previous papers', 'A focused archive of examinations', 'View PYQs', 'https://drive.google.com/drive/folders/1_7C6rkF9aCVqO3PgVp0n5tJYoNfq7M0b?usp=sharing'],
    ['▤', 'Textbooks', 'Essential reading for second-year subjects', 'Open shelf', 'https://drive.google.com/drive/folders/1B5LTxLkjo0WojqAyQ4jHHKpBOvyKkw86?usp=sharing']
  ],
  3: [
    ['📘', 'Notes', 'Detailed resources for your specialization', 'Browse notes', 'https://drive.google.com/drive/folders/1eO_aFyfotJuVas6lO6-Hrj36loOaKJ3-?usp=sharing'],
    ['✎', 'Previous papers', 'Make every revision session count', 'View PYQs', 'https://drive.google.com/drive/folders/1LQXfMtTQ85i57kE6hVfUfT7UzaWxrv47?usp=sharing'],
    ['▤', 'Textbooks', 'Essential reading for your degree path', 'Open shelf', 'https://drive.google.com/drive/folders/1fSQHTnSXUgf8j5I6EmbheRCRdw7z9-Jg?usp=sharing']
  ],
  4: [
    ['📘', 'Notes', 'A polished collection for your last lap', 'Browse notes', 'https://drive.google.com/drive/folders/1QkovywX2P1Uq2xhsuC8O-G-e0p6bL-AU?usp=sharing'],
    ['✎', 'Previous papers', 'Make each revision session count', 'View PYQs', 'https://drive.google.com/drive/folders/1_w3MzGH1u55Y08OEjFUibw05ydvIaDvO?usp=sharing'],
    ['▤', 'Textbooks', 'Essential reference material in one place', 'Open shelf', 'https://drive.google.com/drive/folders/1atjfUizMpfzRCzhLXBfejiec63t58BnW?usp=sharing']
  ],
  exam: [
    ['✦', 'AMCAT resources', 'Build confidence for every section', 'Open resources', 'https://drive.google.com/drive/folders/1H-QktN_i2edww_UFWzmrPzqjCNseUsoO?usp=sharing'],
    ['◈', 'GATE notes', 'Concepts, questions and strategy', 'Prepare for GATE', 'https://drive.google.com/drive/folders/1m65FnZnqW0HabLzi7yW9Rdlt6WHM9uXg?usp=sharing'],
    ['▤', 'GATE worksheets', 'Targeted worksheets for practice', 'Open worksheets', 'https://drive.google.com/drive/folders/1nQ08QsWG-VTg8XlwlCTN-TMhHKsnYtCJ?usp=sharing']
  ]
};
const grid = document.querySelector('#resourceGrid');
const search = document.querySelector('#resourceSearch');
const weatherButton = document.querySelector('#weatherButton');
const weatherIcon = weatherButton.querySelector('.weather-icon');
const weatherReading = weatherButton.querySelector('.weather-reading');
let selected = '1';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const chandigarhUniversity = { latitude: 30.7717, longitude: 76.5755, label: 'CU Mohali' };
const weatherCodes = { 0:['☀','Clear'], 1:['◔','Mainly clear'], 2:['☁','Cloudy'], 3:['☁','Overcast'], 45:['≋','Foggy'], 48:['≋','Foggy'], 51:['☂','Drizzle'], 53:['☂','Drizzle'], 55:['☂','Drizzle'], 61:['☂','Rain'], 63:['☂','Rain'], 65:['☂','Heavy rain'], 71:['❄','Snow'], 73:['❄','Snow'], 75:['❄','Snow'], 80:['☂','Showers'], 81:['☂','Showers'], 82:['☂','Showers'], 95:['ϟ','Storm'] };
async function loadWeather(location = chandigarhUniversity) {
  weatherReading.textContent = 'Loading weather';
  try {
    const query = new URLSearchParams({ latitude: location.latitude, longitude: location.longitude, current: 'temperature_2m,weather_code', timezone: 'auto' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);
    if (!response.ok) throw new Error('Weather unavailable');
    const data = await response.json();
    const [icon, label] = weatherCodes[data.current.weather_code] || ['◌','Weather'];
    weatherIcon.textContent = icon;
    weatherReading.textContent = `${Math.round(data.current.temperature_2m)}° · ${location.label}`;
    weatherButton.title = `${label} in ${location.label}. Click to refresh location.`;
  } catch {
    weatherIcon.textContent = '◌';
    weatherReading.textContent = location.label;
    weatherButton.title = `Weather is unavailable. Showing ${location.label}.`;
  }
}
function detectWeatherLocation() {
  if (!navigator.geolocation) return loadWeather();
  navigator.geolocation.getCurrentPosition(
    position => loadWeather({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: 'Your location' }),
    () => loadWeather(),
    { enableHighAccuracy: false, timeout: 7000, maximumAge: 900000 }
  );
}
weatherButton.addEventListener('click', detectWeatherLocation);
detectWeatherLocation();
function render(filter = '') {
  const term = filter.trim().toLowerCase();
  const items = resources[selected].filter(item => item.join(' ').toLowerCase().includes(term));
  grid.innerHTML = items.length ? items.map(([icon,title,description,action,url], index) => `
    <a class="resource-card${reducedMotion ? '' : ' card-in'}" style="--delay:${index * 75}ms" href="${url}" data-drive-url="${url}" data-title="${title}" aria-label="Preview ${title} from Google Drive">
      <span class="portal-orbit orbit-one"></span><span class="portal-orbit orbit-two"></span>
      <div class="card-topline"><span class="card-icon">${icon}</span><span class="drive-badge"><i></i> Google Drive</span></div>
      <div class="card-content"><span class="folder-count">Folder 0${index + 1}</span><h3>${title}</h3><p>${description}</p></div>
      <div class="card-footer"><span>${action}</span><b aria-hidden="true">→</b></div>
    </a>`).join('') : '<div class="resource-card"><div><h3>No matches yet</h3><p>Try another topic, subject, or year.</p></div></div>';
}
document.querySelectorAll('.year-tab').forEach(tab => tab.addEventListener('click', () => {
  selected = tab.dataset.year;
  document.querySelectorAll('.year-tab').forEach(item => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', item === tab); });
  search.value = ''; render();
}));
search.addEventListener('input', event => render(event.target.value));
const drivePreview = document.querySelector('#drivePreview');
const previewFrame = document.querySelector('#previewFrame');
const previewTitle = document.querySelector('#previewTitle');
const openDrive = document.querySelector('#openDrive');
function embeddedDriveUrl(url) {
  const folderId = new URL(url).pathname.split('/').pop();
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
}
grid.addEventListener('click', event => {
  const card = event.target.closest('.resource-card');
  if (!card) return;
  event.preventDefault();
  const url = card.dataset.driveUrl;
  previewTitle.textContent = card.dataset.title;
  previewFrame.src = embeddedDriveUrl(url);
  openDrive.href = url;
  drivePreview.showModal();
});
document.querySelector('#previewClose').addEventListener('click', () => drivePreview.close());
drivePreview.addEventListener('click', event => { if (event.target === drivePreview) drivePreview.close(); });
drivePreview.addEventListener('close', () => { previewFrame.src = ''; });
if (!reducedMotion) {
  document.body.classList.add('motion-ready');
  const intro = [document.querySelector('.nav'), ...document.querySelectorAll('.hero > *')];
  requestAnimationFrame(() => intro.forEach((element, index) => setTimeout(() => element.classList.add('animate-in'), 80 + index * 105)));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('animate-in'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.library-section, .about, footer').forEach(element => revealObserver.observe(element));

  grid.addEventListener('pointermove', event => {
    const card = event.target.closest('.resource-card');
    if (!card || window.matchMedia('(pointer: coarse)').matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.transform = `perspective(700px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-4px)`;
  });
  grid.addEventListener('pointerout', event => {
    const card = event.target.closest('.resource-card');
    if (card && !card.contains(event.relatedTarget)) card.style.transform = '';
  });

}
render();
