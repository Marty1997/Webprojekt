/// <reference types="Cypress" />

context('Register Player', () => {
    beforeEach(() => {
        // Stub the register request
        cy.server();
        cy.route('POST', 'https://localhost:44310/api/Player', 200);
        cy.route('POST', 'WEB API controller metode', 404);
        // Start on front page
        cy.visit('localhost:4200');
    })

    it('Register Player With Required Info and Measurements', () => {
        // Open the player registration
        cy.get('.frontPageButton').contains('Register').click();
        cy.get('#playerRegistration').click();

        // Fill out required info page
        cy.get('#playerEmail').type('cypress@cypress');
        cy.get('#playerPassword').type('validPassword');
        cy.get('#playerFirstName').type('Jon');
        cy.get('#playerLastName').type('Doe');
        cy.get('#playerCountry').then(($select) => {
            $select.val('Denmark');
        })
        cy.get('#playerCountry').should('have.value', 'Denmark').click();
        cy.get('mat-option').contains('Denmark').click();
        cy.get('#playerDay').type('24');
        cy.get('#playerMonth').then(($select) => {
            $select.val('07');
        })
        cy.get('#playerMonth').should('have.value', '07').click();
        cy.get('mat-option').contains('July').click();
        cy.get('#playerYear').type('1995');

        // Hit the next button
        cy.get('.firstNextBtn').contains('Next').click();

        // Fill measurements
        cy.get('#playerHeight').type('192');
        cy.get('#playerWeight').type('90');
        cy.get('#playerBodyfat').type('12');

        // Navigate to register button and click it
        cy.get('.nextBtn').contains('Next').click();
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Register').click({force: true});
    })
})