import React, { useEffect, useRef, useState } from 'react';
import './ProductGallery.css';

// ⚠️ Update these handles to match your exact Shopify collection handles
const COLLECTION_MAP = {
  'All':             { handle: null,              isRental: false },
  'Bridal':          { handle: 'bridal',          isRental: false },
  'Lehenga on Rent': { handle: 'lehenga-on-rent', isRental: true  },
  'Sarees':          { handle: 'sarees',          isRental: false },
  'Suits & Sets':    { handle: 'suits',           isRental: false },
  'Jewellery':       { handle: 'jewellery',       isRental: true  },
};

const filters = Object.keys(COLLECTION_MAP);

const LOADING_SKELETONS = Array(6)
  .fill('<div class="product-card-skeleton"></div>')
  .join('');

const EMPTY_STATE_MARKUP = `
  <div class="gallery-empty-state">
    <p class="gallery-empty-eyebrow">Curated edit</p>
    <h3 class="gallery-empty-title">New pieces are arriving soon</h3>
    <p class="gallery-empty-copy">This collection is being refreshed with new bridal and occasion looks. Message us on WhatsApp for early access or custom sourcing.</p>
    <a href="#contact" class="btn-primary">WhatsApp for availability</a>
  </div>
`;

const ProductGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const gridRef   = useRef(null);
  const emptyStateShownRef = useRef(false);

  // Inject Shopify product grid with a luxury lookbook presentation
  useEffect(() => {
    if (!gridRef.current) return;

    emptyStateShownRef.current = false;

    const { handle, isRental } = COLLECTION_MAP[activeFilter];

    const cardTemplate = `
      <template>
        <div class="product-card" data-rental="${isRental ? 'true' : 'false'}">
          <div class="product-image-container">
            <shopify-media
              query="product.selectedOrFirstAvailableVariant.image"
              width="400" height="533"
              layout="constrained"
            ></shopify-media>
          </div>
          <div class="product-info">
            <h3 class="product-name"><shopify-data query="product.title"></shopify-data></h3>
            <p class="product-price">
              <shopify-money query="product.selectedOrFirstAvailableVariant.price" format="money_with_currency"></shopify-money>
            </p>
            <span class="product-handle" hidden><shopify-data query="product.handle"></shopify-data></span>
            <span class="product-variant-id" hidden><shopify-data query="product.selectedOrFirstAvailableVariant.id"></shopify-data></span>
            <button type="button" class="product-card-hint" onclick="window.__openLookbookLightbox(this)">
              View Details
            </button>
          </div>
        </div>
      </template>
      <div class="gallery-loading-grid" shopify-loading-placeholder>${LOADING_SKELETONS}</div>
    `;

    const renderEmptyState = () => {
      if (!gridRef.current || emptyStateShownRef.current) return;
      emptyStateShownRef.current = true;
      gridRef.current.innerHTML = EMPTY_STATE_MARKUP;
    };

    const evaluateEmptyState = () => {
      if (!gridRef.current || emptyStateShownRef.current) return;
      const visibleCards = gridRef.current.querySelectorAll('.product-card').length;
      if (visibleCards === 0) {
        renderEmptyState();
      }
    };

    const renderMarkup = handle
      ? `
        <shopify-context type="collection" handle="${handle}">
          <template>
            <shopify-list-context id="product-list-initial" type="product" query="collection.products" first="12">
              ${cardTemplate}
            </shopify-list-context>
          </template>
          <div class="gallery-loading-grid" shopify-loading-placeholder>${LOADING_SKELETONS}</div>
        </shopify-context>
      `
      : `
        <shopify-list-context id="product-list-initial" type="product" query="products" first="12">
          ${cardTemplate}
        </shopify-list-context>
      `;

    gridRef.current.innerHTML = renderMarkup;

    const revealCards = () => {
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (!cards || cards.length === 0) return;
      cards.forEach((card, i) => {
        if (card.dataset.revealObserved === 'true') return;
        card.dataset.revealObserved = 'true';
        card.style.transitionDelay = `${(i % 3) * 0.12}s`;
        card.classList.add('visible');
      });
    };

    const cleanupFns = [];

    const bindListContext = (listCtx) => {
      if (!listCtx || listCtx.dataset.galleryBound === 'true') return false;

      listCtx.dataset.galleryBound = 'true';
      let hasLoaded = false;

      const onProductsLoaded = () => {
        hasLoaded = true;
        revealCards();
        evaluateEmptyState();
      };

      const mutationObserver = new MutationObserver(() => {
        revealCards();
        if (hasLoaded) {
          evaluateEmptyState();
        }
      });

      listCtx.addEventListener('shopify-list-context-update', onProductsLoaded);
      mutationObserver.observe(listCtx, { childList: true, subtree: true });

      requestAnimationFrame(() => {
        revealCards();
        if (hasLoaded) {
          evaluateEmptyState();
        }
      });

      cleanupFns.push(() => {
        listCtx.removeEventListener('shopify-list-context-update', onProductsLoaded);
        mutationObserver.disconnect();
        delete listCtx.dataset.galleryBound;
      });

      return true;
    };

    const initialListCtx = gridRef.current.querySelector('shopify-list-context');
    if (!bindListContext(initialListCtx)) {
      const rootObserver = new MutationObserver(() => {
        const nextListCtx = gridRef.current?.querySelector('shopify-list-context');
        if (bindListContext(nextListCtx)) {
          rootObserver.disconnect();
        }
      });

      rootObserver.observe(gridRef.current, { childList: true, subtree: true });
      cleanupFns.push(() => rootObserver.disconnect());
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [activeFilter]);

  return (
    <section className="gallery section-padding" id="collections">
      <div className="container">
        <div className="gallery-header text-center">
          <p className="gallery-eyebrow">LOOKBOOK</p>
          <h2 className="heading-lg">The <span className="text-gold">Signature Edit</span></h2>
          <p className="gallery-subtitle">A curated selection of bridal, festive &amp; occasion wear from the studio.</p>
        </div>

        <div className="gallery-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Shopify product grid injected here via ref */}
        <div className="product-grid" ref={gridRef} />

        <div className="gallery-footer text-center">
          <p className="gallery-footer-copy">For sizing, availability, rent options, and custom work, message us directly.</p>
          <a href="#contact" className="btn-primary">Book a Styling Visit</a>
        </div>
      </div>

    </section>
  );
};

export default ProductGallery;
