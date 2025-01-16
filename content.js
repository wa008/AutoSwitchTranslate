function is_zhCN(str) {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const chineseMatches = str.match(chineseRegex);
    if (!chineseMatches) {
        return false;
    }
    const chineseCount = chineseMatches.length;
    const totalCount = str.length;
    let chineseRate = chineseCount / totalCount;
    if (totalCount >= 1 && chineseRate > 0.7) return true;
    if (totalCount >= 4 && chineseRate > 0.6) return true;
    if (totalCount >= 20 && chineseRate > 0.5) return true;
    return false;
}

function is_en(str) {
    const specialCount = str.split("'").length - 1;
    // doesn't work for wei'she'me'yi'ding'yao
    const letterCount = str.replace(/[^a-zA-Z]/g, '').length;
    const spaceCount = str.split(' ').length - 1;
    const total = str.length;
    const validCount = letterCount + spaceCount;
    const rate = (validCount * 100) / total;
    
    if (total >= 2 && rate > 0.7) return true;
    if (total >= 10 && rate > 0.6) return true;
    if (total >= 50 && rate > 0.5) return true;
    return false;
}

async function trigerClick(selectedlanguage, content, button) {
    if (selectedlanguage === "en") {
        if (is_en(content)) {
            button.click();
        }
    } else if (selectedlanguage === "zh-CN") {
        if (is_zhCN(content)) {
            button.click();
        }
    } else {
        console.log("doesn't support lanuage: ", selectedlanguage);
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
    const selectedlanguage = selectedButton.getAttribute('data-language-code');
    console.log("content: ", content);
    // console.log("selectedlanguage: ", selectedlanguage);

    (async() => {
        var FirstLanguage = await readLocalStorage('FirstLanguage', 'default');
        var SecondLanguage = await readLocalStorage('SecondLanguage', 'default');
        // console.log('FirstLanguage: ', FirstLanguage);
        // console.log('SecondLanguage: ', SecondLanguage);
        if (selectedlanguage === FirstLanguage) {
            const button = targetBar.querySelector('button[data-language-code="' + SecondLanguage + '"]');
            await trigerClick(selectedlanguage, content, button);
        } else if (selectedlanguage === SecondLanguage) {
            res = 'button[data-language-code="' + FirstLanguage + '"]';
            // console.log('res: ', res);
            const button = targetBar.querySelector(res);
            await trigerClick(selectedlanguage, content, button);
        }
    })();
}

// triget when text changes
document.querySelector('textarea[aria-label="Source text"]').addEventListener('input', function (event) {
    content = event.target.value;
    // console.log('content: ', content);
    mainFunciton(content);
});

// triger when open websites
mainFunciton(document.querySelector('textarea[aria-label="Source text"]').value)