const fs = require('fs');
const { JSDOM } = require('jsdom');

const files = ['index.html', 'about.html', 'services.html', 'clinic.html', 'contact.html'];

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 1. Mobile Navigation
    const navBar = document.querySelector('nav > div.flex.justify-between.items-center');
    if (navBar) {
        // Find the CTA button (last element in the flex container)
        const ctaBtn = navBar.querySelector('button') || navBar.querySelector('a.bg-gold-standard');
        if (ctaBtn) {
            ctaBtn.classList.add('hidden', 'md:inline-block');
        }

        // Check if hamburger already exists to avoid duplicates
        if (!document.getElementById('mobile-menu-btn')) {
            const hamburger = document.createElement('button');
            hamburger.id = 'mobile-menu-btn';
            hamburger.className = 'md:hidden text-gold-standard p-2 focus:outline-none';
            hamburger.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
            navBar.appendChild(hamburger);
        }
    }

    // Clone the desktop links for the mobile menu
    const desktopNavLinks = document.querySelector('.hidden.md\\:flex.items-center, .hidden.md\\:flex.gap-10, .hidden.md\\:flex.gap-8');
    let mobileLinksHtml = '';
    if (desktopNavLinks) {
        // Extract links and style them for mobile
        const links = desktopNavLinks.querySelectorAll('a');
        links.forEach(a => {
            const href = a.getAttribute('href');
            const text = a.textContent;
            mobileLinksHtml += `<a href="${href}" class="block text-xl font-headline text-on-surface hover:text-gold-standard py-4 border-b border-gold-standard/10">${text}</a>`;
        });
    }

    // Add mobile menu container if not exists
    if (!document.getElementById('mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.className = 'fixed inset-0 bg-background z-40 transform translate-x-full transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-gutter shadow-2xl overflow-y-auto';
        mobileMenu.innerHTML = `
            <button id="close-menu-btn" class="absolute top-6 right-gutter text-gold-standard p-2 focus:outline-none">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="flex flex-col mt-8">
                ${mobileLinksHtml}
            </div>
            <div class="mt-8 mb-8">
                <button class="w-full bg-gold-standard text-white py-4 rounded-four uppercase tracking-widest font-bold">Book Appointment</button>
            </div>
        `;
        document.body.appendChild(mobileMenu);

        // Add script toggle
        const script = document.createElement('script');
        script.innerHTML = `
            document.addEventListener('DOMContentLoaded', () => {
                const menuBtn = document.getElementById('mobile-menu-btn');
                const closeBtn = document.getElementById('close-menu-btn');
                const mobileMenu = document.getElementById('mobile-menu');
                
                if(menuBtn && closeBtn && mobileMenu) {
                    menuBtn.addEventListener('click', () => {
                        mobileMenu.classList.remove('translate-x-full');
                    });
                    closeBtn.addEventListener('click', () => {
                        mobileMenu.classList.add('translate-x-full');
                    });
                }
            });
        `;
        document.body.appendChild(script);
    }

    // 2. Fix specific file issues
    if (file === 'index.html') {
        document.querySelectorAll('img[class*="w-[896px]"]').forEach(img => {
            img.classList.remove('w-[896px]');
            img.classList.add('min-w-[200vw]', 'md:min-w-[896px]', 'w-auto', 'max-w-none');
        });
        
        document.querySelectorAll('h1').forEach(h1 => {
            h1.classList.remove('text-5xl');
            h1.classList.add('text-4xl', 'md:text-6xl', 'lg:text-7xl');
        });
    }

    if (file === 'about.html') {
        document.querySelectorAll('.w-40.h-40').forEach(el => {
            el.classList.remove('w-40', 'h-40', '-top-10', '-left-10', '-bottom-10', '-right-10');
            el.classList.add('w-20', 'h-20', 'md:w-40', 'md:h-40', '-top-4', '-left-4', 'md:-top-10', 'md:-left-10');
            
            // Re-add the specific bottom/right ones if they had it
            if (el.classList.contains('border-r')) {
                el.classList.add('-bottom-4', '-right-4', 'md:-bottom-10', 'md:-right-10');
            }
        });
    }

    if (file === 'services.html') {
        document.querySelectorAll('.w-64.h-64').forEach(el => {
            el.classList.remove('w-64', 'h-64');
            el.classList.add('w-32', 'h-32', 'md:w-64', 'md:h-64');
        });
        
        // We also have .w-40.h-40 in services.html for the gallery
        document.querySelectorAll('.w-40.h-40').forEach(el => {
            el.classList.remove('w-40', 'h-40', '-top-10', '-left-10', '-bottom-10', '-right-10');
            el.classList.add('w-20', 'h-20', 'md:w-40', 'md:h-40', '-top-4', '-left-4', 'md:-top-10', 'md:-left-10');
            if (el.classList.contains('border-r')) {
                el.classList.add('-bottom-4', '-right-4', 'md:-bottom-10', 'md:-right-10');
            }
        });
    }

    if (file === 'clinic.html') {
        const mapContainer = document.querySelector('.aspect-video');
        if (mapContainer) {
            mapContainer.classList.add('min-h-[300px]');
        }
    }

    // Overwrite the file with the new serialized DOM
    // JSDOM might insert missing tags but since these are full HTML files, it's fine.
    fs.writeFileSync(file, dom.serialize());
    console.log(`Processed ${file}`);
});
