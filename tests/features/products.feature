Feature: Product Search
  As a user
  I want to search for products
  So that I can find what I need

  @cloudflare
  Scenario: Search for a product
    Given I am on the products page
    When I search for "hammer"
    Then I should see products matching "hammer"

  @cloudflare
  Scenario: Filter products by category
    Given I am on the products page
    When I filter by category "Power Tools"
    Then I should see products in that category
