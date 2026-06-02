// @todo: напишите здесь код парсера
function parse_meta() {
    const result = {};
    result.language = document.querySelector('html').lang;
    result.head = document.querySelector('head title').textContent.split('—')[0].trim();
    result.keywords = document.querySelector('meta[name="keywords"]')
        .content
        .split(',')
        .map((s) => s.trim());
    result.description = document.querySelector('meta[name="description"]').content;
    result.opengraph = {};
    document.querySelectorAll('meta[property^="og:"]')
        .forEach((el) => {
            const key = el.getAttribute('property').replace('og:', '');
            let value = el.content;
            if (key === 'title') {
                value = value.split('—')[0].trim();
            }
            result.opengraph[key] = value;
        })
    
    return result;
}

function parsePage() {
    return {
        meta: parse_meta(),
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;