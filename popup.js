// html load
document.addEventListener('DOMContentLoaded', function() {
    // set FirstLanguage
    chrome.storage.local.get('FirstLanguage', function(data) {
        if (data.FirstLanguage !== undefined) {
            document.getElementById('FirstLanguage').value = data.FirstLanguage;
        } else {
            FirstLanguage = 'zh-CN';
            chrome.storage.local.set({ 'FirstLanguage': FirstLanguage });
            document.getElementById('FirstLanguage').value = FirstLanguage;
        }
    });
    // SecondLanguage
    chrome.storage.local.get('SecondLanguage', function(data) {
        if (data.SecondLanguage !== undefined) {
            document.getElementById('SecondLanguage').value = data.SecondLanguage;
        } else {
            SecondLanguage = 'en';
            chrome.storage.local.set({ 'SecondLanguage': SecondLanguage });
            document.getElementById('SecondLanguage').value = SecondLanguage;
        }
    }); 
});

// FirstLanguage
document.getElementById('FirstLanguage').addEventListener('change', function() {
    var FirstLanguage = this.value;
    chrome.storage.local.set({ 'FirstLanguage': FirstLanguage });
    console.log('Automatically FirstLanguage: ' + FirstLanguage);
});

// SecondLanguage
document.getElementById('SecondLanguage').addEventListener('change', function() {
    var SecondLanguage = this.value;
    chrome.storage.local.set({ 'SecondLanguage': SecondLanguage });
    console.log('Automatically SecondLanguage: ' + SecondLanguage);
}); 