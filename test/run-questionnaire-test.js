const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

(async () => {
  try {
    const htmlPath = path.resolve(__dirname, '../public/questionnaire.html');
    const scriptPath = path.resolve(__dirname, '../public/js/questionnaire.js');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const script = fs.readFileSync(scriptPath, 'utf8');

    // Remove external Tailwind CDN script and inline tailwind.config block to avoid runtime errors in jsdom
    html = html.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/i, '');
    html = html.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/i, '');

    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost:3000' });
    const { window } = dom;
    const { document } = window;

    // Inject the questionnaire script into the DOM so it runs
    const s = document.createElement('script');
    s.textContent = script;
    document.body.appendChild(s);

    // Trigger DOMContentLoaded (the script listens to it)
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    // Wait shortly for initialization
    await new Promise(r => setTimeout(r, 100));

    const out = (label, ok) => console.log(`${label}: ${ok ? 'OK' : 'FAIL'}`);

    // Check initial step indicator in DOM
    const stepEl = document.getElementById('current-step');
    out('Has current-step element', !!stepEl);
    out('Has nextStep fn', typeof window.nextStep === 'function');
    out('Has goBack fn', typeof window.goBack === 'function');
    out('Has loadQuestion fn', typeof window.loadQuestion === 'function');

    // Ensure input exists for step 1
    const input1 = document.getElementById('answer-input');
    out('Input for step1 present', !!input1);

    // Next button should be disabled initially
    const nextButton = document.getElementById('next-button');
    out('Next button exists', !!nextButton);
    const disabledInitially = nextButton.className.includes('pointer-events-none');
    out('Next disabled initially', disabledInitially);

    // Fill answer and trigger change
    if (input1) {
      input1.value = 'Test';
      input1.dispatchEvent(new window.Event('change', { bubbles: true }));
      await new Promise(r => setTimeout(r, 50));
      const enabled = !nextButton.className.includes('pointer-events-none');
      out('Next enabled after answer', enabled);

        // Call nextStep and verify step increment using DOM indicator
        const before = Number(stepEl.textContent);
        window.nextStep();
        await new Promise(r => setTimeout(r, 50));
        const after = Number(stepEl.textContent);
        out('Step incremented', after === before + 1);

      // Call goBack and verify step decremented
      window.goBack();
      await new Promise(r => setTimeout(r, 50));
      const back = Number(stepEl.textContent);
      out('Step decremented', back === before);
    }

    console.log('Test script finished.');
    process.exit(0);
  } catch (e) {
    console.error('Test error:', e && e.message);
    process.exit(2);
  }
})();
