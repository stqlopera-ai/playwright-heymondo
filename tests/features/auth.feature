Feature: User Authentication
  As a user
  I want to be able to login
  So that I can access my account

  @cloudflare
  Scenario: Login with valid credentials
    Given I am on the login page
    When I login with valid credentials
    Then I should be redirected to the account page

  @cloudflare
  Scenario: Login with invalid credentials shows error
    Given I am on the login page
    When I login with invalid credentials
    Then I should see an error message
