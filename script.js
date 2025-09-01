/* script.js — robusto, logs para debug, no cambia estructura/posiciones.
   Soporta mouse, pointer y táctil. */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[ghostcity] script cargado');

  const clickImg = document.querySelector('img.click');
  const clickAnchor = clickImg ? clickImg.closest('a') : null;
  const calaveras = document.querySelector('img.calaveras');
  const mira = document.querySelector('img.mira');
  const drop = document.querySelector('img.drop');

  if (!clickImg) {
    console.warn('[ghostcity] no se encontró imagen .click — revisá el HTML');
    return;
  }
  console.log('[ghostcity] elementos:', {
    clickImg: !!clickImg,
    clickAnchor: !!clickAnchor,
    calaveras: !!calaveras,
    mira: !!mira,
    drop: !!drop
  });

  // helpers
  const addHoverOnClickArea = () => {
    clickImg.classList.add('hovered');
    if (calaveras) {
      calaveras.classList.add('spin', 'spin-fast');
    }
  };
  const removeHoverOnClickArea = () => {
    clickImg.classList.remove('hovered');
    if (calaveras) {
      calaveras.classList.remove('spin', 'spin-fast');
    }
  };

  // Target: preferimos el <a> si existe (más área), si no, el propio img
  const clickTarget = clickAnchor || clickImg;

  // Pointer events (mouse + touch-capable pointers)
  clickTarget.addEventListener('pointerenter', (e) => {
    addHoverOnClickArea();
  });
  clickTarget.addEventListener('pointerleave', (e) => {
    removeHoverOnClickArea();
  });

  // Focus (keyboard): si el <a> recibe focus con tab
  if (clickAnchor) {
    clickAnchor.addEventListener('focus', addHoverOnClickArea, true);
    clickAnchor.addEventListener('blur', removeHoverOnClickArea, true);
  } else {
    // si no hay anchor, permitir foco en la imagen por accesibilidad JS
    clickImg.setAttribute('tabindex', '0');
    clickImg.addEventListener('focus', addHoverOnClickArea);
    clickImg.addEventListener('blur', removeHoverOnClickArea);
  }

  // Touch fallback: show effect briefly on touchstart
  clickTarget.addEventListener('touchstart', (e) => {
    addHoverOnClickArea();
    // quitarlo rápido para no bloquear la navegación
    setTimeout(removeHoverOnClickArea, 1400);
  }, { passive: true });

  // === Drop hover (último drop) ===
  if (drop) {
    const dropAnchor = drop.closest('a');
    const dropTarget = dropAnchor || drop;

    const addDropHover = () => drop.classList.add('hovered');
    const removeDropHover = () => drop.classList.remove('hovered');

    dropTarget.addEventListener('pointerenter', addDropHover);
    dropTarget.addEventListener('pointerleave', removeDropHover);
    dropTarget.addEventListener('touchstart', () => {
      addDropHover();
      setTimeout(removeDropHover, 1200);
    }, { passive: true });
  }

  // Optional: if calaveras exists but images not yet decoded, ensure animation triggers after decode
  if (calaveras && calaveras.complete === false) {
    calaveras.addEventListener('load', () => {
      // nothing to do, but ensures image is ready
      console.log('[ghostcity] calaveras cargadas');
    });
  }

  console.log('[ghostcity] listeners inicializados ✓');
});
