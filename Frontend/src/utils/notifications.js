import { toast } from "sonner";

// Custom notification utilities for enhanced user experience
export const notifications = {
  success: (title, description = "", options = {}) => {
    return toast.success(title, {
      description,
      duration: 4000,
      className: "toast-custom",
      ...options
    });
  },

  error: (title, description = "", options = {}) => {
    return toast.error(title, {
      description,
      duration: 5000,
      className: "toast-custom",
      ...options
    });
  },

  info: (title, description = "", options = {}) => {
    return toast.info(title, {
      description,
      duration: 4000,
      className: "toast-custom",
      ...options
    });
  },

  warning: (title, description = "", options = {}) => {
    return toast.warning(title, {
      description,
      duration: 4000,
      className: "toast-custom",
      ...options
    });
  },

  // Special notification types for e-commerce actions
  addedToCart: (productName, quantity = 1, size, color) => {
    return notifications.success(
      "Added to Cart!",
      `${quantity} ${quantity === 1 ? 'item' : 'items'} of ${productName} (${size}, ${color}) added to your cart.`,
      {
        action: {
          label: "View Cart",
          onClick: () => {
            // This can be handled by the component using this utility
            console.log("View cart clicked");
          }
        }
      }
    );
  },

  removedFromCart: (productName) => {
    return notifications.info(
      "Removed from Cart",
      `${productName} has been removed from your cart.`
    );
  },

  orderPlaced: (orderNumber) => {
    return notifications.success(
      "Order Placed Successfully!",
      `Your order #${orderNumber} has been confirmed and is being processed.`,
      {
        duration: 6000
      }
    );
  },

  loginSuccess: (userName) => {
    return notifications.success(
      "Welcome back!",
      `Hi ${userName}, you've successfully logged in.`
    );
  },

  logoutSuccess: () => {
    return notifications.success(
      "Logged out successfully",
      "You have been safely logged out of your account."
    );
  },

  registrationSuccess: (userName) => {
    return notifications.success(
      "Account Created!",
      `Welcome ${userName}! Your account has been created successfully.`
    );
  },

  formValidationError: (missingFields = []) => {
    const fieldsList = missingFields.length > 0 
      ? `Missing: ${missingFields.join(', ')}`
      : "Please check all required fields.";
    
    return notifications.error(
      "Please fill in all required fields",
      fieldsList
    );
  },

  networkError: () => {
    return notifications.error(
      "Connection Error",
      "Please check your internet connection and try again.",
      {
        duration: 6000
      }
    );
  },

  saveSuccess: (itemType = "item") => {
    return notifications.success(
      "Saved Successfully",
      `Your ${itemType} has been saved.`
    );
  },

  deleteSuccess: (itemType = "item", itemName = "") => {
    const description = itemName 
      ? `${itemName} has been deleted successfully.`
      : `The ${itemType} has been deleted successfully.`;
    
    return notifications.success(
      "Deleted Successfully",
      description
    );
  }
};

export default notifications;
