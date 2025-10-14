function is_zhCN(str) {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const chineseMatches = str.match(chineseRegex);
    if (!chineseMatches) {
        return false;
    }
    const chineseCount = chineseMatches.length;
    const totalCount = str.length;
    if (totalCount === 0) return false;
    let chineseRate = chineseCount / totalCount;
    if (totalCount >= 1 && chineseRate > 0.7) return true;
    if (totalCount >= 4 && chineseRate > 0.6) return true;
    if (totalCount >= 20 && chineseRate > 0.5) return true;
    return false;
}

function is_en(str) {
    // work for wei'she'me'yi'ding'yao
    const re = /[A-Za-z]+(?:'[A-Za-z]+)+/g;
    const matches = str.match(re) || [];
    const specialCount = matches.reduce((acc, m) => acc + m.replace(/'/g, '').length, 0);

    const letterCount = str.replace(/[^a-zA-Z]/g, '').length - specialCount;
    const spaceCount = str.split(' ').length - 1;
    const total = str.length;
    if (total === 0) return false;
    const validCount = letterCount + spaceCount;
    const rate = (validCount * 1.0) / total;
    
    // console.log("specialCount: " + specialCount); // 9
    // console.log("letterCount: total " + letterCount);
    // console.log("is_en: total " + total);
    // console.log("is_en: rate " + rate);
    if (total >= 2 && rate > 0.7) return true;
    if (total >= 10 && rate > 0.6) return true;
    if (total >= 50 && rate > 0.5) return true;
    return false;
}

function is_ru(str) {
    // remove space
    const cleanStr = str.replace(/\s+/g, '');

    // ru string
    const cyrillicRegex = /[\u0400-\u052F]/g;
    const matches = cleanStr.match(cyrillicRegex);
    const cyrillicCount = matches ? matches.length : 0;

    const total = cleanStr.length;
    if (total === 0) return false;
    const rate = (cyrillicCount * 1.0) / total;
    if (total >= 10 && rate > 0.6) return true;
    if (total >= 50 && rate > 0.5) return true;
    if (total >= 50 && rate > 0.5) return true;
    return false;
}

async function trigerClick(currentTargetLanguage, content, button) {
    if (currentTargetLanguage === "en") {
        if (is_en(content)) {
            console.log("Switch from en");
            button.click();
        }
    } else if (currentTargetLanguage === "zh-CN") {
        if (is_zhCN(content)) {
            console.log("Switch from zh-CH");
            button.click();
        }
    } else if (currentTargetLanguage === "ru") {
        if (is_ru(content)) {
            console.log("Switch from ru");
            button.click();
        }
    } else {
        console.log("doesn't support lanuage: ", currentTargetLanguage);
    }
}

// read local parameter
const readLocalStorage = async (key, default_value = undefined) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key] === undefined) {
                resolve(default_value);
            } else {
                resolve(result[key]);
            }
        });
    });
};

// main function
function mainFunciton(content) {
    const targetBar = document.getElementsByClassName('akczyd')[1];
    const selectedButton = targetBar.querySelector('button[aria-selected=true]');
    const currentTargetLanguage = selectedButton.getAttribute('data-language-code');
    console.log("content: ", content);
    // console.log("currentTargetLanguage: ", currentTargetLanguage);

    (async() => {
        var FirstLanguage = await readLocalStorage('FirstLanguage', 'default');
        var SecondLanguage = await readLocalStorage('SecondLanguage', 'default');
        console.log('FirstLanguage: ', FirstLanguage);
        console.log('SecondLanguage: ', SecondLanguage);
        console.log("currentTargetLanguage: " + currentTargetLanguage);
        if (currentTargetLanguage === FirstLanguage) {
            console.log('target-language-code: ', SecondLanguage);
            // const button = targetBar.querySelector('button[data-language-code="' + SecondLanguage + '"]');
            language_code = 'button[data-language-code="' + SecondLanguage + '"]';
            console.log("language_code: " + language_code);
            const button = targetBar.querySelector(language_code);
            console.log("button: " + button);
            await trigerClick(currentTargetLanguage, content, button);
        } else if (currentTargetLanguage === SecondLanguage) {
            console.log('target-language-code: ', FirstLanguage);
            // const button = targetBar.querySelector('button[data-language-code="' + FirstLanguage + '"]');
            language_code = 'button[data-language-code="' + FirstLanguage + '"]';
            console.log("language_code: " + language_code);
            const button = targetBar.querySelector(language_code);
            console.log("button: " + button);
            await trigerClick(currentTargetLanguage, content, button);
        } else {
            console.log(currentTargetLanguage + " not in first or second language");
        }
    })();
}

// triget when text changes
// [aria-label="Source text"]
document.querySelector('textarea[class="er8xn"]').addEventListener('input', function (event) {
    content = event.target.value;
    mainFunciton(content);
});

// triger when open websites
mainFunciton(document.querySelector('textarea[class="er8xn"]').value)