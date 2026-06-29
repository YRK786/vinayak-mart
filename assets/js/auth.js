/**
 * AUTH.JS — Vinayak Mart Authentication Flow
 * Handles: Mobile entry → OTP → Register / Welcome-back → Success
 */

const Auth = (() => {

  /* ── State ── */
  let currentScreen = 'screenMobile';
  let enteredMobile = '';
  let otpTimer      = null;
  let countdown     = 30;
  const DEMO_OTP    = '123456';

  /* Simulated existing users (demo) */
  const EXISTING_USERS = ['9876543210', '9123456789', '8000000001'];

  /* ── Screen Transition ── */
  function goTo(screenId) {
    const current = document.getElementById(currentScreen);
    const next    = document.getElementById(screenId);
    if (!next || screenId === currentScreen) return;

    current.classList.remove('active');
    current.classList.add('exit');
    setTimeout(() => current.classList.remove('exit'), 400);

    next.classList.add('active');
    currentScreen = screenId;
  }

  function goBack(screenId) {
    clearTimer();
    const current = document.getElementById(currentScreen);
    const prev    = document.getElementById(screenId);
    if (!prev) return;

    current.classList.remove('active');
    current.style.transform = 'translateX(40px)';
    current.style.opacity   = '0';
    setTimeout(() => { current.style.transform = ''; current.style.opacity = ''; }, 400);

    prev.classList.add('active');
    currentScreen = screenId;
  }

  /* ── SCREEN 1: Send OTP ── */
  function sendOtp() {
    const input   = document.getElementById('mobileInput');
    const tnc     = document.getElementById('tncCheck');
    const btn     = document.getElementById('sendOtpBtn');
    const mobile  = input.value.trim();

    /* Validations */
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      input.classList.add('error');
      showToast('Enter a valid 10-digit Indian mobile number', 'error');
      input.focus();
      setTimeout(() => input.classList.remove('error'), 2000);
      return;
    }
    if (!tnc.checked) {
      showToast('Please accept Terms & Conditions', 'info');
      return;
    }

    input.classList.remove('error');
    input.classList.add('success');
    enteredMobile = mobile;

    /* Loading animation */
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;

      /* Update OTP screen header */
      document.getElementById('displayNumber').textContent =
        '+91 ' + mobile.slice(0,5) + 'XXXXX';

      goTo('screenOtp');
      startOtpTimer();
      focusFirstOtpBox();
      showToast('OTP sent to +91 ' + mobile.slice(0,5) + 'XXXXX', 'success');
    }, 1400);
  }

  /* ── OTP Timer ── */
  function startOtpTimer() {
    clearTimer();
    countdown = 30;
    const resendBtn   = document.getElementById('resendBtn');
    const timerSpan   = document.getElementById('resendTimer');
    const countdownEl = document.getElementById('countdownVal');

    resendBtn.disabled = true;
    resendBtn.style.opacity = '.4';
    timerSpan.style.display = 'inline';

    otpTimer = setInterval(() => {
      countdown--;
      countdownEl.textContent = countdown + 's';
      if (countdown <= 0) {
        clearTimer();
        resendBtn.disabled = false;
        resendBtn.style.opacity = '1';
        timerSpan.style.display = 'none';
      }
    }, 1000);
  }

  function clearTimer() {
    if (otpTimer) { clearInterval(otpTimer); otpTimer = null; }
  }

  function resendOtp() {
    clearOtpBoxes();
    startOtpTimer();
    focusFirstOtpBox();
    showToast('OTP resent successfully!', 'success');
  }

  /* ── OTP Boxes Logic ── */
  function focusFirstOtpBox() {
    setTimeout(() => {
      const first = document.getElementById('otp0');
      if (first) first.focus();
    }, 350);
  }

  function clearOtpBoxes() {
    for (let i = 0; i < 6; i++) {
      const box = document.getElementById('otp' + i);
      if (box) { box.value = ''; box.classList.remove('filled', 'verified'); }
    }
  }

  function getEnteredOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += (document.getElementById('otp' + i)?.value || '');
    }
    return otp;
  }

  function initOtpBoxes() {
    for (let i = 0; i < 6; i++) {
      const box = document.getElementById('otp' + i);
      if (!box) continue;

      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val.slice(-1);
        e.target.classList.toggle('filled', !!e.target.value);
        if (val && i < 5) document.getElementById('otp' + (i + 1)).focus();
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          document.getElementById('otp' + (i - 1)).focus();
        }
      });

      /* Handle paste on first box */
      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        for (let j = 0; j < 6 && j < pasted.length; j++) {
          const b = document.getElementById('otp' + j);
          if (b) { b.value = pasted[j]; b.classList.add('filled'); }
        }
        const lastFilled = Math.min(pasted.length, 5);
        document.getElementById('otp' + lastFilled)?.focus();
      });
    }
  }

  /* ── SCREEN 2: Verify OTP ── */
  function verifyOtp() {
    const otp = getEnteredOtp();
    const btn = document.getElementById('verifyOtpBtn');

    if (otp.length < 6) {
      showToast('Please enter the complete 6-digit OTP', 'error');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;

      if (otp !== DEMO_OTP) {
        showToast('Invalid OTP. Try 1 2 3 4 5 6 for demo', 'error');
        clearOtpBoxes();
        focusFirstOtpBox();
        return;
      }

      /* Mark verified */
      for (let i = 0; i < 6; i++) {
        const b = document.getElementById('otp' + i);
        if (b) { b.classList.remove('filled'); b.classList.add('verified'); }
      }
      clearTimer();
      showToast('OTP verified!', 'success');

      setTimeout(() => {
        if (EXISTING_USERS.includes(enteredMobile)) {
          showWelcomeBack();
        } else {
          goTo('screenRegister');
        }
      }, 700);
    }, 1200);
  }

  /* ── Returning User ── */
  function showWelcomeBack() {
    const maskedMobile = '+91 ' + enteredMobile.slice(0,5) + 'XXXXX';
    document.getElementById('welcomeMobile').textContent = maskedMobile;
    document.getElementById('welcomeName').textContent   = 'Returning User';
    goTo('screenWelcome');
    showToast('Welcome back! 👋', 'success');
  }

  /* ── SCREEN 3: Register ── */
  function register() {
    const first = document.getElementById('firstName').value.trim();
    const last  = document.getElementById('lastName').value.trim();
    const btn   = document.getElementById('registerBtn');

    if (!first) {
      document.getElementById('firstName').classList.add('error');
      showToast('Please enter your first name', 'error');
      document.getElementById('firstName').focus();
      setTimeout(() => document.getElementById('firstName').classList.remove('error'), 2000);
      return;
    }
    if (!last) {
      document.getElementById('lastName').classList.add('error');
      showToast('Please enter your last name', 'error');
      document.getElementById('lastName').focus();
      setTimeout(() => document.getElementById('lastName').classList.remove('error'), 2000);
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      document.getElementById('successTitle').textContent = 'Welcome, ' + first + '! 🎉';
      document.getElementById('successSub').textContent   = 'Your account has been created. Enjoy fresh shopping!';
      goTo('screenSuccess');
    }, 1500);
  }

  /* ── Current Location Detection ── */
  function detectLocation() {
    const btn      = document.getElementById('locationBtn');
    const subText  = document.getElementById('locationSubText');
    const pingIcon = document.querySelector('#locationPing i');
    const arrow    = document.getElementById('locationArrow');

    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    /* Detecting state */
    btn.classList.add('detecting');
    btn.classList.remove('detected');
    subText.textContent = 'Detecting your location…';
    pingIcon.className  = 'bi bi-arrow-repeat';
    arrow.className     = 'bi bi-hourglass-split location-arrow';

    navigator.geolocation.getCurrentPosition(
      /* SUCCESS */
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;

        /* Reverse geocode using OpenStreetMap Nominatim (free, no key needed) */
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          .then(r => r.json())
          .then(data => {
            const addr = data.address || {};
            const parts = [
              addr.road || addr.neighbourhood || addr.suburb,
              addr.city || addr.town || addr.village || addr.county,
              addr.state
            ].filter(Boolean);
            const displayAddr = parts.length ? parts.join(', ') : `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

            /* Update button to detected state */
            btn.classList.remove('detecting');
            btn.classList.add('detected');
            subText.textContent   = 'Location detected ✓';
            pingIcon.className    = 'bi bi-check-lg';
            arrow.className       = 'bi bi-chevron-right location-arrow';

            /* Show result card */
            const result  = document.getElementById('locationResult');
            const lrAddr  = document.getElementById('lrAddress');
            lrAddr.textContent = displayAddr;
            result.style.display = 'block';

            showToast('📍 Location detected: ' + (parts[1] || displayAddr), 'success');
          })
          .catch(() => {
            /* Fallback: just show coordinates */
            btn.classList.remove('detecting');
            btn.classList.add('detected');
            subText.textContent = 'Location detected ✓';
            pingIcon.className  = 'bi bi-check-lg';
            arrow.className     = 'bi bi-chevron-right location-arrow';

            const result = document.getElementById('locationResult');
            document.getElementById('lrAddress').textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            result.style.display = 'block';
            showToast('📍 Coordinates detected', 'success');
          });
      },
      /* ERROR */
      (err) => {
        btn.classList.remove('detecting');
        pingIcon.className = 'bi bi-geo-alt-fill';
        arrow.className    = 'bi bi-chevron-right location-arrow';
        subText.textContent = 'Detect your delivery area automatically';

        const msgs = {
          1: 'Location permission denied. Please allow access.',
          2: 'Location unavailable. Try again.',
          3: 'Location request timed out.'
        };
        showToast(msgs[err.code] || 'Could not detect location', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function clearLocation() {
    const btn      = document.getElementById('locationBtn');
    const subText  = document.getElementById('locationSubText');
    const pingIcon = document.querySelector('#locationPing i');
    const arrow    = document.getElementById('locationArrow');
    const result   = document.getElementById('locationResult');

    btn.classList.remove('detected', 'detecting');
    subText.textContent = 'Detect your delivery area automatically';
    pingIcon.className  = 'bi bi-geo-alt-fill';
    arrow.className     = 'bi bi-chevron-right location-arrow';
    result.style.display = 'none';
    document.getElementById('lrAddress').textContent = 'Detecting…';
    showToast('Location cleared', 'info');
  }

  /* ── Continue / Logout ── */
  function continueToHome() {
    showToast('Redirecting to homepage…', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
  }

  function logout() {
    enteredMobile = '';
    clearOtpBoxes();
    document.getElementById('mobileInput').value = '';
    document.getElementById('mobileInput').classList.remove('success');
    document.getElementById('tncCheck').checked = false;
    clearTimer();
    goTo('screenMobile');
    showToast('Switched account', 'info');
  }

  /* ── Toast Notification ── */
  function showToast(msg, type = 'info') {
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    const container = document.getElementById('authToastContainer');
    const toast = document.createElement('div');
    toast.className = `auth-toast toast-${type}`;
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  /* ── Gender Option Highlight ── */
  function initGenderOptions() {
    document.querySelectorAll('.gender-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.gender-option').forEach(opt => opt.classList.remove('selected'));
        radio.closest('.gender-option').classList.add('selected');
      });
    });
  }

  /* ── Social Login Buttons (demo) ── */
  function initSocialButtons() {
    document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
      showToast('Google sign-in coming soon!', 'info');
    });
    document.getElementById('whatsappLoginBtn')?.addEventListener('click', () => {
      showToast('WhatsApp sign-in coming soon!', 'info');
    });
  }

  /* ── Mobile input: digits only ── */
  function initMobileInput() {
    const input = document.getElementById('mobileInput');
    if (!input) return;
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '');
      input.classList.remove('error');
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendOtp();
    });
  }

  /* ── Init ── */
  function init() {
    initOtpBoxes();
    initGenderOptions();
    initSocialButtons();
    initMobileInput();
  }

  /* ── Public API ── */
  return { sendOtp, verifyOtp, resendOtp, goBack, register, continueToHome, logout, detectLocation, clearLocation, init };

})();

document.addEventListener('DOMContentLoaded', Auth.init);
