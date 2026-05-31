import React, { useEffect, useRef } from 'react';
import { SHOPIFY_STORE_DOMAIN } from '../lib/shopifyConfig';
import { addVariantToCart, buyNowVariant, openCartDrawer } from '../lib/shopifyStorefrontCart';


const STL_CSS = `
  .stl-section {
    --cream-bg:      #F5F4E5;
    --cream-light:   #FFFDF8;
    --forest-green:  #16362A;
    --heading-dark:  #2C2416;
    --text-muted:    #8A7E74;
    --border-cream:  #E2DDD0;
    --gold-accent:   #C49A3C;
    --stl-card-w:    280px;
    --stl-card-h:    380px;

    position: relative;
    background: var(--cream-bg);
    padding: 80px 0 96px;
    border-top: 1px solid rgba(196,154,60,0.2);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .stl-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%23C49A3C' opacity='0.03'/%3E%3C/svg%3E");
    background-repeat: repeat;
    pointer-events: none;
    z-index: 0;
  }

  .stl-section > * { position: relative; z-index: 1; }

  .stl-carousel-mount,
  .stl-carousel-mount shopify-context {
    width: 100%;
  }

  .stl-carousel-mount shopify-context {
    display: block !important;
    position: relative;
  }

  /* ── Section Header ── */
  .stl-header {
    text-align: center;
    margin-bottom: 48px;
    padding: 0 24px;
  }

  .stl-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: #8A7E74;
    margin: 0 0 16px;
  }

  .stl-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: clamp(32px, 4vw, 52px);
    color: #2C2416;
    margin: 0 0 12px;
    line-height: 1.1;
  }

  .stl-title em {
    font-style: italic;
    font-weight: 400;
  }

  .stl-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 14px;
    color: #8A7E74;
    max-width: 360px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .stl-gold-rule {
    width: 80px;
    height: 1px;
    background: #C49A3C;
    margin: 16px auto 0;
  }

  /* ── Swiper ── */
  .stl-swiper {
    width: 100%;
    padding: 20px 0 48px !important;
    overflow: hidden !important;
  }

  .stl-swiper .swiper-slide {
    height: auto !important;
  }

  .stl-swiper shopify-list-context.swiper-wrapper {
    display: flex !important;
    transition-timing-function: linear !important;
  }

  .stl-swiper .swiper-slide {
    width: var(--stl-card-w) !important;
    height: var(--stl-card-h) !important;
    opacity: 0.65;
    transition: opacity 0.4s ease;
  }

  .stl-swiper .swiper-slide.swiper-slide-active {
    opacity: 1;
  }

  /* ── Card ── */
  .stl-card {
    width: 100%;
    height: auto;
    background: #FFFDF8;
    border: 1px solid #E2DDD0;
    border-radius: 4px;
    box-shadow: 0 2px 16px rgba(44,36,22,0.07);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.4s ease;
  }

  .swiper-slide-active .stl-card {
    box-shadow: 0 8px 40px rgba(44,36,22,0.16), 0 0 0 1px rgba(22,54,42,0.12);
  }

  /* Gold top accent bar */
  .stl-card__gold-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #C49A3C, #E8C96A, #C49A3C);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.5s ease;
    z-index: 2;
  }

  .swiper-slide-active .stl-card__gold-bar {
    transform: scaleX(1);
  }

  /* Image area */
  .stl-card__image-area {
    flex: 0 0 auto;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    position: relative;
    background: var(--cream-light);
  }

  .stl-card__image-area img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--cream-light);
    display: block;
    transition: transform 0.6s ease, filter 0.6s ease;
  }

  .swiper-slide-active .stl-card:hover .stl-card__image-area img {
    transform: scale(1.04);
    filter: brightness(1.03);
  }

  /* Placeholder when image fails */
  .stl-img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #EDE9DC, #F5F2E8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Info area */
  .stl-card__info {
    flex: 0 0 auto;
    background: #FFFDF8;
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .stl-badge {
    display: none;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 8px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #16362A;
    background: rgba(22,54,42,0.07);
    border: 1px solid rgba(22,54,42,0.15);
    padding: 2px 8px;
    border-radius: 2px;
    margin-bottom: 6px;
    width: fit-content;
  }

  .swiper-slide-active .stl-badge {
    display: inline-block;
  }

  .stl-card__name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 20px;
    color: #2C2416;
    line-height: 1.2;
    margin: 0 0 6px;
  }

  .stl-card__price {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 13px;
    color: #16362A;
    letter-spacing: 0.5px;
    margin: 0;
  }

  /* ── Card buy actions ── */
  .stl-card__actions {
    display: none;
    gap: 8px;
    margin-top: 12px;
    width: 100%;
  }

  .swiper-slide-active .stl-card__actions {
    display: flex;
  }

  .stl-action-btn {
    flex: 1;
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 10px 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .stl-action-btn.add-to-cart {
    background: transparent;
    border: 1px solid var(--forest-green);
    color: var(--forest-green);
  }

  .stl-action-btn.add-to-cart:hover {
    background: rgba(22, 54, 42, 0.05);
  }

  .stl-action-btn.buy-now {
    background: var(--forest-green);
    color: white;
  }

  .stl-action-btn.buy-now:hover {
    background: #1f4a39;
  }

  .stl-view-link {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #16362A;
    text-decoration: none;
    border-bottom: 1px solid rgba(22,54,42,0.3);
    width: fit-content;
    margin-top: 10px;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .swiper-slide-active .stl-card:hover .stl-view-link {
    max-height: 30px;
    opacity: 1;
  }

  /* ── stl-view-link as button ── */
  .stl-view-link {
    background: none;
    border: none;
    border-bottom: 1px solid rgba(22,54,42,0.3);
    cursor: pointer;
    padding: 0;
  }

  /* ── shopify-media inside stl card fills the area ── */
  .stl-card__image-area shopify-media {
    display: block;
    width: 100%;
    height: 100%;
  }

  .stl-card__image-area shopify-media img,
  .stl-card__image-area shopify-media unpic-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--cream-light);
    display: block;
  }

  /* ── Loading placeholder ── */
  .stl-loading-placeholder {
    display: none;
  }

  /* ── Navigation Buttons ── */
  .stl-swiper .swiper-button-prev,
  .stl-swiper .swiper-button-next {
    width: 38px !important;
    height: 38px !important;
    background: #FFFDF8 !important;
    border: 1px solid #E2DDD0 !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 8px rgba(44,36,22,0.08) !important;
    transition: background 0.3s ease, border-color 0.3s ease !important;
    top: 50% !important;
    margin-top: -38px !important;
  }

  .stl-swiper .swiper-button-prev::after,
  .stl-swiper .swiper-button-next::after {
    font-size: 12px !important;
    color: #2C2416 !important;
    font-weight: 700 !important;
  }

  .stl-swiper .swiper-button-prev:hover,
  .stl-swiper .swiper-button-next:hover {
    background: #F5F4E5 !important;
    border-color: #C49A3C !important;
  }

  .stl-swiper .swiper-button-prev:hover::after,
  .stl-swiper .swiper-button-next:hover::after {
    color: #16362A !important;
  }

  /* ── Pagination Dots ── */
  .stl-swiper .swiper-pagination-bullet {
    width: 5px !important;
    height: 5px !important;
    background: #C8BFB0 !important;
    opacity: 1 !important;
    border-radius: 50% !important;
    transition: all 0.3s ease !important;
  }

  .stl-swiper .swiper-pagination-bullet-active {
    width: 20px !important;
    border-radius: 2px !important;
    background: #16362A !important;
  }

  /* ── CTA ── */
  .stl-cta {
    text-align: center;
    margin-top: 40px;
  }

  .stl-cta__link {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 16px;
    color: #2C2416;
    text-decoration: none;
    border-bottom: 1px solid #C49A3C;
    padding-bottom: 2px;
    display: inline-block;
    transition: letter-spacing 0.3s ease;
  }

  .stl-cta__link:hover {
    letter-spacing: 0.05em;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .stl-section {
      --stl-card-w: 250px;
      --stl-card-h: 350px;
      padding: 64px 0 80px;
    }
  }

  @media (max-width: 480px) {
    .stl-section {
      --stl-card-w: 78vw;
      --stl-card-h: calc(100svh - 230px);
      padding: 40px 0 56px;
    }
    .stl-card__image-area {
      flex: 0 0 68%;
    }
    .stl-card__info {
      flex: 0 0 32%;
      padding: 12px 14px 14px;
    }
    .stl-card__name {
      font-size: 21px;
    }
    .stl-header {
      margin-bottom: 32px;
    }
    .stl-swiper .swiper-button-prev,
    .stl-swiper .swiper-button-next {
      display: none !important;
    }
  }
`;

