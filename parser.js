// @todo: напишите здесь код парсера
function parse_meta() {
    let result = {};
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

function parse_product() {
    let result = {};
    result.id = document.querySelector('body div').id;
    const images = [... document.querySelectorAll('.product .preview nav img')]
    const disabled_images = images.filter((img) => img.closest('button').hasAttribute('disabled'));
    const rest_images = images.filter((img) => !img.closest('button').hasAttribute('disabled'));
    result.images = [...disabled_images, ...rest_images].map((img) => ({
        preview: img.scroll,
        full: img.dataset.src,
        alt: img.alt,
    }));
    result.isLiked = document.querySelector('.like').classList.contains('active');
    result.name = document.querySelector('h1').textContent;
    return result;

}

function parsePage() {
    return {
        meta: parse_meta(),
        product: parse_product(),
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;