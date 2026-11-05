Feature: Add to Cart
  As a user
  I want to add products to cart
  So that I can purchase them

  @cloudflare
  Scenario: Add product to cart
    Given I am on a product detail page
    When I add the product to cart
    Then the cart should be updated

  @cloudflare
  Scenario: View cart
    Given I have added a product to cart
    When I view the cart
    Then I should see the product in the cart
