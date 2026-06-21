const fs = require('fs');
const path = require('path');

const files = ['about.html', 'services.html', 'clinic.html', 'contact.html'];

const linkMap = {
    'Home': '/',
    'About': '/about.html',
    'About Us': '/about.html',
    'Services': '/services.html',
    'Clinic': '/clinic.html',
    'Clinic Tour': '/clinic.html',
    'Contact': '/contact.html',
};

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace specific anchor tags based on their text content
    for(const [text, href] of Object.entries(linkMap)) {
        // We look for href="#" followed by anything except > then > the text </a>
        const regex = new RegExp(`href="#"([^>]*)>\\s*${text}\\s*<\\/a>`, 'g');
        content = content.replace(regex, `href="${href}"$1>${text}</a>`);
    }
    
    // Specifically handle the "LUMINE DENTAL" brand links pointing to home
    content = content.replace(/href="#"([^>]*)>LUMINE DENTAL<\/a>/g, `href="/"$1>LUMINE DENTAL</a>`);
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
