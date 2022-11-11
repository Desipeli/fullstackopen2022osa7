describe('Blog app ', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Pekka',
      username: 'peruna',
      password: '1234'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Log in')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('fails with invalid username and password', function () {
      cy.get('#username-input').type('porkkana')
      cy.get('#password-input').type('4321')
      cy.get('#login-button').click()
      cy.contains('invalid username or password')
    })

    it('fails with wrong password AND notification is red', function () {
      cy.get('#username-input').type('peruna')
      cy.get('#password-input').type('1235')
      cy.get('#login-button').click()
      cy.contains('invalid username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      )
    })

    it('succeeds with correct credentials', function () {
      cy.get('#username-input').type('peruna')
      cy.get('#password-input').type('1234')
      cy.get('#login-button').click()
      cy.contains('peruna logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username-input').type('peruna')
      cy.get('#password-input').type('1234')
      cy.get('#login-button').click()
      cy.contains('peruna logged in')
    })

    it('A blog can be created and liked', function () {
      cy.contains('show blog form').click()
      cy.get('#title-input').type('The Title')
      cy.get('#author-input').type('The Author')
      cy.get('#url-input').type('URL')
      cy.get('#create-blog-button').click()

      cy.contains('a new blog The Title by The Author added')
      cy.get('.blog-first-row').contains('The Title The Author').click()
      cy.get('.blog-first-row')
        .contains('The Title The Author')
        .parent()
        .find('.like-button')
        .click()
        .click()
      cy.contains('2')
    })

    describe('When blog is created', function () {
      beforeEach(function () {
        const blog = {
          title: 'Titteli',
          author: 'Autori',
          url: 'urli'
        }
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: blog,
          headers: {
            Authorization: `bearer ${
              JSON.parse(localStorage.getItem('loggedUser')).token
            }`
          }
        })
        cy.visit('http://localhost:3000')
      })

      it('blog can be removed by creator', function () {
        cy.get('.blog-first-row').contains('Titteli Autori').click()
        cy.get('.blog-first-row')
          .contains('Titteli Autori')
          .parent()
          .find('.remove-button')
          .click()

        cy.contains('Removed Titteli Autori')
        cy.get('.blog').should('not.exist')
      })

      it.only('blog cannot be removed by other users', function () {
        const user = {
          name: 'Bob',
          username: 'bataatti',
          password: '4321'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)

        cy.contains('log out').click()
        cy.get('#username-input').type('bataatti')
        cy.get('#password-input').type('4321')
        cy.get('#login-button').click()
        cy.contains('bataatti logged in')

        cy.get('.blog-first-row').contains('Titteli Autori').click()
        cy.get('.blog-first-row')
          .contains('Titteli Autori')
          .parent()
          .find('.remove-button')
          .should('not.exist')
      })
    })
  })
})
