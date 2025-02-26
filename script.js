// script.js
const API_URL = 'https://api.imgbb.com/1/upload';
const API_KEY = '2cec769c472e139124ffbf8154af63a1'; // استخدم مفتاح API الخاص بك

// عناصر DOM
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const linksContainer = document.getElementById('linksContainer');
const copyLinksBtn = document.getElementById('copyLinksBtn');
const toast = document.getElementById('toast');

// النقر على منطقة السحب والإفلات لفتح نافذة اختيار الملفات
dropArea.addEventListener('click', () => {
    fileInput.click();
});

// سحب وإفلات الصور
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#0056b3';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#007bff';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#007bff';
    fileInput.files = e.dataTransfer.files;
    handleFiles(fileInput.files);
});

// اختيار الصور
fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

// تحميل الصور
async function handleFiles(files) {
    if (files.length > 50) {
        showToast('يرجى رفع 50 صورة فقط في نفس الوقت.');
        return;
    }

    linksContainer.innerHTML = '';
    progressBar.style.display = 'block';
    progress.style.width = '0%';

    const links = [];
    let uploadedCount = 0;

    for (let file of files) {
        if (!file.type.startsWith('image/')) {
            showToast('الرجاء رفع صور فقط.');
            continue;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', API_KEY);

        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                links.push(data.data.url);
            }
        } catch {
            showToast('حدث خطأ أثناء الاتصال بالخادم.');
        }

        uploadedCount++;
        progress.style.width = `${(uploadedCount / files.length) * 100}%`;
    }

    links.forEach(link => {
        linksContainer.innerHTML += `<a href="${link}" target="_blank">${link}</a>`;
    });

    progressBar.style.display = 'none';
    if (links.length > 0) copyLinksBtn.style.display = 'inline-block';
}

// نسخ جميع الروابط
copyLinksBtn.addEventListener('click', () => {
    const links = Array.from(document.querySelectorAll('#linksContainer a')).map(a => a.href);
    navigator.clipboard.writeText(links.join('\n'))
        .then(() => showToast('تم نسخ الروابط بنجاح!'))
        .catch(() => showToast('فشل نسخ الروابط.'));
});

// تبديل الوضع
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
}

// إظهار إشعارات
function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