const STL_SLIDE_TEMPLATE = `
  <div class="swiper-slide">
    <div class="stl-card" data-rental="false" onclick="window.__openShopifyProductPage(this)" role="link" tabindex="0">
      <div class="stl-card__gold-bar"></div>
      <div class="stl-card__image-area">
        <shopify-media
          query="product.selectedOrFirstAvailableVariant.image"
          width="400" height="500"
          layout="constrained"
        ></shopify-media>
      </div>
      <div class="stl-card__info">
        <span class="stl-badge"><shopify-data query="product.productType"></shopify-data></span>
        <h3 class="stl-card__name"><shopify-data query="product.title"></shopify-data></h3>
        <p class="stl-card__price"><shopify-money query="product.selectedOrFirstAvailableVariant.price" format="money_with_currency"></shopify-money></p>
        <span class="stl-product-handle" hidden><shopify-data query="product.handle"></shopify-data></span>
        <span class="stl-variant-id" hidden><shopify-data query="product.selectedOrFirstAvailableVariant.id"></shopify-data></span>
        <div class="stl-card__actions">
          <button class="stl-action-btn add-to-cart" onclick="event.stopPropagation(); window.__addLookbookToCart(this)">Add to Cart</button>
          <button class="stl-action-btn buy-now" onclick="event.stopPropagation(); window.__buyLookbookNow(this)">Buy Now</button>
        </div>
        <button class="stl-view-link" onclick="window.__openShopifyProductPage(this)">View Product &#8594;</button>
      </div>
    </div>
  </div>
`;

