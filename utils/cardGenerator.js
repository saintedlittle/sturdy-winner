function replaceHtmlContent(newText, onlineCount, description, serverTag) {
    try {
        const { JSDOM } = require('jsdom');
        const htmlTemplate = `
            <div class="col mb-4">
                <div>
                    <a href="#">
                        <img class="rounded img-fluid shadow w-100 fit-cover" src="/img/products/1.jpg" style="height: 250px;">
                    </a>
                    <div class="py-4">
                        <span class="badge bg-primary mb-2">S1</span>
                        <span class="badge bg-success mb-2 text-bg-success">Онлайн: 300</span>
                        <h4 class="fw-bold">Сервер 1</h4>
                        <p class="text-muted">Основной и первый сервер.</p>
                    </div>
                </div>
            </div>
        `;

        const dom = new JSDOM(htmlTemplate);
        const document = dom.window.document;

        const py4Div = document.querySelector('.py-4');
        if (py4Div) {
            const h4Element = py4Div.querySelector('.fw-bold');
            if (h4Element) {
                h4Element.textContent = newText;
            }

            const onlineSpan = py4Div.querySelector('span.badge.bg-success.mb-2.text-bg-success');
            if (onlineSpan) {
                if (onlineCount <= 0) {
                    onlineSpan.textContent = 'Отключён';
                    onlineSpan.classList.remove('bg-success', 'text-bg-success');
                    onlineSpan.classList.add('bg-danger', 'text-bg-danger');
                } else {
                    onlineSpan.textContent = `Онлайн: ${onlineCount}`;
                }
            }

            const textMuted = py4Div.querySelector('p.text-muted');
            if (textMuted) {
                textMuted.textContent = description;
            }

            const badgePrimary = py4Div.querySelector('span.badge.bg-primary.mb-2');
            if (badgePrimary) {
                badgePrimary.textContent = serverTag;
            }
        }

        return dom.serialize();
    } catch (error) {
        console.error('Error occurred while replacing HTML content:', error);
        return '';
    }
}

module.exports = replaceHtmlContent;
