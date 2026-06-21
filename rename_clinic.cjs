const fs = require('fs');

const files = ['index.html', 'about.html', 'services.html', 'clinic.html', 'contact.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Change "Clinic Tour" to "Clinic"
    content = content.replace(/>Clinic Tour</g, '>Clinic<');
    content = content.replace(/Clinic Tour/g, 'Clinic');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
