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

function getPriceFromText(textPrice) {
    return Number(textPrice.slice(1).trim());
}

function getCurrency(textPrice) {
    currencyMatch = {
        '₽': 'RUB',
        '$': 'USD',
        '€': 'EUR'
    }
    return currencyMatch[textPrice[0]];
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
    result.tags = {
        category: [],
        discount: [],
        label: []
    }
    document.querySelectorAll('.product .tags span').forEach((tag) => {
        if (tag.classList.contains('green')) {
            result.tags.category.push(tag.textContent.trim())
        } else if (tag.classList.contains('blue')) {
            result.tags.label.push(tag.textContent.trim())
        } else if (tag.classList.contains('red')) {
            result.tags.discount.push(tag.textContent.trim())
        }
    });

    const priceElement = document.querySelector('.product .price');
    const clone = priceElement.cloneNode(true);
    clone.querySelector('span')?.remove();
    const priceText = clone.textContent.trim();
    const oldPriceText = priceElement.querySelector('span')?.textContent.trim();

    result.price = getPriceFromText(priceText);
    
    if (oldPriceText) {
        result.oldPrice = getPriceFromText(oldPriceText)
        result.discount = result.oldPrice - result.price;
        result.discountPercent =((result.discount / result.oldPrice) *100).toFixed(2) + '%';
    } else {
        result.oldPrice = null;
        result.discount = 0;
        result.discountPercent = '0%';
    }
    
    currency = getCurrency(priceText);

    result.properties = {};
    document.querySelectorAll('.product .properties li').forEach((li) => {
        const spans = li.querySelectorAll('span');
        const key = spans[0].textContent.trim();
        const value = spans[1].textContent.trim();
        result.properties[key] = value;
    });

    const descriptionElement = document.querySelector('.product .description');
    const descriptionClone = descriptionElement.cloneNode(true);
    descriptionClone.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
            el.removeAttribute(attr.name);
        });
    });
    result.desription = descriptionClone.innerHTML.trim();
    return result;
}

function parse_suggested() {
    let result = [];
    document.querySelectorAll('.suggested article').forEach((item) => {
        const itemDescription = {
            'name': item.querySelector('h3').textContent.trim(),
            'description': item.querySelector('p').textContent.trim(),
            'image': item.querySelector('img').src,
            'price': getPriceFromText(item.querySelector('b').textContent.trim()),
            'currency': getCurrency(item.querySelector('b').textContent.trim())
        }
        result.push(itemDescription);
    })
    
    return result;
}


function parsePage() {
    return {
        meta: parse_meta(),
        product: parse_product(),
        suggested: parse_suggested(),
        reviews: []
    };
}

window.parsePage = parsePage;