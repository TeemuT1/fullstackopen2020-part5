describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Super User',
      username: 'superuser',
      password: 'super'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('superuser')
      cy.get('#password').type('super')
      cy.get('#login-button').click()

      cy.contains('Super User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('superuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
      cy.get('.error').should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'superuser', password: 'super' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('www.newblog.com')
      cy.get('#create-blog-button').click()
      cy.contains('A new blog')
      cy.contains('Test Author')
    })



    describe('and a blog exists', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'First blog', author: 'Test Author', url: 'www.firstblog.com', likes: 1 })
        cy.createBlog({ title: 'Second blog', author: 'Test Author', url: 'www.secondblog.com', likes: 3 })
        cy.createBlog({ title: 'Third blog', author: 'Test Author', url: 'www.thirdblog.com', likes: 2 })
      })

      it('User can like a blog', function() {
        cy.contains('view').click()
        cy.contains('likes 3')
        cy.contains('like').click()
        cy.contains('likes 4')
      })

      it('User can delete a blog', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('Removed Second blog by Test Author')
        cy.contains('www.secondblog.com').should('not.exist')
      })

      it('Blogs are ordered by the number of likes', function() {
        cy.contains('view').click()
        cy.contains('view').click()
        cy.contains('view').click()
        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).should('contain', 'likes 3')
          cy.wrap(blogs[1]).should('contain', 'likes 2')
          cy.wrap(blogs[2]).should('contain', 'likes 1')
        })

        cy.contains('Third blog').parent().find('.like-button').as('thirdBlogLikeButton')

        cy.get('@thirdBlogLikeButton').click()
        cy.contains('Third blog').parent().should('contain', 'likes 3')
        cy.get('@thirdBlogLikeButton').click()
        cy.contains('Third blog').parent().should('contain', 'likes 4')

        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).should('contain', 'likes 4')
          cy.wrap(blogs[1]).should('contain', 'likes 3')
          cy.wrap(blogs[2]).should('contain', 'likes 1')
        })
      })
    })
  })

})