const HERO_CAROUSEL_COLLECTION_HANDLE = 'hero-carousel';

const readText = (element, selector, fallback = '') => {
  const target = element?.querySelector(selector);
  return target?.textContent?.trim() || fallback;
};

const buildShopifyProductUrl = (handle) => {
  if (!handle) return '';

  return `https://${SHOPIFY_STORE_DOMAIN}/products/${encodeURIComponent(handle)}`;
};

const ShopTheLookCarousel = () => {
  const swiperRef    = useRef(null);
  const wrapperRef   = useRef(null);
  const swiperInstanceRef = useRef(null);
  const swiperReadyRef    = useRef(false);
  const slidesReadyRef    = useRef(false);

  useEffect(() => {
    const cleanupFns = [];
    let swiperInitialized = false;

    // Global Add to Cart and Buy Now handlers
    window.__addLookbookToCart = async (btn) => {
      const card = btn.closest('.stl-card');
      const variantEl = card?.querySelector('.stl-variant-id');
      const variantId = variantEl ? variantEl.textContent.trim() : '';
      if (!variantId) return;

      const originalText = btn.textContent;
      btn.textContent = 'Adding...';
      btn.disabled = true;
      try {
        await addVariantToCart(variantId, 1);
        openCartDrawer();
      } catch (e) {
        console.error(e);
        alert('Could not add to cart: ' + e.message);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    };

    window.__buyLookbookNow = async (btn) => {
      const card = btn.closest('.stl-card');
      const variantEl = card?.querySelector('.stl-variant-id');
      const variantId = variantEl ? variantEl.textContent.trim() : '';
      if (!variantId) return;

      const originalText = btn.textContent;
      btn.textContent = 'Buying...';
      btn.disabled = true;
      try {
        await buyNowVariant(variantId, 1);
      } catch (e) {
        console.error(e);
        alert('Checkout failed: ' + e.message);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    };

    cleanupFns.push(() => {
      delete window.__addLookbookToCart;
      delete window.__buyLookbookNow;
    });

    const resolveSwiperElement = () => swiperRef.current || null;

    const destroySwiper = () => {
      if (swiperInstanceRef.current) {
        try { swiperInstanceRef.current.destroy(true, true); } catch (_) {}
        swiperInstanceRef.current = null;
      }
      swiperInitialized = false;
    };

    const runCleanupFns = () => {
      while (cleanupFns.length > 0) {
        const cleanup = cleanupFns.pop();
        try { cleanup?.(); } catch (_) {}
      }
    };

    const openShopifyProductPage = (sourceElement) => {
      const card = sourceElement?.closest?.('.product-card, .stl-card') || sourceElement;
      if (!card) return;

      const handle = readText(card, '.product-handle, .stl-product-handle', '');
      const productUrl = buildShopifyProductUrl(handle);
      if (!productUrl) return;

      window.location.assign(productUrl);
    };

    window.__openShopifyProductPage = openShopifyProductPage;
    cleanupFns.push(() => {
      if (window.__openShopifyProductPage === openShopifyProductPage) {
        delete window.__openShopifyProductPage;
      }
    });

    const initSwiper = () => {
      const swiperElement = resolveSwiperElement();
      if (!swiperElement || !window.Swiper) return;
      if (swiperInitialized) return;
      destroySwiper();

      swiperRef.current = swiperElement;
      const slideCount = swiperElement.querySelectorAll('.swiper-slide').length;

      swiperInstanceRef.current = new window.Swiper(swiperElement, {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 24,
        watchSlidesProgress: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: window.innerWidth <= 480 ? 60 : 200,
          modifier: window.innerWidth <= 480 ? 0.75 : 1.1,
          slideShadows: false,
        },
        loop: false,
        rewind: true,
        slidesPerGroup: 1,
        navigation: {
          nextEl: swiperRef.current.querySelector('.swiper-button-next'),
          prevEl: swiperRef.current.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: swiperRef.current.querySelector('.swiper-pagination'),
          clickable: true,
        },
        speed: 2600,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: true,
      });

      const advanceTimer = window.setInterval(() => {
        const instance = swiperInstanceRef.current;
        if (!instance || instance.destroyed || instance.animating) return;
        instance.slideNext(2400);
      }, 2600);

      cleanupFns.push(() => window.clearInterval(advanceTimer));

      swiperInitialized = true;
    };

    const moveSlidesIntoWrapper = (listCtx) => {
      const wrapperEl = wrapperRef.current;
      if (!wrapperEl || !listCtx || wrapperEl.dataset.stlHydrated === 'true') return false;

      const slides = Array.from(listCtx.querySelectorAll('.swiper-slide'));
      if (slides.length === 0) return false;

      const hasRenderedContent = slides.some((slide) => slide.querySelector('img'));
      if (!hasRenderedContent) return false;

      const shopifyContext = listCtx.closest('shopify-context');

      slides.forEach((slide) => wrapperEl.appendChild(slide));
      wrapperEl.dataset.stlHydrated = 'true';
      listCtx.remove();
      shopifyContext?.remove();
      slidesReadyRef.current = true;

      if (swiperReadyRef.current) {
        destroySwiper();
        setTimeout(initSwiper, 0);
      }

      return true;
    };

    if (wrapperRef.current) {
      wrapperRef.current.innerHTML = `
        <shopify-context type="collection" handle="${HERO_CAROUSEL_COLLECTION_HANDLE}">
          <template>
            <shopify-list-context type="product" query="collection.products" first="250">
              <template>${STL_SLIDE_TEMPLATE}</template>
              <div class="stl-loading-placeholder" shopify-loading-placeholder></div>
            </shopify-list-context>
          </template>
          <div class="stl-loading-placeholder" shopify-loading-placeholder></div>
        </shopify-context>
      `;
    }

    const bindListContext = (listCtx) => {
      if (!listCtx || listCtx.dataset.carouselBound === 'true') return false;

      listCtx.dataset.carouselBound = 'true';

      const markSlidesReady = () => {
        if (moveSlidesIntoWrapper(listCtx)) {
          if (swiperReadyRef.current) {
            setTimeout(initSwiper, 0);
          }
          return;
        }

        const wrapperEl = wrapperRef.current;
        if (wrapperEl && wrapperEl.querySelector('.swiper-slide')) {
          slidesReadyRef.current = true;
          if (swiperReadyRef.current) {
            setTimeout(initSwiper, 0);
          }
        }
      };

      const onProductsLoaded = () => {
        markSlidesReady();
      };

      const mutationObserver = new MutationObserver(() => {
        markSlidesReady();
      });

      listCtx.addEventListener('shopify-list-context-update', onProductsLoaded);
      mutationObserver.observe(listCtx, { childList: true, subtree: true });

      requestAnimationFrame(markSlidesReady);

      cleanupFns.push(() => {
        listCtx.removeEventListener('shopify-list-context-update', onProductsLoaded);
        mutationObserver.disconnect();
        delete listCtx.dataset.carouselBound;
      });

      return true;
    };

    const initialListCtx = wrapperRef.current?.querySelector('shopify-list-context');
    if (initialListCtx) {
      bindListContext(initialListCtx);
    } else if (wrapperRef.current) {
      const listObserver = new MutationObserver(() => {
        const nextListCtx = wrapperRef.current?.querySelector('shopify-list-context');
        if (bindListContext(nextListCtx)) {
          listObserver.disconnect();
        }
      });

      listObserver.observe(wrapperRef.current, { childList: true, subtree: true });
      cleanupFns.push(() => listObserver.disconnect());
    }

    const tryInitWhenReady = () => {
      if (resolveSwiperElement() && swiperReadyRef.current && slidesReadyRef.current) {
        initSwiper();
        return true;
      }
      return false;
    };

    if (wrapperRef.current && !tryInitWhenReady()) {
      const rootObserver = new MutationObserver(() => {
        if (tryInitWhenReady()) {
          rootObserver.disconnect();
        }
      });

      rootObserver.observe(wrapperRef.current, { childList: true, subtree: true });
      cleanupFns.push(() => rootObserver.disconnect());
    }

    if (!document.querySelector('link[href*="fonts.googleapis.com/css2"]')) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap';
      document.head.appendChild(fontLink);
    }

    if (!document.querySelector('link[href*="swiper-bundle.min.css"]')) {
      const swiperCSS = document.createElement('link');
      swiperCSS.rel = 'stylesheet';
      swiperCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css';
      document.head.appendChild(swiperCSS);
    }

    const onSwiperReady = () => {
      swiperReadyRef.current = true;
      if (slidesReadyRef.current) initSwiper();
    };

    if (window.Swiper) {
      onSwiperReady();
      return () => {
        runCleanupFns();
        destroySwiper();
      };
    }

    const existingScript = document.querySelector('script[src*="swiper-bundle.min.js"]');
    if (existingScript) {
      let interval = setInterval(() => {
        if (window.Swiper) { clearInterval(interval); onSwiperReady(); }
      }, 50);
      return () => {
        clearInterval(interval);
        runCleanupFns();
        destroySwiper();
      };
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js';
    script.onload = onSwiperReady;
    document.body.appendChild(script);

    return () => {
      runCleanupFns();
      destroySwiper();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STL_CSS }} />
      <section className="stl-section">
        <div className="stl-header">
          <p className="stl-eyebrow">THE SIGNATURE COLLECTION</p>
          <h2 className="stl-title">The Signature <em>Collection</em></h2>
          <p className="stl-subtitle">Meticulously crafted for the modern muse.</p>
          <div className="stl-gold-rule" />
        </div>

        <div className="swiper stl-swiper" ref={swiperRef}>
          <div className="swiper-wrapper" ref={wrapperRef} />
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
          <div className="swiper-pagination" />
        </div>

        <div className="stl-cta">
          <a href="#collections" className="stl-cta__link">View Full Catalog →</a>
        </div>
      </section>
    </>
  );
};

export default ShopTheLookCarousel;
