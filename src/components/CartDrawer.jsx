import React, { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  CART_OPEN_EVENT,
  CART_UPDATED_EVENT,
  getCachedCartSnapshot,
  loadCartSnapshot,
  removeCartLine,
  updateCartLineQuantity,
} from '../lib/shopifyStorefrontCart';
import './CartDrawer.css';

const formatMoney = (money) => {
  if (!money) return '—';

  const amount = Number(money.amount || 0);
  const currency = money.currencyCode || 'INR';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch (_) {
    return `${money.amount} ${currency}`;
  }
};

const CartDrawer = () => {
  const cachedSnapshot = getCachedCartSnapshot();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(cachedSnapshot);
  const [loading, setLoading] = useState(!cachedSnapshot);
  const [busyLineId, setBusyLineId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleUpdate = (event) => {
      setCart(event.detail?.snapshot || null);
      setLoading(false);
      setErrorMessage('');
    };

    window.addEventListener(CART_OPEN_EVENT, handleOpen);
    window.addEventListener('satrangi-cart-close', handleClose);
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);

    loadCartSnapshot()
      .then((snapshot) => {
        if (snapshot) {
          setCart(snapshot);
        }
      })
      .catch((error) => {
        setErrorMessage(error?.message || 'Could not load cart.');
      })
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener(CART_OPEN_EVENT, handleOpen);
      window.removeEventListener('satrangi-cart-close', handleClose);
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeDrawer = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('satrangi-cart-close'));
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.assign(cart.checkoutUrl);
    }
  };

  const handleQuantity = async (lineId, nextQuantity) => {
    setBusyLineId(lineId);
    setErrorMessage('');

    try {
      const snapshot = await updateCartLineQuantity(lineId, nextQuantity);
      setCart(snapshot);
    } catch (error) {
      setErrorMessage(error?.message || 'Could not update cart.');
    } finally {
      setBusyLineId('');
    }
  };

  const handleRemove = async (lineId) => {
    setBusyLineId(lineId);
    setErrorMessage('');

    try {
      const snapshot = await removeCartLine(lineId);
      setCart(snapshot);
    } catch (error) {
      setErrorMessage(error?.message || 'Could not remove item.');
    } finally {
      setBusyLineId('');
    }
  };

  const totalQuantity = cart?.totalQuantity || 0;
  const lines = cart?.lines || [];
  const subtotal = cart?.subtotalAmount || cart?.totalAmount || null;

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <button type="button" className="cart-drawer__backdrop" onClick={closeDrawer} aria-label="Close cart" />

      <aside className="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="cart-drawer__header">
          <div>
            <p className="cart-drawer__eyebrow">YOUR CART</p>
            <h3 className="cart-drawer__title">Shopping Bag</h3>
            <p className="cart-drawer__subtitle">A clean checkout flow powered by Shopify.</p>
          </div>
          <button type="button" className="cart-drawer__close" onClick={closeDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </header>

        <div className="cart-drawer__body">
          {loading && (
            <div className="cart-drawer__empty">
              <ShoppingBag size={28} />
              <p>Loading your cart…</p>
            </div>
          )}

          {!loading && lines.length === 0 && (
            <div className="cart-drawer__empty">
              <ShoppingBag size={32} />
              <h4>Your bag is empty</h4>
              <p>Preview a look and add it to cart when you are ready.</p>
              <button type="button" className="cart-drawer__secondary" onClick={closeDrawer}>
                Continue browsing
              </button>
            </div>
          )}

          {lines.length > 0 && (
            <div className="cart-drawer__items">
              {lines.map((line) => (
                <article className="cart-line" key={line.id}>
                  <div className="cart-line__image-wrap">
                    {line.imageUrl ? (
                      <img src={line.imageUrl} alt={line.imageAlt} className="cart-line__image" />
                    ) : (
                      <div className="cart-line__placeholder" />
                    )}
                  </div>

                  <div className="cart-line__content">
                    <div className="cart-line__meta">
                      <h4 className="cart-line__title">{line.title}</h4>
                      {line.variantTitle && line.variantTitle !== 'Default' && (
                        <p className="cart-line__variant">{line.variantTitle}</p>
                      )}
                      <p className="cart-line__price">
                        {formatMoney(line.priceAmount ? { amount: line.priceAmount, currencyCode: line.currencyCode } : null)}
                      </p>
                    </div>

                    <div className="cart-line__footer">
                      <div className="cart-line__quantity" aria-label="Quantity controls">
                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          onClick={() => handleQuantity(line.id, line.quantity - 1)}
                          disabled={busyLineId === line.id}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-line__qty-value">{line.quantity}</span>
                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          onClick={() => handleQuantity(line.id, line.quantity + 1)}
                          disabled={busyLineId === line.id}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => handleRemove(line.id)}
                        disabled={busyLineId === line.id}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="cart-drawer__footer">
          {errorMessage && <p className="cart-drawer__error">{errorMessage}</p>}

          <div className="cart-drawer__summary">
            <span>Items</span>
            <strong>{totalQuantity}</strong>
          </div>

          <div className="cart-drawer__summary cart-drawer__summary--total">
            <span>Subtotal</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>

          <button
            type="button"
            className="cart-drawer__checkout"
            onClick={handleCheckout}
            disabled={!cart?.checkoutUrl || totalQuantity === 0}
          >
            Checkout now
            <ArrowRight size={16} />
          </button>

          <p className="cart-drawer__note">You will complete payment securely on Shopify checkout.</p>
        </footer>
      </aside>
    </div>
  );
};

export default CartDrawer;