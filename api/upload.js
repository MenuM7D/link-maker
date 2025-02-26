const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة غير مسموحة. استخدم POST.' });
    }

    try {
        const file = req.files?.file; // الملف المرسل من المتصفح
        if (!file) {
            return res.status(400).json({ error: 'لم يتم رفع أي ملف.' });
        }

        const form = new FormData();
        form.append('fileToUpload', file.data, file.name);
        form.append('reqtype', 'fileupload');

        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        const link = response.data;
        if (link.startsWith('https://')) {
            res.status(200).json({ link });
        } else {
            throw new Error('حدث خطأ أثناء الرفع: ' + link);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
