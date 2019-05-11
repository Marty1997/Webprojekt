/// <reference types="Cypress" />

context('Register Club', () => {
    beforeEach(() => {
        // Start on front page
        cy.visit('localhost:4200');
    })

    it('Register Club With Required Info', () => {
        // Open the club registration
        cy.get('.frontPageButton').contains('Register').click();
        cy.get('#clubRegistration').click();

        // Fill out required info page
        cy.get('#clubEmail').type('cypressClub@cypress');
        cy.get('#clubPassword').type('validPassword');
        cy.get('#clubName').type('Cypress Club');
        cy.get('#clubLeague').then(($select) => {
            $select.val('First League');
        });
        cy.get('#clubLeague').should('have.value', 'First League').click();
        cy.get('mat-option').contains('First League').click();
        cy.get('#clubAddress').type('Cypress Hill');
        cy.get('#clubStreetNumber').type('10');
        cy.get('#clubCountry').then(($select) => {
            $select.val('Sweden');
        });
        cy.get('#clubCountry').should('have.value', 'Sweden').click();
        cy.get('mat-option').contains('Sweden').click();
        cy.get('#clubCity').type('Aalborg');
        cy.get('#clubZipcode').type('9000');

        // Navigate to register club and click it
        cy.get('.firstNextBtn').contains('Next').click();
        cy.get('.nextBtn').contains('Next').click();
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Next').click({force: true});
        cy.get('.nextBtn').contains('Register').click({force: true});
    })
})