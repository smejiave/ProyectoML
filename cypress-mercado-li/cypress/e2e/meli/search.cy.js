describe('MercadoLibre App', () => {
    beforeEach(() => {
        cy.visit('https://www.mercadolibre.com')
        cy.viewport(1920, 1080)

    })

    it('search "Play station 5" and get 5 new elements sorted by price', () => {

        // get => busca el elemento en el html, si usas '.' lo buscas por clase y si usas '#' lo buscas por id, si no pones prefijo, busca todos los elementos
        // si pones prefijo, por ejemplo 'button.class' solo busca los elementos del tipo `button` que tengan la clase `class`

        cy.log('Ingreso paginaPais')

        // puedes filtrar los elementos por el texto que contienen con la función `.contains()`
        cy.get('.ml-site-link').contains('México').click()
        //cy.get('.ml-site-link').should('have.text','México')
        //cy.screenshot('mi-image-meli')

        cy.origin('https://www.mercadolibre.com.mx', () => {
            cy.get('button').contains('Aceptar cookies').click()

            cy.get('input.nav-search-input').type('play station 5')
            cy.get('button.nav-search-btn').click()
        })

        cy.origin('https://listado.mercadolibre.com.mx', () => {
            cy.get('button.onboarding-cp-button').contains('Más tarde').click()

            cy.wait(4_000)
            // aqui uso regex `/Nuevo/i` porque el texto dentro inicia con `Nuevo` pero puede tener un sufijo diferente
            cy.get('a.ui-search-link').contains(/Nuevo/i).click()

            cy.wait(4_000)
            cy.get('a.ui-search-link').contains(/Estado De México/i).click()


            cy.wait(4_000)
            cy.get('button.andes-dropdown__trigger').trigger('click').invoke('show')

            cy.wait(4_000)
            cy.get('li.andes-list__item').contains('Mayor precio').click()

            const arrayPrices = []

            // Obtiene los 5 elementos que cumplen con el filtro
            const titlesIterator = cy.get('a.poly-component__title').filter(":lt(5)")
           
            // aqui usamos el invoke show porque los elementos son hidden
            const pricesIterator = cy.get('span.andes-money-amount__fraction').filter(":lt(5)").invoke('show')

            // iteras los elementos
            pricesIterator.each((element) => arrayPrices.push(element.text()))


            cy.log('****** PRODUCTS ******')
            titlesIterator.each((element, id) => {
                cy.log(`Product ${element.text()} is $${arrayPrices[id]}`)
            })

            titlesIterator.should('have.length', 5);
            pricesIterator.should('have.length', 5);

        })




    })

})
