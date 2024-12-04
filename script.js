
// script.js
const API_URL = 'https://api.imgbb.com/1/upload';
const API_KEY = '2cec769c472e139124ffbf8154af63a1'; // استخدم مفتاح API الخاص بك

// دالة لرفع الصور وتحويلها
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const files = event.target.files;
    if (files.length > 50) {
        alert('يرجى رفع 50 صورة فقط في نفس الوقت.');
        return;
    }

    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = ''; // مسح الروابط السابقة

    // عرض رسالة جاري التحميل
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // عرض الرسالة

    const links = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
            alert('الرجاء رفع صور فقط.');
            continue;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', API_KEY);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                const imageLink = data.data.url;
                
                // إضافة الرابط إلى المصفوفة
                links.push(imageLink);
            } else {
                const errorElement = document.createElement('p');
                errorElement.innerHTML = `- حدث خطأ أثناء رفع الصورة ${i + 1}`;
                linksContainer.appendChild(errorElement);
            }
        } catch (error) {
            const errorElement = document.createElement('p');
            errorElement.innerHTML = `- حدث خطأ أثناء الاتصال بالخادم.`;
            linksContainer.appendChild(errorElement);
        }
    }

    // بعد الانتهاء من رفع كل الصور، عرض الروابط
    links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.target = "_blank"; // فتح الرابط في نافذة جديدة
        linkElement.textContent = link;
        linksContainer.appendChild(linkElement);
    });

    // إخفاء رسالة جاري التحميل بعد انتهاء عملية التحويل
    loadingMessage.style.display = 'none';

    // إظهار زر نسخ الروابط
    if (links.length > 0) {
        document.getElementById('copyLinksBtn').style.display = 'inline-block';
    }
});

// دالة لنسخ الروابط
document.getElementById('copyLinksBtn').addEventListener('click', () => {
    const linksContainer = document.getElementById('linksContainer');
    const links = Array.from(linksContainer.getElementsByTagName('a')).map(link => link.href).join('\n');
    
    // نسخ الروابط إلى الحافظة
    navigator.clipboard.writeText(links).then(() => {
        alert('تم نسخ جميع الروابط!');
    }).catch(err => {
        console.error('فشل في نسخ الروابط:', err);
    });
});