const API_KEY = 'public_W23MT3P6GELTr7r1BpMirXPMwXW6'; // استبدل بمفتاح API الخاص بك

// عناصر DOM
const uploadBtn = document.getElementById('uploadBtn');
const linksContainer = document.getElementById('linksContainer');
const copyLinksBtn = document.getElementById('copyLinksBtn');
const clearLinksBtn = document.getElementById('clearLinksBtn');
const downloadLinksBtn = document.getElementById('downloadLinksBtn');
const toast = document.getElementById('toast');

// تهيئة Upload Widget
const options = {
    apiKey: API_KEY, // مفتاح API الخاص بك
    maxFileCount: 50, // الحد الأقصى لعدد الملفات
};

// فتح Upload Widget عند النقر على زر الرفع
uploadBtn.addEventListener('click', () => {
    Bytescale.UploadWidget.open(options).then(
        files => {
            const fileUrls = files.map(x => x.fileUrl);
            fileUrls.forEach(url => {
                linksContainer.innerHTML += `<a href="${url}" target="_blank">${url}</a>`;
            });

            if (fileUrls.length > 0) {
                copyLinksBtn.style.display = 'inline-block';
                clearLinksBtn.style.display = 'inline-block';
                downloadLinksBtn.style.display = 'inline-block';
            }
        },
        error => {
            showToast('حدث خطأ أثناء الرفع: ' + error.message);
        }
    );
});

// نسخ جميع الروابط
copyLinksBtn.addEventListener('click', () => {
    const links = Array.from(document.querySelectorAll('#linksContainer a')).map(a => a.href);
    navigator.clipboard.writeText(links.join('\n'))
        .then(() => showToast('تم نسخ الروابط بنجاح!'))
        .catch(() => showToast('فشل نسخ الروابط.'));
});

// مسح جميع الروابط
clearLinksBtn.addEventListener('click', () => {
    linksContainer.innerHTML = '';
    clearLinksBtn.style.display = 'none';
    copyLinksBtn.style.display = 'none';
    downloadLinksBtn.style.display = 'none';
    showToast('تم مسح جميع الروابط.');
});

// تنزيل جميع الروابط
downloadLinksBtn.addEventListener('click', () => {
    const links = Array.from(document.querySelectorAll('#linksContainer a')).map(a => a.href);
    const defaultName = "روابط_الملفات"; // الاسم الافتراضي للملف

    // نافذة منبثقة لطلب اسم الملف من المستخدم
    const fileName = prompt('الرجاء إدخال اسم الملف:', defaultName);

    if (fileName) { // إذا أدخل المستخدم اسمًا
        const blob = new Blob([links.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.txt`; // إضافة الامتداد .txt تلقائيًا
        a.click();
        URL.revokeObjectURL(url);
        showToast('تم تنزيل الروابط بنجاح!');
    } else {
        showToast('تم إلغاء عملية التنزيل.');
    }
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
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
