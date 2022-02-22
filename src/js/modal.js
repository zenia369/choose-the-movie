export default class ActiveModal {

    createHTMLForModal({title, html}) {
        const body = `
            <div class="modal-dialog modal-xl">
                    <div class="modal-content modal-background">
                    <div class="modal-header">
                        <h5 id="search-title" class="modal-title h4 textColor" id="exampleModalXlLabel">${title}</h5>
                        <button id="search-close" type="button" class="btn-close textColor" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row content__list d-flex flex-wrap" id="search__list">
                                ${html}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        return body
    }

    createEmojiCard(data) {
        return data.map(el => {
            return `
            <div class="col-3 d-flex content__list__item">
                <span class="emoji" data-id=${el.id}>
                    ${el.emoji}
                </span>
            </div>
            `
        }).join(' ')
    }

}