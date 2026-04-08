package com.handloom.service;

import com.handloom.exception.ResourceNotFoundException;
import com.handloom.model.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCart() {
        User user = getCurrentUser();
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = Cart.builder().user(user).build();
            return cartRepository.save(c);
        });
    }

    public Cart addToCart(Long productId, Integer quantity) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
        cart.getCartItems().stream().filter(i -> i.getProduct().getId().equals(productId)).findFirst()
                .ifPresentOrElse(i -> i.setQuantity(i.getQuantity() + quantity),
                        () -> cart.getCartItems().add(CartItem.builder().cart(cart).product(product).quantity(quantity).build()));
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Long productId, Integer quantity) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        if (quantity <= 0) {
            cart.getCartItems().removeIf(i -> i.getProduct().getId().equals(productId));
        } else {
            cart.getCartItems().stream().filter(i -> i.getProduct().getId().equals(productId))
                    .findFirst().ifPresent(i -> i.setQuantity(quantity));
        }
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long productId) { return updateCartItem(productId, 0); }

    public void clearCart() {
        User user = getCurrentUser();
        cartRepository.findByUser(user).ifPresent(c -> { c.getCartItems().clear(); cartRepository.save(c); });
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
