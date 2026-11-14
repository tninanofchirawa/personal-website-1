function copyEmailAddress(el) {
    const email = 'rohan.chirawa@gmail.com';
    function turnGreen() {
      el.classList.add('copied');
      setTimeout(() => {
        el.classList.remove('copied');
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(turnGreen)
        .catch(() => fallbackCopy(email, turnGreen));
    } else {
      fallbackCopy(email, turnGreen);
    }
  }

  function fallbackCopy(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      callback();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(ta);
  }